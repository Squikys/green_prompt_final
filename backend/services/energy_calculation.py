import tiktoken
import math
from typing import Optional
from dto.energy_dto import PromptEnergyResponse


class TokenEnergyCalculator:
    """
    A class to calculate token count and energy cost for processing prompts.
    """

    def __init__(self, model_name: str = "gpt-4"):
        """
        Initialize the calculator with a specific model.

        Args:
            model_name: The model to use for tokenization (default: "gpt-4")
        """
        self.model_name = model_name
        try:
            self.tokenizer = tiktoken.encoding_for_model(model_name)
        except KeyError:
            # Fallback to cl100k_base encoding (used by GPT-4)
            print(
                f"Warning: Model {model_name} not found, using cl100k_base encoding")
            self.tokenizer = tiktoken.get_encoding("cl100k_base")

        # Energy cost estimates (in Wh per 1000 tokens)
        # These are rough estimates based on research and may vary
        self.energy_costs = {
            "gpt-3.5-turbo": 0.002,  # 2 mWh per 1000 tokens
            "gpt-4": 0.008,          # 8 mWh per 1000 tokens
            "gpt-4-turbo": 0.006,    # 6 mWh per 1000 tokens
            "claude-3-sonnet": 0.005,  # 5 mWh per 1000 tokens
            "claude-3-opus": 0.012,   # 12 mWh per 1000 tokens
            "claude-4-sonnet": 0.005,  # 5 mWh per 1000 tokens (estimated)
            "default": 0.005         # Default estimate
        }

    def count_tokens(self, text: str) -> int:
        """
        Count the number of tokens in the given text.

        Args:
            text: The input text to tokenize

        Returns:
            int: Number of tokens in the text
        """
        try:
            tokens = self.tokenizer.encode(text)
            return len(tokens)
        except Exception as e:
            print(f"Error tokenizing text: {e}")
            # Fallback: rough estimate of 4 characters per token
            return math.ceil(len(text) / 4)

    def analyze_prompt(self, prompt: str, model: Optional[str] = None) -> PromptEnergyResponse:
        """
        Analyze a prompt to get token count, energy cost, and carbon emissions.

        Args:
            prompt: The prompt text to analyze
            model: Model name (optional)

        Returns:
            PromptEnergyResponse: Energy cost and carbon emissions information
        """
        if model is None:
            model = self.model_name

        # Count tokens
        token_count = self.count_tokens(prompt)

        # Get energy cost per 1000 tokens
        cost_per_1k = self.energy_costs.get(
            model, self.energy_costs["default"])

        # Calculate total energy cost in Wh
        energy_wh = (token_count / 1000) * cost_per_1k
        energy_mwh = energy_wh * 1000  # Convert to mWh

        # Estimate CO2 emissions (using global average of ~0.5 kg CO2/kWh)
        co2_grams = (energy_wh / 1000) * 500  # Convert to grams of CO2

        return PromptEnergyResponse(
            tokens=token_count,
            model=model,
            energy_wh=round(energy_wh, 6),
            energy_mwh=round(energy_mwh, 3),
            co2_grams=round(co2_grams, 6)
        )
