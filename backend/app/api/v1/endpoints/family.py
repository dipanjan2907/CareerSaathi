from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db_session, get_llm_provider
from app.core.exceptions import NotFoundException, LLMServiceException
from app.infrastructure.llm.base import BaseLLMProvider
from app.schemas.decision import FamilyMediationRequest, FamilyMediationResponse
from app.services.family_service import FamilyService

router = APIRouter()


@router.post("/mediate", response_model=FamilyMediationResponse)
async def mediate_family_decision(
    payload: FamilyMediationRequest,
    language: str = Query(
        "English", description="Output language for family mediation"
    ),
    db: AsyncSession = Depends(get_db_session),
    llm_provider: BaseLLMProvider = Depends(get_llm_provider),
):
    """
    Generates an objective, neutral trade-off comparison between student choice and parent choice.
    """
    try:
        service = FamilyService(session=db, llm_provider=llm_provider)
        return await service.generate_mediation(request=payload, language=language)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except LLMServiceException as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=e.message
        )
