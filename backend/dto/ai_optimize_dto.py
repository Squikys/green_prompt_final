from pydantic import BaseModel, Field
from typing import Optional, List


class PromptRequest(BaseModel):
    """Request model for prompt optimization."""
    text: str = Field(..., min_length=1, max_length=10000,
                      description="The text to optimize")
    max_length: Optional[int] = Field(
        50, ge=20, le=200, description="Maximum length for summarization")
    min_length: Optional[int] = Field(
        20, ge=10, le=100, description="Minimum length for summarization")
    top_keywords: Optional[int] = Field(
        5, ge=1, le=20, description="Number of top keywords to extract")


class KeywordResponse(BaseModel):
    """Response model for keyword extraction."""
    keywords: List[str] = Field(..., description="List of extracted keywords")
    count: int = Field(..., description="Number of keywords extracted")


class SummaryResponse(BaseModel):
    """Response model for text summarization."""
    summary: str = Field(..., description="Summarized text")
    original_length: int = Field(..., description="Length of original text")
    summary_length: int = Field(..., description="Length of summary")
    compression_ratio: float = Field(...,
                                     description="Compression ratio (summary/original)")


class OptimizedPromptResponse(BaseModel):
    """Complete response model for prompt optimization."""
    original: str = Field(..., description="Original text")
    original_length: int = Field(..., description="Length of original text")

    summarized: str = Field(..., description="Summarized version")
    summary_length: int = Field(..., description="Length of summary")

    keyword_based: str = Field(..., description="Keyword-compressed version")
    keywords_count: int = Field(..., description="Number of keywords used")

    compression_ratios: dict = Field(...,
                                     description="Compression ratios for different methods")


class HealthResponse(BaseModel):
    """Health check response model."""
    status: str = Field(..., description="Service status")
    models_loaded: bool = Field(...,
                                description="Whether ML models are loaded")
    version: str = Field(..., description="API version")


class OptimizedEnergyResponse(OptimizedPromptResponse):
    """Response model for energy-optimized prompt."""
    energy_consumed_original: float = Field(..., description="Energy consumed during processing")
    energy_consumed_summarized: float = Field(..., description="Energy consumed for summarized text")
    carbon_footprint_original: float = Field(..., description="Estimated carbon footprint")
    carbon_footprint_summarized: float = Field(..., description="Estimated carbon footprint for summarized text")
    energy_savings: float = Field(..., description="Energy savings from optimization")
    carbon_savings: float = Field(..., description="Carbon savings from optimization")