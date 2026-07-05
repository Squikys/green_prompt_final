"""
LLM-based prompt optimizer using Qwen2.5-0.5B-Instruct.

Why Qwen2.5-0.5B?
  - ~500 MB download  (vs Phi-3-mini's 7.6 GB)
  - ~1 GB RAM at runtime in bfloat16
  - Fully instruction-tuned: follows JSON output instructions reliably
  - Fast on CPU (< 5 s per request)
"""

import json
import re
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Singleton model holder — loaded once at startup, reused for every request
# ---------------------------------------------------------------------------
_llm_optimizer_instance: Optional["LLMOptimizer"] = None


def get_llm_optimizer() -> "LLMOptimizer":
    """Return (and lazily create) the singleton LLMOptimizer."""
    global _llm_optimizer_instance
    if _llm_optimizer_instance is None:
        _llm_optimizer_instance = LLMOptimizer()
    return _llm_optimizer_instance


class LLMOptimizer:
    """
    Wraps Qwen/Qwen2.5-0.5B-Instruct to produce three optimized
    variants (conservative / balanced / aggressive) of a given prompt.

    The model is loaded once when the class is instantiated and kept in
    memory for the lifetime of the server process.
    """

    MODEL_NAME = "Qwen/Qwen2.5-1.5B-Instruct"

    # System instruction with a concrete few-shot example.
    # Small models (0.5B) need to SEE the task rather than read rules about it.
    # System instruction with a concrete few-shot example.
    # Small models (0.5B) need to SEE the task rather than read rules about it.
    SYSTEM_PROMPT = (
        "You are a prompt rewriter. Shorten AI prompts while preserving ALL specific details.\n"
        "CRITICAL: Keep all specific nouns, algorithms, variable names, and technical terms exactly.\n"
        "Return ONLY a JSON object with keys: \"conservative\", \"balanced\", \"aggressive\".\n"
        "Do NOT answer the prompt. Do NOT explain. Output JSON only.\n\n"
        "Example:\n"
        "Input: Can you please help me write a very detailed and comprehensive analysis of climate change impacts on coral reefs?\n"
        "Output: {\"conservative\": \"Write a detailed analysis of climate change impacts on coral reefs.\", "
        "\"balanced\": \"Analyze climate change impacts on coral reefs.\", "
        "\"aggressive\": \"Climate change effects on coral reefs.\"}\n\n"
        "Notice: the specific topic 'coral reefs' is kept in ALL three variants."
    )

    def __init__(self):
        self.loaded = False
        self.tokenizer = None
        self.model = None
        self._load_model()

    # ------------------------------------------------------------------
    # Model loading
    # ------------------------------------------------------------------

    def _load_model(self):
        """Load Qwen2.5-0.5B-Instruct from HuggingFace Hub (downloads on first run)."""
        try:
            from transformers import AutoModelForCausalLM, AutoTokenizer
            import torch

            logger.info(f"Loading {self.MODEL_NAME} (~500 MB download on first run)...")

            self.tokenizer = AutoTokenizer.from_pretrained(self.MODEL_NAME)

            # bfloat16 is not supported on all CPU builds; fall back to float32
            dtype = torch.bfloat16 if torch.cuda.is_available() else torch.float32
            self.model = AutoModelForCausalLM.from_pretrained(
                self.MODEL_NAME,
                torch_dtype=dtype,
                device_map="auto",
            )
            self.model.eval()
            self.loaded = True
            logger.info(f"✓ {self.MODEL_NAME} loaded (dtype={dtype}, device={self.model.device}).")

        except Exception:
            logger.exception("Failed to load LLM model — /optimize/ai will be unavailable.")
            self.loaded = False

    # ------------------------------------------------------------------
    # Inference
    # ------------------------------------------------------------------

    def _build_messages(self, user_prompt: str) -> list[dict]:
        # Prefix clearly marks this as a rewrite task, not a question to answer.
        return [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            {"role": "user",   "content": f"Rewrite this prompt: {user_prompt}"},
        ]

    def _generate(self, user_prompt: str, max_new_tokens: int = 512) -> str:
        """Run inference and return raw generated text."""
        import torch

        messages = self._build_messages(user_prompt)

        # transformers v5: apply_chat_template returns a BatchEncoding (dict-like),
        # NOT a raw tensor. Use return_dict=True and unpack with ** into generate().
        inputs = self.tokenizer.apply_chat_template(
            messages,
            add_generation_prompt=True,
            return_tensors="pt",
            return_dict=True,
        ).to(self.model.device)

        with torch.no_grad():
            output_ids = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                do_sample=False,   # greedy — deterministic, fast
                eos_token_id=self.tokenizer.eos_token_id,
                pad_token_id=self.tokenizer.eos_token_id,
            )

        # Decode only the newly generated tokens (strip the prompt prefix)
        prompt_len = inputs["input_ids"].shape[-1]
        new_tokens = output_ids[0][prompt_len:]
        return self.tokenizer.decode(new_tokens, skip_special_tokens=True).strip()

    def _parse_variants(self, raw: str, original: str) -> dict:
        """
        Extract the JSON object from the model output.
        Falls back to the original prompt for any missing / invalid field.
        """
        # Try to find the first {...} block in the output
        match = re.search(r'\{[^{}]*\}', raw, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group())
                return {
                    "conservative": str(data.get("conservative") or original).strip() or original,
                    "balanced":     str(data.get("balanced")     or original).strip() or original,
                    "aggressive":   str(data.get("aggressive")   or original).strip() or original,
                }
            except json.JSONDecodeError:
                pass

        logger.warning("LLM did not return valid JSON; falling back to original prompt.")
        return {"conservative": original, "balanced": original, "aggressive": original}

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def optimize(self, prompt: str, output_format: str = "compressed") -> dict:
        """
        Returns a dict with keys: conservative, balanced, aggressive.
        Each value is a rewritten version of `prompt`.

        If output_format is "compressed", appends an instruction to the LLM to reply concisely.
        """
        if not self.loaded:
            logger.warning("LLM not loaded — returning original prompt for all variants.")
            variants = {"conservative": prompt, "balanced": prompt, "aggressive": prompt}
        else:
            try:
                raw = self._generate(prompt)
                logger.info(f"Qwen raw output: {raw!r}")
                variants = self._parse_variants(raw, prompt)
            except Exception:
                logger.exception("Qwen inference error")
                variants = {"conservative": prompt, "balanced": prompt, "aggressive": prompt}

        if output_format == "compressed":
            suffix = " Reply concisely."
            variants["conservative"] += suffix
            variants["balanced"] += suffix
            variants["aggressive"] += suffix
            
        return variants
