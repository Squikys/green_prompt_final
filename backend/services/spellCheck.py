from spellchecker import SpellChecker
import re
from typing import List, Optional, Dict
from dto.spell_check_dto import (
    SpellCheckResponse, SpellCheckData, MisspelledWord, 
    BatchSpellCheckResponse, SpellCheckSummary
)


class SpellCheckService:
    """
    A service class to handle spell checking operations with various configurations.
    """

    def __init__(self, language: str = "en", max_suggestions: int = 5):
        """
        Initialize the spell checker service.

        Args:
            language: Language code for spell checking (default: "en")
            max_suggestions: Maximum number of suggestions per misspelled word (default: 5)
        """
        self.language = language
        self.max_suggestions = max_suggestions
        try:
            self.spell_checker = SpellChecker(language=language)
        except Exception as e:
            print(f"Warning: Could not initialize spell checker for language {language}, using default")
            self.spell_checker = SpellChecker()

    def _extract_words(self, text: str) -> List[tuple]:
        """
        Extract words from text with their positions.

        Args:
            text: The input text to extract words from

        Returns:
            List of tuples containing (word, position)
        """
        words_with_positions = []
        # Find all words with their positions
        for match in re.finditer(r'\b[a-zA-Z]+\b', text):
            word = match.group().lower()
            position = match.start()
            words_with_positions.append((word, position))
        return words_with_positions

    def _get_suggestions(self, word: str) -> List[str]:
        """
        Get spelling suggestions for a misspelled word.

        Args:
            word: The misspelled word

        Returns:
            List of suggested corrections
        """
        suggestions = []
        
        # Get the best correction first
        best_correction = self.spell_checker.correction(word)
        if best_correction and best_correction != word:
            suggestions.append(best_correction)
        
        # Get other candidates
        candidates = self.spell_checker.candidates(word)
        if candidates:
            # Add other candidates, excluding the best correction to avoid duplicates
            other_candidates = [c for c in candidates if c != best_correction and c != word]
            # Limit to max_suggestions total
            remaining_slots = self.max_suggestions - len(suggestions)
            suggestions.extend(other_candidates[:remaining_slots])
        
        return suggestions

    def check_spelling(self, text: str) -> SpellCheckResponse:
        """
        Check spelling for a single text.

        Args:
            text: The text to check for spelling errors

        Returns:
            SpellCheckResponse: Complete spell check results
        """
        try:
            # Validate input
            if not text or not isinstance(text, str):
                return SpellCheckResponse(
                    status="error",
                    message="Invalid input: text must be a non-empty string",
                    data=None
                )
            
            # Extract words with positions
            words_with_positions = self._extract_words(text)
            
            if not words_with_positions:
                return SpellCheckResponse(
                    status="error",
                    message="No valid words found in the text",
                    data=None
                )
            
            # Get just the words for spell checking
            words = [word for word, _ in words_with_positions]
            
            # Find misspelled words
            misspelled_set = self.spell_checker.unknown(words)
            
            # Build detailed results
            misspelled_words = []
            for word, position in words_with_positions:
                if word in misspelled_set:
                    suggestions = self._get_suggestions(word)
                    misspelled_words.append(MisspelledWord(
                        misspelled_word=word,
                        suggestions=suggestions,
                        position=position
                    ))
            
            # Calculate accuracy
            total_words = len(words)
            misspelled_count = len(misspelled_words)
            accuracy = ((total_words - misspelled_count) / total_words * 100) if total_words > 0 else 0
            
            # Create response data
            data = SpellCheckData(
                original_text=text,
                total_words=total_words,
                misspelled_count=misspelled_count,
                misspelled_words=misspelled_words,
                accuracy_percentage=accuracy
            )
            
            message = f"Found {misspelled_count} misspelled word(s)" if misspelled_count > 0 else "No misspelled words found"
            
            return SpellCheckResponse(
                status="success",
                message=message,
                data=data
            )
            
        except Exception as e:
            return SpellCheckResponse(
                status="error",
                message=f"An error occurred during spell check: {str(e)}",
                data=None
            )

    def batch_check_spelling(self, texts: List[str]) -> BatchSpellCheckResponse:
        """
        Check spelling for multiple texts.

        Args:
            texts: List of texts to check for spelling errors

        Returns:
            BatchSpellCheckResponse: Results for all texts with summary statistics
        """
        try:
            if not texts or not isinstance(texts, list):
                return BatchSpellCheckResponse(
                    status="error",
                    message="Invalid input: texts must be a non-empty list",
                    results=[],
                    summary=None
                )
            
            results = []
            total_words = 0
            total_misspelled = 0
            successful_checks = 0
            
            for text in texts:
                result = self.check_spelling(text)
                results.append(result)
                
                if result.status == "success" and result.data:
                    total_words += result.data.total_words
                    total_misspelled += result.data.misspelled_count
                    successful_checks += 1
            
            # Calculate summary statistics
            overall_accuracy = ((total_words - total_misspelled) / total_words * 100) if total_words > 0 else 0
            
            summary = {
                "total_texts": len(texts),
                "successful_checks": successful_checks,
                "total_words": total_words,
                "total_misspelled": total_misspelled,
                "overall_accuracy": round(overall_accuracy, 2)
            }
            
            return BatchSpellCheckResponse(
                status="success",
                message=f"Processed {len(texts)} texts successfully",
                results=results,
                summary=summary
            )
            
        except Exception as e:
            return BatchSpellCheckResponse(
                status="error",
                message=f"An error occurred during batch spell check: {str(e)}",
                results=[],
                summary=None
            )

    def get_word_suggestions(self, word: str) -> List[str]:
        """
        Get spelling suggestions for a specific word.

        Args:
            word: The word to get suggestions for

        Returns:
            List of suggested corrections
        """
        if not word or not isinstance(word, str):
            return []
        
        return self._get_suggestions(word.lower())

    def add_words_to_dictionary(self, words: List[str]) -> bool:
        """
        Add words to the spell checker's dictionary.

        Args:
            words: List of words to add to the dictionary

        Returns:
            bool: True if successful, False otherwise
        """
        try:
            for word in words:
                if word and isinstance(word, str):
                    self.spell_checker.word_frequency.load_words([word.lower()])
            return True
        except Exception as e:
            print(f"Error adding words to dictionary: {e}")
            return False

    def set_language(self, language: str) -> bool:
        """
        Change the language for spell checking.

        Args:
            language: Language code to switch to

        Returns:
            bool: True if successful, False otherwise
        """
        try:
            self.spell_checker = SpellChecker(language=language)
            self.language = language
            return True
        except Exception as e:
            print(f"Error setting language to {language}: {e}")
            return False