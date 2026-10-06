import uuid
from typing import Dict, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.repositories.student_repository import StudentRepository


class AssessmentService:
    # Scenario scoring matrix: maps scenario option keys to competency impact
    SCENARIO_WEIGHT_MATRIX: Dict[str, Dict[str, float]] = {
        "SCENARIO_1_OPTION_A": {
            "mechanical_reasoning": 25.0,
            "hands_on_preference": 20.0,
        },
        "SCENARIO_1_OPTION_B": {"logical_reasoning": 20.0, "numerical_reasoning": 15.0},
        "SCENARIO_2_OPTION_A": {
            "spatial_reasoning": 30.0,
            "mechanical_reasoning": 15.0,
        },
        "SCENARIO_2_OPTION_B": {"communication": 25.0, "logical_reasoning": 10.0},
    }

    def __init__(self, session: AsyncSession):
        self.session = session
        self.student_repo = StudentRepository(session)

    async def submit_assessment_responses(
        self, student_id: uuid.UUID, selected_option_keys: List[str]
    ) -> Dict[str, float]:
        student = await self.student_repo.get_by_id(student_id)
        if not student:
            raise NotFoundException(f"Student '{student_id}' not found.")

        # Baseline starting vector
        competency_vector: Dict[str, float] = {
            "logical_reasoning": 50.0,
            "numerical_reasoning": 50.0,
            "spatial_reasoning": 50.0,
            "mechanical_reasoning": 50.0,
            "communication": 50.0,
            "hands_on_preference": 50.0,
        }

        # Aggregate weighted impacts from chosen micro-assessment options
        for key in selected_option_keys:
            impacts = self.SCENARIO_WEIGHT_MATRIX.get(key, {})
            for dim, delta in impacts.items():
                if dim in competency_vector:
                    competency_vector[dim] = min(100.0, competency_vector[dim] + delta)

        student.competency_vector = competency_vector
        await self.session.commit()
        return competency_vector
