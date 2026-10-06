import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db_session, get_llm_provider
from app.core.exceptions import LLMServiceException, NotFoundException
from app.infrastructure.llm.base import BaseLLMProvider
from app.schemas.assessment import (
    AssessmentSubmissionRequest,
    GeneratedAssessmentScenario,
)
from app.services.assessment_service import AssessmentService

router = APIRouter()


@router.post("/{student_id}/submit", response_model=dict)
async def submit_assessment(
    student_id: uuid.UUID,
    payload: AssessmentSubmissionRequest,
    db: AsyncSession = Depends(get_db_session),
):
    """
    Processes scenario-based micro-assessment responses and calculates
    the updated competency vector for the student profile.
    """
    try:
        service = AssessmentService(session=db)
        vector = await service.submit_assessment_responses(
            student_id=student_id, selected_option_keys=payload.selected_option_keys
        )
        return {"student_id": str(student_id), "competency_vector": vector}
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)


@router.get("/generate-scenario", response_model=GeneratedAssessmentScenario)
async def generate_dynamic_scenario(
    sector: str = Query(
        "Automotive",
        description="Vocational sector (e.g., Automotive, Healthcare, Renewable Energy)",
    ),
    llm_provider: BaseLLMProvider = Depends(get_llm_provider),
):
    """
    Dynamically generates a domain-specific micro-assessment scenario using Gemini
    constrained by strict JSON schema enforcement.
    """
    try:
        scenario_data = await llm_provider.generate_domain_scenario(sector=sector)
        return scenario_data
    except LLMServiceException as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=e.message
        )
