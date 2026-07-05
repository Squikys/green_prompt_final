<p align="center">
  <img src="https://img.shields.io/badge/🌿-PromptGreen-10b981?style=for-the-badge&labelColor=064e3b" alt="PromptGreen" />
</p>

<h1 align="center">PromptGreen</h1>

<p align="center">
  <strong>Optimize your AI prompts. Reduce tokens, save energy, cut carbon emissions.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.10+-3776AB?logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-0.127-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 🌍 What is PromptGreen?

**PromptGreen** is an AI prompt optimization tool that shortens your prompts while preserving their meaning — reducing token usage, lowering energy consumption, and minimizing carbon emissions from LLM inference.

Every token sent to a large language model costs energy. PromptGreen helps you write **leaner prompts** so you can achieve the same results with a smaller environmental footprint.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔧 **Rule-Based Optimization** | NLTK-powered NLP pipeline that removes filler phrases, stopwords, and redundant clauses while preserving key meaning |
| 🤖 **LLM-Powered Optimization** | Uses [Qwen2.5-1.5B-Instruct](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct) to intelligently rewrite prompts at three aggressiveness levels |
| ⚡ **Energy & CO₂ Estimation** | Calculates token-level energy cost (mWh) and carbon emissions (gCO₂) for GPT-4, GPT-3.5, Claude, and more |
| 📝 **Spell Checking** | Integrated spell-check service with suggestions and accuracy scoring |
| 🎯 **Three Optimization Levels** | **Conservative**, **Balanced**, and **Aggressive** — choose how much to trim |
| 🌐 **Modern Web UI** | Beautiful dark-mode React landing page with live demo, typing animations, and real-time results |

---

## 🏗️ Architecture

```
greenPrompt_final/
├── backend/                    # FastAPI server (Python)
│   ├── main.py                 # Application entry point
│   ├── routers/
│   │   ├── optimize_router.py  # /optimize & /optimize/ai endpoints
│   │   └── spell_check_router.py  # /spell-check endpoint
│   ├── services/
│   │   ├── optimize.py         # NLTK rule-based prompt optimizer
│   │   ├── llm_optimize.py     # Qwen2.5 LLM-based optimizer
│   │   ├── energy_calculation.py  # Token energy & CO₂ calculator
│   │   └── spellCheck.py       # Spell checking service
│   ├── dto/                    # Pydantic request/response models
│   │   ├── optimize_prompt_dto.py
│   │   ├── ai_optimize_dto.py
│   │   ├── energy_dto.py
│   │   └── spell_check_dto.py
│   └── requirements.txt
├── frontend/                   # React + Vite + Tailwind (TypeScript-ready)
│   ├── src/
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── datasets/                   # (Placeholder for evaluation datasets)
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **pip** and **npm**
- (Optional) **CUDA GPU** — for faster LLM inference; CPU works fine

### 1. Clone the Repository

```bash
git clone https://github.com/Squikys/green_prompt_final.git
cd green_prompt_final
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) For LLM-powered optimization — install PyTorch & Transformers
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install transformers accelerate

# Run the server
uvicorn main:app --reload
```

The API will be available at **http://localhost:8000**. Interactive docs at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (if not present)
echo VITE_API_URL=http://localhost:8000 > .env

# Start the dev server
npm run dev
```

The UI will be available at **http://localhost:5173**.

---

## 📡 API Reference

### Prompt Optimization (Rule-Based)

```
POST /optimize
```

**Request Body:**
```json
{
  "text": "Can you please help me write a detailed analysis of climate change?",
  "output_format": "compressed",
  "model_name": "gpt-4"
}
```

**Response:** Returns `original`, `conservative`, `balanced`, and `aggressive` prompt variants along with energy savings (`energy_saved_*`), CO₂ emissions (`co2emission_*`), NLP analysis details (removed clauses, POS tags, stopwords).

---

### Prompt Optimization (LLM-Powered)

```
POST /optimize/ai
```

Same request/response shape as `/optimize`. Uses Qwen2.5-1.5B-Instruct for intelligent rewriting instead of NLTK rules.

```
GET /optimize/ai/status
```

Check whether the Qwen model is loaded and ready.

---

### Spell Check

```
POST /spell-check
```

**Request Body:**
```json
{
  "text": "Ths is a tset of spel checking"
}
```

**Response:** Returns misspelled words, suggestions, positions, word count, and accuracy percentage.

---

## ⚙️ How It Works

### Rule-Based Pipeline (`/optimize`)

1. **Clause Removal** — Strips 100+ common filler patterns (e.g., *"can you please help me"*, *"I would like to"*, *"thank you in advance"*)
2. **POS Tag Analysis** — Uses NLTK to identify nouns, verbs, adjectives (important) vs. determiners, prepositions, pronouns (filterable)
3. **Stopword Filtering** — Removes English stopwords and custom courtesy words
4. **Three-Level Output** — Conservative (stopwords only), Balanced (context-aware), Aggressive (important POS tags only)
5. **Energy Calculation** — Tokenizes with `tiktoken`, applies per-model energy costs (mWh/1K tokens), estimates CO₂

### LLM-Based Pipeline (`/optimize/ai`)

1. **Prompt Rewriting** — Sends the user's prompt to Qwen2.5-1.5B-Instruct with a few-shot system prompt
2. **JSON Parsing** — Extracts `conservative`, `balanced`, `aggressive` variants from the model's JSON output
3. **Energy Calculation** — Same token-level energy estimation as the rule-based path

---

## 🧮 Energy Model

Energy estimates are based on published research on LLM inference costs:

| Model | Energy per 1K Tokens |
|---|---|
| GPT-3.5 Turbo | 2 mWh |
| GPT-4 | 8 mWh |
| GPT-4 Turbo | 6 mWh |
| Claude 3 Sonnet | 5 mWh |
| Claude 3 Opus | 12 mWh |
| Claude 4 Sonnet | 5 mWh |
| Default | 5 mWh |

CO₂ emissions are estimated using a global average grid intensity of **0.5 kg CO₂/kWh**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python, FastAPI, Uvicorn |
| **NLP** | NLTK (tokenize, POS tag, lemmatize, stopwords) |
| **LLM** | Qwen2.5-1.5B-Instruct via HuggingFace Transformers |
| **Tokenization** | tiktoken (OpenAI token counting) |
| **Spell Check** | pyspellchecker |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3.4 |
| **Icons** | Lucide React |
| **Validation** | Pydantic v2 |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <sub>Built with 💚 for a greener AI future</sub>
</p>
