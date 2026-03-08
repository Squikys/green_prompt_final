from fastapi import APIRouter, HTTPException, Query
from services.spellCheck import SpellCheckService
from dto.spell_check_dto import SpellCheckRequest, SpellCheckResponse

router = APIRouter(tags=["Spelling check"])

# Initialize the spell check service
spell_check_service = SpellCheckService()

@router.post("/spell-check", response_model=SpellCheckResponse)
async def spell_check(request: SpellCheckRequest):
    """
    Check spelling for a single text via request body.
    """
    try:
        result = spell_check_service.check_spelling(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
