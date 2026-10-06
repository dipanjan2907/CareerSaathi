import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db_session, get_llm_provider
from app.core.exceptions import NotFoundException, LLMServiceException
from app.infrastructure.llm.base import BaseLLMProvider
from app.schemas.decision import CareerDecisionResponse
from app.services.decision_service import DecisionService

router = APIRouter()


@router.get("/{student_id}/evaluate", response_model=CareerDecisionResponse)
async def evaluate_career_decision(
    student_id: uuid.UUID,
    language: str = Query(
        "English", description="Target output language for counselling advice"
    ),
    db: AsyncSession = Depends(get_db_session),
    llm_provider: BaseLLMProvider = Depends(get_llm_provider),
):
    """
    Executes the deterministic decision engine, evaluates student vector against
    all vocational career baselines, applies constraints, and returns explanation.
    """
    try:
        service = DecisionService(session=db, llm_provider=llm_provider)
        return await service.evaluate_student_decision(
            student_id=student_id, language=language
        )
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except LLMServiceException as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Decision engine calculated scores successfully, but explanation engine is unavailable: {e.message}",
        )
