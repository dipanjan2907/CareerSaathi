import uuid
from typing import Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.domain.decision_engine import DomainDecisionEngine
from app.infrastructure.llm.base import BaseLLMProvider
from app.models.assessment import AssessmentResult 
from app.repositories.career_repository import CareerRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.decision import CareerDecisionResponse, CareerFitResult


class DecisionService:
    def __init__(self, session: AsyncSession, llm_provider: BaseLLMProvider):
        self.session = session
        self.career_repo = CareerRepository(session)
        self.student_repo = StudentRepository(session)
        self.llm_provider = llm_provider

    async def evaluate_student_decision(
        self,
        student_id: uuid.UUID,
        sector: str = "General Vocational",
        language: str = "English",
    ) -> CareerDecisionResponse:
        student = await self.student_repo.get_by_id(student_id)
        if not student:
            raise NotFoundException(
                f"Student profile with ID '{student_id}' not found."
            )

        if not student.competency_vector:
            raise NotFoundException("Student has not completed competency assessment.")

        careers = await self.career_repo.list_all()
        ranked_results: List[CareerFitResult] = []

        # 1. Rank all careers using the deterministic decision engine
        for career in careers:
            fit_result = DomainDecisionEngine.rank_career(
                career_id=str(career.id),
                career_title=career.title,
                student_vector=student.competency_vector,
                baseline_vector=career.competency_baseline,
                max_budget=student.max_family_budget,
                max_duration=student.max_duration_months,
                min_salary=student.min_expected_salary,
                training_cost=career.min_training_cost,
                training_duration=career.training_duration_months,
                projected_salary=career.average_starting_salary,
                demand_index=career.demand_index,
            )
            ranked_results.append(fit_result)

        # 2. Sort by match score descending and select top 5
        ranked_results.sort(key=lambda x: x.match_score, reverse=True)
        top_careers = ranked_results[:5]

        # 3. Derive statistical confidence rating
        confidence_score, confidence_rating = (
            DomainDecisionEngine.calculate_confidence_score(
                assessment_completed_count=10,
                vector_variance=120.0,
            )
        )

        # 4. Structure payload for LLM explanation
        structured_payload = {
            "student_profile": {
                "budget": student.max_family_budget,
                "duration_limit_months": student.max_duration_months,
                "state": student.state,
            },
            "top_recommendation": top_careers[0].model_dump() if top_careers else None,
            "confidence_rating": confidence_rating,
        }

        # 5. LLM generates natural explanation from structured output
        ai_explanation = await self.llm_provider.generate_counselling_explanation(
            payload=structured_payload, language=language
        )

        # 6. Save snapshot of assessment & recommendations into PostgreSQL
        assessment_record = AssessmentResult(
            student_id=student.id,
            sector=sector,
            competency_vector=student.competency_vector,
            recommendations_payload=[rec.model_dump() for rec in top_careers],
            counselling_explanation=ai_explanation,
        )
        self.session.add(assessment_record)
        await self.session.commit()

        # 7. Return API response schema
        return CareerDecisionResponse(
            student_id=str(student.id),
            confidence_score=confidence_score,
            confidence_rating=confidence_rating,
            recommendations=top_careers,
            counselling_explanation=ai_explanation,
        )