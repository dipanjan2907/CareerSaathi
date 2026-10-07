import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db_session, get_llm_provider
from app.core.exceptions import NotFoundException, LLMServiceException
from app.infrastructure.llm.base import BaseLLMProvider
from app.schemas.decision import CareerDecisionResponse
from app.services.decision_service import DecisionService
from app.models.assessment import AssessmentResult
from typing import List
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

@router.get("/{student_id}/history", response_model=List[dict])
async def get_assessment_history(
    student_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
):
    """Fetches all past assessment reports for a student."""
    result = await db.execute(
        select(AssessmentResult)
        .where(AssessmentResult.student_id == student_id)
        .order_by(AssessmentResult.created_at.desc())
    )
    records = result.scalars().all()
    return [
        {
            "id": str(r.id),
            "sector": r.sector,
            "created_at": r.created_at.isoformat(),
            "top_career": r.recommendations_payload[0]["career_title"] if r.recommendations_payload else None,
            "match_score": r.recommendations_payload[0]["match_score"] if r.recommendations_payload else None,
        }
        for r in records
    ]


@router.get("/report/{result_id}", response_model=dict)
async def get_saved_report(
    result_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
):
    """Retrieves a specific past assessment report by its UUID."""
    result = await db.execute(select(AssessmentResult).where(AssessmentResult.id == result_id))
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Report not found.")
        
    return {
        "result_id": str(record.id),
        "student_id": str(record.student_id),
        "sector": record.sector,
        "competency_vector": record.competency_vector,
        "recommendations": record.recommendations_payload,
        "counselling_explanation": record.counselling_explanation,
        "created_at": record.created_at.isoformat(),
    }