from pydantic import BaseModel


class PromptEnergyResponse(BaseModel):
    """Single response containing energy cost and carbon emissions for a prompt."""
    tokens: int
    model: str
    energy_wh: float
    energy_mwh: float
    co2_grams: float
