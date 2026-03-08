from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class SpellCheckRequest(BaseModel):
    """
    Request model for spell checking.
    """
    text: str = Field(..., description="The text to check for spelling errors", min_length=1)


class BatchSpellCheckRequest(BaseModel):
    """
    Request model for batch spell checking multiple texts.
    """
    texts: List[str] = Field(..., description="List of texts to check for spelling errors", min_items=1)


class MisspelledWord(BaseModel):
    """
    Model representing a misspelled word with suggestions.
    """
    misspelled_word: str = Field(..., description="The misspelled word")
    suggestions: List[str] = Field(default=[], description="List of suggested corrections")
    position: Optional[int] = Field(None, description="Position of the word in the original text")


class SpellCheckData(BaseModel):
    """
    Model containing detailed spell check results.
    """
    original_text: str = Field(..., description="The original text that was checked")
    total_words: int = Field(..., description="Total number of words in the text")
    misspelled_count: int = Field(..., description="Number of misspelled words found")
    misspelled_words: List[MisspelledWord] = Field(default=[], description="List of misspelled words and their suggestions")
    accuracy_percentage: float = Field(..., description="Percentage of correctly spelled words")


class SpellCheckResponse(BaseModel):
    """
    Response model for spell check operations.
    """
    status: str = Field(..., description="Status of the operation (success/error)")
    message: str = Field(..., description="Descriptive message about the result")
    data: Optional[SpellCheckData] = Field(None, description="Spell check results data")
    
    class Config:
        json_encoders = {
            float: lambda v: round(v, 2)
        }


class BatchSpellCheckResponse(BaseModel):
    """
    Response model for batch spell check operations.
    """
    status: str = Field(..., description="Status of the operation (success/error)")
    message: str = Field(..., description="Descriptive message about the result")
    results: List[SpellCheckResponse] = Field(default=[], description="List of spell check results")
    summary: Optional[Dict[str, int]] = Field(None, description="Summary statistics for the batch operation")


class SpellCheckSummary(BaseModel):
    """
    Model for spell check summary statistics.
    """
    total_texts: int
    total_words: int
    total_misspelled: int
    overall_accuracy: float