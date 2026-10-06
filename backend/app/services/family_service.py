import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.domain.decision_engine import DomainDecisionEngine
from app.infrastructure.llm.base import BaseLLMProvider
from app.repositories.career_repository import CareerRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.decision import (
    FamilyMediationRequest,
    FamilyMediationResponse,
    TradeoffFactor,
)


class FamilyService:
    def __init__(self, session: AsyncSession, llm_provider: BaseLLMProvider):
        self.session = session
        self.career_repo = CareerRepository(session)
        self.student_repo = StudentRepository(session)
        self.llm_provider = llm_provider

    async def generate_mediation(
        self, request: FamilyMediationRequest, language: str = "English"
    ) -> FamilyMediationResponse:
        student = await self.student_repo.get_by_id(uuid.UUID(request.student_id))
        if not student:
            raise NotFoundException("Student profile not found.")

        career_s = await self.career_repo.get_by_id(
            uuid.UUID(request.student_preferred_career_id)
        )
        career_f = await self.career_repo.get_by_id(
            uuid.UUID(request.family_preferred_career_id)
        )

        if not career_s or not career_f:
            raise NotFoundException("One or both selected careers were not found.")

        fit_s = DomainDecisionEngine.rank_career(
            career_id=str(career_s.id),
            career_title=career_s.title,
            student_vector=student.competency_vector,
            baseline_vector=career_s.competency_baseline,
            max_budget=student.max_family_budget,
            max_duration=student.max_duration_months,
            min_salary=student.min_expected_salary,
            training_cost=career_s.min_training_cost,
            training_duration=career_s.training_duration_months,
            projected_salary=career_s.average_starting_salary,
            demand_index=career_s.demand_index,
        )

        fit_f = DomainDecisionEngine.rank_career(
            career_id=str(career_f.id),
            career_title=career_f.title,
            student_vector=student.competency_vector,
            baseline_vector=career_f.competency_baseline,
            max_budget=student.max_family_budget,
            max_duration=student.max_duration_months,
            min_salary=student.min_expected_salary,
            training_cost=career_f.min_training_cost,
            training_duration=career_f.training_duration_months,
            projected_salary=career_f.average_starting_salary,
            demand_index=career_f.demand_index,
        )

        tradeoffs = [
            TradeoffFactor(
                factor_name="Aptitude & Skills Fit",
                option_a_value=f"{fit_s.match_score}%",
                option_b_value=f"{fit_f.match_score}%",
                favorable_option=(
                    career_s.title
                    if fit_s.match_score >= fit_f.match_score
                    else career_f.title
                ),
            ),
            TradeoffFactor(
                factor_name="Training Cost",
                option_a_value=f"₹{career_s.min_training_cost:,.0f}",
                option_b_value=f"₹{career_f.min_training_cost:,.0f}",
                favorable_option=(
                    career_s.title
                    if career_s.min_training_cost <= career_f.min_training_cost
                    else career_f.title
                ),
            ),
            TradeoffFactor(
                factor_name="Time to Employment",
                option_a_value=f"{career_s.training_duration_months} months",
                option_b_value=f"{career_f.training_duration_months} months",
                favorable_option=(
                    career_s.title
                    if career_s.training_duration_months
                    <= career_f.training_duration_months
                    else career_f.title
                ),
            ),
        ]

        mediation_payload = {
            "student_choice": {
                "title": career_s.title,
                "fit": fit_s.match_score,
                "cost": career_s.min_training_cost,
            },
            "family_choice": {
                "title": career_f.title,
                "fit": fit_f.match_score,
                "cost": career_f.min_training_cost,
            },
            "tradeoffs": [t.model_dump() for t in tradeoffs],
        }

        summary = await self.llm_provider.generate_family_mediation_summary(
            mediation_payload=mediation_payload, language=language
        )

        return FamilyMediationResponse(
            student_career_title=career_s.title,
            family_career_title=career_f.title,
            tradeoffs=tradeoffs,
            neutral_mediation_summary=summary,
        )
