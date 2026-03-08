import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer
from collections import defaultdict
import re
from dto.optimize_prompt_dto import PromptResponse

# Download required NLTK data (run once)


def download_nltk_data():
    """Download all required NLTK data"""
    required_data = [
        ('tokenizers/punkt', 'punkt'),
        ('tokenizers/punkt_tab', 'punkt_tab'),
        ('corpora/stopwords', 'stopwords'),
        ('taggers/averaged_perceptron_tagger', 'averaged_perceptron_tagger'),
        ('taggers/averaged_perceptron_tagger_eng',
         'averaged_perceptron_tagger_eng'),
        ('corpora/wordnet', 'wordnet'),
        ('corpora/omw-1.4', 'omw-1.4')  # For wordnet lemmatizer
    ]

    for data_path, download_name in required_data:
        try:
            nltk.data.find(data_path)
            print(f"✓ {download_name} already available")
        except LookupError:
            print(f"Downloading {download_name}...")
            try:
                nltk.download(download_name)
                print(f"✓ {download_name} downloaded successfully")
            except Exception as e:
                print(f"⚠ Could not download {download_name}: {e}")
                print("Trying alternative method...")
                # Try without checking path first
                nltk.download(download_name, quiet=False)


# Download data
print("Checking and downloading required NLTK data...")
try:
    download_nltk_data()
    print("All NLTK data ready!\n")
except Exception as e:
    print(f"Warning: Some NLTK data may not be available: {e}")
    print("The script will use fallback methods where needed.\n")


class PromptOptimizer:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.custom_stop_words = {'english': {
            'please', 'kindly', 'a', 'an', 'the', 'such',
            'only', 'own', 'same', 'so', 'than', 'too',
            'very', 'about', 'after', 'all', 'also', 'any'
        }}
        self.lemmatizer = WordNetLemmatizer()

        # Request clauses and phrases to remove
        self.request_clauses = [
            # Direct requests
            r'\bhelp me\b',
            r'\bhelp me to\b',
            r'\bhelp me with\b',
            r'\bcan you help me\b',
            r'\bcould you help me\b',
            r'\bwould you help me\b',
            r'\bplease help me\b',
            r'\bassist me\b',
            r'\bassist me with\b',
            r'\bguide me\b',

            # Polite requests
            r'\bi would like\b',
            r'\bi would like to\b',
            r'\bi want to\b',
            r'\bi need to\b',
            r'\bi need you to\b',
            r'\bi want you to\b',
            r'\bi would appreciate\b',
            r'\bi would be grateful\b',
            r'\bi would love\b',
            r'\bi would prefer\b',
            r'\bi wish to\b',
            r'\bi hope to\b',
            r'\bi\'d like\b',
            r'\bi\'d love\b',
            r'\bi\'d appreciate\b',

            # Question starters
            r'\bcan you\b',
            r'\bcould you\b',
            r'\bwould you\b',
            r'\bwill you\b',
            r'\bare you able to\b',
            r'\bis it possible to\b',
            r'\bis it possible for you to\b',
            r'\bwould it be possible\b',
            r'\bdo you think you could\b',
            r'\bmight you be able to\b',
            r'\bwould you mind\b',
            r'\bcould you possibly\b',
            r'\bwould you please\b',
            r'\bcould you please\b',
            r'\bcan you please\b',

            # Courtesy phrases
            r'\bplease\b',
            r'\bkindly\b',
            r'\bif you could\b',
            r'\bif possible\b',
            r'\bif you don\'t mind\b',
            r'\bif you would\b',
            r'\bif you can\b',
            r'\bif you may\b',
            r'\bthank you\b',
            r'\bthanks\b',
            r'\bthank you very much\b',
            r'\bthanks in advance\b',
            r'\bthank you in advance\b',
            r'\bmuch appreciated\b',
            r'\bi appreciate it\b',

            # AI-specific unnecessary phrases
            r'\bas an ai\b',
            r'\byou\'re an ai\b',
            r'\bsince you\'re an ai\b',
            r'\bbeing an ai\b',
            r'\bas a language model\b',
            r'\bas a large language model\b',
            r'\busing your ai capabilities\b',
            r'\bwith your ai knowledge\b',
            r'\byour artificial intelligence\b',
            r'\byour machine learning\b',
            r'\byour training data\b',
            r'\byour knowledge base\b',
            r'\bfrom your training\b',
            r'\byou should know\b',
            r'\byou probably know\b',
            r'\byou must know\b',
            r'\bi\'m sure you know\b',
            r'\bobviously you know\b',

            # Uncertainty phrases
            r'\bi think\b',
            r'\bi believe\b',
            r'\bi guess\b',
            r'\bi suppose\b',
            r'\bmaybe\b',
            r'\bperhaps\b',
            r'\bpossibly\b',
            r'\bprobably\b',
            r'\bpresumably\b',
            r'\bapparently\b',
            r'\bseemingly\b',
            r'\ballegedly\b',
            r'\bsupposedly\b',

            # Redundant starters
            r'\bso\b',
            r'\bwell\b',
            r'\bokay\b',
            r'\balright\b',
            r'\bbasically\b',
            r'\bessentially\b',
            r'\bfundamentally\b',
            r'\boverall\b',
            r'\bin general\b',
            r'\bgenerally speaking\b',
            r'\bto be honest\b',
            r'\bto be frank\b',
            r'\bto tell the truth\b',
            r'\bfrankly\b',
            r'\bhonestly\b',

            # Filler phrases
            r'\byou know\b',
            r'\bi mean\b',
            r'\blike\b(?=\s)',  # Only remove standalone 'like'
            r'\bactually\b',
            r'\breally\b',
            r'\bjust\b',
            r'\bsimply\b',
            r'\bmerely\b',
            r'\bonly\b',
            r'\bquite\b',
            r'\brather\b',
            r'\bsort of\b',
            r'\bkind of\b',
            r'\bsomewhat\b',
            r'\ba bit\b',
            r'\ba little\b',
            r'\bpretty much\b',
            r'\bmore or less\b',
            r'\bby the way\b',
            r'\banyway\b',
            r'\banyhow\b',

            # Conversational starters
            r'\bhi\b',
            r'\bhello\b',
            r'\bhey\b',
            r'\bgreetings\b',
            r'\bgood morning\b',
            r'\bgood afternoon\b',
            r'\bgood evening\b',
            r'\bexcuse me\b',
            r'\bsorry\b',
            r'\bpardon me\b',
            r'\bforgive me\b',
            r'\bapologies\b',
            r'\bmy apologies\b',

            # Unnecessary qualifiers
            r'\bif i may ask\b',
            r'\bif you don\'t mind me asking\b',
            r'\bif i might ask\b',
            r'\bif i may inquire\b',
            r'\bif that\'s okay\b',
            r'\bif that\'s alright\b',
            r'\bif that makes sense\b',
            r'\bdoes that make sense\b',
            r'\bdo you understand\b',
            r'\bdo you follow\b',
            r'\bdo you see what i mean\b',
            r'\bget what i\'m saying\b',
            r'\bknow what i mean\b',

            # Redundant emphasis
            r'\bvery much\b',
            r'\bso much\b',
            r'\btoo much\b',
            r'\bway too\b',
            r'\bfar too\b',
            r'\bextremely\b',
            r'\bincredibly\b',
            r'\bamazingly\b',
            r'\babsolutely\b',
            r'\btotally\b',
            r'\bcompletely\b',
            r'\bentirely\b',
            r'\bperfectly\b',

            # Time-wasting phrases
            r'\bfirst of all\b',
            r'\bto begin with\b',
            r'\bto start with\b',
            r'\blet me start by saying\b',
            r'\blet me begin by\b',
            r'\bbefore i begin\b',
            r'\bbefore we start\b',
            r'\bbefore anything else\b',
            r'\bfirst and foremost\b',
            r'\bfirst things first\b',
            r'\bfor starters\b',
            r'\bto kick things off\b',
            r'\bto get started\b',
            r'\bto get the ball rolling\b',

            # Unnecessary context
            r'\bas i mentioned\b',
            r'\bas i said\b',
            r'\bas i told you\b',
            r'\blike i said\b',
            r'\blike i mentioned\b',
            r'\blike i told you\b',
            r'\bas you know\b',
            r'\bas you\'re aware\b',
            r'\bas you might know\b',
            r'\bas you probably know\b',
            r'\bas you can imagine\b',
            r'\bas you can see\b',
            r'\bobviously\b',
            r'\bof course\b',
            r'\bnaturally\b',
            r'\bneedless to say\b',
            r'\bit goes without saying\b',

            # Redundant closings
            r'\bthat\'s all\b',
            r'\bthat\'s it\b',
            r'\bthat\'s everything\b',
            r'\bthat\'s about it\b',
            r'\bthat should do it\b',
            r'\bthat should be enough\b',
            r'\bthat covers it\b',
            r'\bthat\'s the gist\b',
            r'\bin summary\b',
            r'\bto summarize\b',
            r'\bto sum up\b',
            r'\bin conclusion\b',
            r'\bto conclude\b',
            r'\bfinally\b',
            r'\blastly\b',
            r'\bin the end\b',
            r'\bat the end of the day\b',
            r'\ball in all\b',
            r'\boverall\b',

            # Metacognitive phrases (AI doesn't need these)
            r'\blet me think\b',
            r'\blet me see\b',
            r'\blet me consider\b',
            r'\blet me check\b',
            r'\blet me figure out\b',
            r'\blet me work on\b',
            r'\blet me try\b',
            r'\bi\'ll try\b',
            r'\bi\'ll attempt\b',
            r'\bi\'ll see what i can do\b',
            r'\bi\'ll do my best\b',
            r'\bi\'ll give it a shot\b',
            r'\bi\'ll work on it\b',

            # Emotional/personal phrases (irrelevant for AI)
            r'\bi feel like\b',
            r'\bi feel that\b',
            r'\bit feels like\b',
            r'\bin my opinion\b',
            r'\bin my view\b',
            r'\bfrom my perspective\b',
            r'\bfrom my point of view\b',
            r'\bpersonally\b',
            r'\bfor me\b',
            r'\bas for me\b',
            r'\bspeaking for myself\b',
            r'\bif you ask me\b',

            # Redundant question frames
            r'\bi have a question\b',
            r'\bi wanted to ask\b',
            r'\bi was wondering\b',
            r'\bi\'m curious about\b',
            r'\bi\'m interested in\b',
            r'\bi\'d like to know\b',
            r'\bi\'d like to ask\b',
            r'\bi\'d like to inquire\b',
            r'\bi\'d like to find out\b',
            r'\bi need to know\b',
            r'\bi want to know\b',
            r'\bi\'m trying to understand\b',
            r'\bi\'m trying to figure out\b',
            r'\bi\'m looking for\b',
            r'\bi\'m searching for\b',
            r'\bi\'m seeking\b',
        ]

        # Important POS tags to keep for prompt optimization
        self.important_pos_tags = {
            'NN', 'NNS', 'NNP', 'NNPS',  # Nouns
            'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ',  # Verbs
            'JJ', 'JJR', 'JJS',  # Adjectives
            'RB', 'RBR', 'RBS',  # Adverbs
            'CD',  # Numbers
            'FW'   # Foreign words
        }

        # Less important POS tags (can be filtered more aggressively)
        self.filter_pos_tags = {
            'DT',   # Determiners (the, a, an)
            'IN',   # Prepositions
            'CC',   # Coordinating conjunctions
            'TO',   # to
            'PRP',  # Personal pronouns
            'PRP$',  # Possessive pronouns
            'WDT',  # Wh-determiners
            'WP',   # Wh-pronouns
            'WP$',  # Possessive wh-pronouns
            'WRB'   # Wh-adverbs
        }

    def remove_request_clauses(self, text):
        """Remove common request clauses and phrases"""
        original_text = text
        removed_clauses = []

        # Convert to lowercase for matching but preserve original case
        text_lower = text.lower()

        for clause_pattern in self.request_clauses:
            matches = re.finditer(clause_pattern, text_lower, re.IGNORECASE)
            for match in matches:
                removed_clauses.append(match.group())

        # Remove the clauses (case-insensitive)
        for clause_pattern in self.request_clauses:
            text = re.sub(clause_pattern, '', text, flags=re.IGNORECASE)

        # Clean up extra spaces and punctuation
        text = re.sub(r'\s+', ' ', text)  # Multiple spaces to single space
        # Remove orphaned commas/semicolons
        text = re.sub(r'\s*[,;]\s*', ' ', text)
        # Remove leading punctuation
        text = re.sub(r'^\s*[,;.\-]\s*', '', text)
        text = re.sub(r'\s*[,;]\s*$', '', text)  # Remove trailing punctuation
        text = text.strip()

        return text, removed_clauses

    def preprocess_text(self, text):
        """Basic text preprocessing"""
        # Convert to lowercase
        text = text.lower()

        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()

        # Remove special characters but keep alphanumeric (including Unicode like ₂) and basic punctuation
        text = re.sub(r'[^\w\s\-\.\,\!\?\:\;]', '', text, flags=re.UNICODE)

        return text

    def analyze_pos_tags(self, text):
        """Analyze POS tags in the text"""
        try:
            tokens = word_tokenize(text)
            pos_tags = pos_tag(tokens)
        except Exception as e:
            print(f"Error with NLTK POS tagging: {e}")
            print("Falling back to simple tokenization...")
            # Fallback: simple tokenization without POS tagging
            tokens = text.split()
            pos_tags = [(token, 'NN') for token in tokens]  # Default to noun

        pos_analysis = defaultdict(list)
        for word, pos in pos_tags:
            pos_analysis[pos].append(word)

        return pos_tags, pos_analysis

    def find_stopwords_by_pos(self, pos_tagged_tokens):
        """Find stopwords considering POS tags"""
        stopwords_found = []
        important_words = []

        for word, pos in pos_tagged_tokens:
            # Check if word is a traditional stopword
            is_stopword = word.lower() in self.stop_words

            # Check if POS tag suggests it's less important
            is_filterable_pos = pos in self.filter_pos_tags

            if is_stopword or is_filterable_pos:
                stopwords_found.append(
                    (word, pos, 'stopword' if is_stopword
                        else 'filterable_pos'))
            elif pos in self.important_pos_tags:
                important_words.append((word, pos))

        return stopwords_found, important_words

    def optimize_prompt_conservative(self, prompt):
        """Conservative optimization - only remove clear stopwords and request clauses"""
        # First remove request clauses
        text_no_clauses, removed_clauses = self.remove_request_clauses(prompt)

        processed_text = self.preprocess_text(text_no_clauses)
        tokens = word_tokenize(processed_text)
        pos_tags = pos_tag(tokens)

        optimized_tokens = []
        for word, pos in pos_tags:
            # Keep word if it's not a traditional stopword
            if (word.lower() not in self.stop_words and
                    word.lower() not in self.custom_stop_words['english']):
                optimized_tokens.append(word)

        return ' '.join(optimized_tokens)

    def optimize_prompt_aggressive(self, prompt):
        """Aggressive optimization - remove stopwords, request clauses, and less important POS tags"""
        # First remove request clauses
        text_no_clauses, removed_clauses = self.remove_request_clauses(prompt)

        processed_text = self.preprocess_text(text_no_clauses)
        tokens = word_tokenize(processed_text)
        pos_tags = pos_tag(tokens)

        optimized_tokens = []
        for word, pos in pos_tags:
            # Keep word only if it's important based on POS and not a stopword
            if (word.lower() not in self.stop_words and
                    pos in self.important_pos_tags and
                    word.lower() not in self.custom_stop_words['english']):
                optimized_tokens.append(word)

        return ' '.join(optimized_tokens)

    def optimize_prompt_balanced(self, prompt):
        """Balanced optimization - smart filtering based on context"""
        # First remove request clauses
        text_no_clauses, removed_clauses = self.remove_request_clauses(prompt)

        processed_text = self.preprocess_text(text_no_clauses)
        tokens = word_tokenize(processed_text)
        pos_tags = pos_tag(tokens)

        optimized_tokens = []
        for i, (word, pos) in enumerate(pos_tags):
            # Always keep important words
            if pos in self.important_pos_tags:
                optimized_tokens.append(word)
            # Keep some function words if they're important for context
            elif pos in self.filter_pos_tags:
                # Keep prepositions that might be important for meaning
                if pos == 'IN' and len(optimized_tokens) > 0:
                    optimized_tokens.append(word)
                # Keep some determiners in specific contexts
                elif pos == 'DT' and i < len(pos_tags) - 1:
                    next_pos = pos_tags[i + 1][1]
                    if next_pos in self.important_pos_tags:
                        optimized_tokens.append(word)
            # Remove clear stopwords
            elif (word.lower() not in self.stop_words and
                    word.lower() not in self.custom_stop_words['english']):
                optimized_tokens.append(word)

        return ' '.join(optimized_tokens)

    def analyze_prompt(self, prompt: str):
        """Comprehensive analysis of the prompt"""
        print(f"Original prompt: {prompt}")
        print(f"Length: {len(prompt)} characters, {len(prompt.split())} words")
        print("-" * 50)

        # Request clause analysis
        text_no_clauses, removed_clauses = self.remove_request_clauses(prompt)
        if removed_clauses:
            print("Request clauses removed:")
            for clause in set(removed_clauses):  # Remove duplicates
                print(f"  '{clause}'")
            print(f"Text after clause removal: {text_no_clauses}")
            print()

        # POS analysis
        pos_tags, pos_analysis = self.analyze_pos_tags(text_no_clauses)
        print("POS Tag Analysis:")
        for pos, words in sorted(pos_analysis.items()):
            print(f"  {pos}: {words}")
        print()

        # Stopword analysis
        stopwords_found, important_words = self.find_stopwords_by_pos(pos_tags)
        print("Stopwords and filterable words found:")
        for word, pos, reason in stopwords_found:
            print(f"  '{word}' ({pos}) - {reason}")
        print()

        print("Important words to keep:")
        for word, pos in important_words:
            print(f"  '{word}' ({pos})")
        print()

        # Optimization results
        conservative = self.optimize_prompt_conservative(prompt) or prompt
        aggressive = self.optimize_prompt_aggressive(prompt) or prompt
        balanced = self.optimize_prompt_balanced(prompt) or prompt

        print("Optimization Results:")
        print(f"Conservative: {conservative}")
        print(
            f"  Length: {len(conservative)} chars, "
            f"{len(conservative.split())} words")
        print()
        print(f"Aggressive: {aggressive}")
        print(
            f"  Length: {len(aggressive)} chars, "
            f"{len(aggressive.split())} words")
        print()
        print(f"Balanced: {balanced}")
        print(
            f"  Length: {len(balanced)} chars, {len(balanced.split())} words")

        return PromptResponse(
            original=str(prompt),
            conservative=str(conservative),
            aggressive=str(aggressive),
            balanced=str(balanced),
            removed_clauses=str(removed_clauses),
            text_after_clause_removal=str(text_no_clauses),
            pos_analysis=str(pos_analysis),
            stopwords_found=str(stopwords_found),
            important_words=str(important_words)
        )


# def main():
#     optimizer = PromptOptimizer()

#     # Example prompts
#     example_prompts = [
#         "Please write a detailed and comprehensive analysis of
#          the current market trends in the technology sector.",
#         "Can you help me understand the fundamental
#   `       concepts of machine learning algorithms?",
#         "I would like to know more about the benefits and drawbacks of
#           renewable energy sources.",
#         "Generate a creative story about a young adventurer who discovers a magical forest.",
#         "Explain the process of photosynthesis in plants in simple terms that a child can understand.",
#         "Help me write a Python function to calculate fibonacci numbers",
#         "I would like you to explain machine learning concepts",
#         "Can you please help me understand neural networks?",
#         "Hi, I need you to create a marketing strategy for my business"
#     ]

#     print("=== PROMPT OPTIMIZATION ANALYSIS ===\n")

#     for i, prompt in enumerate(example_prompts, 1):
#         print(f"EXAMPLE {i}:")
#         optimizer.analyze_prompt(prompt)
#         print("\n" + "="*80 + "\n")

#     # Interactive mode
#     print("Enter your own prompt to optimize (or 'quit' to exit):")
#     while True:
#         user_prompt = input("\nPrompt: ").strip()
#         if user_prompt.lower() in ['quit', 'exit', 'q']:
#             break
#         if user_prompt:
#             print()
#             optimizer.analyze_prompt(user_prompt)
#             print("\n" + "-"*50)


# if __name__ == "__main__":
#     main()
