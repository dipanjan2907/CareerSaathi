import math
from typing import Dict, List, Tuple
from app.schemas.decision import CareerFitResult, ConstraintEvaluation, TradeoffFactor


class DomainDecisionEngine:
    DIMENSIONS = [
        "logical_reasoning",
        "numerical_reasoning",
        "spatial_reasoning",
        "mechanical_reasoning",
        "communication",
        "hands_on_preference",
    ]

    @classmethod
    def compute_vector_distance(
        cls, student_vector: Dict[str, float], baseline_vector: Dict[str, float]
    ) -> float:
        """
        Calculates normalized Euclidean distance fit between student profile and career requirement.
        Returns score in range [0.0, 1.0].
        """
        sum_sq = 0.0
        total_dims = len(cls.DIMENSIONS)

        for dim in cls.DIMENSIONS:
            s_val = student_vector.get(dim, 50.0)
            c_val = baseline_vector.get(dim, 50.0)
            sum_sq += ((s_val - c_val) / 100.0) ** 2

        distance = math.sqrt(sum_sq / total_dims)
        return max(0.0, min(1.0, 1.0 - distance))

    @classmethod
    def evaluate_constraints(
        cls,
        max_budget: float,
        max_duration: int,
        min_salary: float,
        training_cost: float,
        training_duration: int,
        projected_salary: float,
    ) -> Tuple[float, List[ConstraintEvaluation]]:
        """
        Evaluates hard/soft penalties against financial, time, and income constraints.
        Returns total penalty multiplier and itemized penalty violations.
        """
        penalties: List[ConstraintEvaluation] = []
        penalty_factor = 0.0

        # Budget Check
        if training_cost > max_budget:
            cost_overrun_ratio = (training_cost - max_budget) / max_budget
            penalty_factor += min(0.35, 0.15 * cost_overrun_ratio)
            penalties.append(
                ConstraintEvaluation(
                    constraint_type="BUDGET",
                    passed=False,
                    severity="WARNING" if cost_overrun_ratio <= 0.25 else "CRITICAL",
                    message=f"Training cost (₹{training_cost:,.0f}) exceeds budget (₹{max_budget:,.0f}) by {cost_overrun_ratio*100:.1f}%.",
                )
            )
        else:
            penalties.append(
                ConstraintEvaluation(
                    constraint_type="BUDGET",
                    passed=True,
                    severity="NONE",
                    message="Training cost falls within specified budget.",
                )
            )

        # Duration Check
        if training_duration > max_duration:
            duration_overrun = training_duration - max_duration
            penalty_factor += min(0.25, 0.10 * (duration_overrun / 12.0))
            penalties.append(
                ConstraintEvaluation(
                    constraint_type="DURATION",
                    passed=False,
                    severity="WARNING",
                    message=f"Duration ({training_duration}m) exceeds limit ({max_duration}m).",
                )
            )
        else:
            penalties.append(
                ConstraintEvaluation(
                    constraint_type="DURATION",
                    passed=True,
                    severity="NONE",
                    message="Course duration fits time availability.",
                )
            )

        # Salary Expectation Check
        if projected_salary < min_salary:
            penalty_factor += 0.10
            penalties.append(
                ConstraintEvaluation(
                    constraint_type="SALARY",
                    passed=False,
                    severity="INFO",
                    message=f"Projected starting salary (₹{projected_salary:,.0f}) is below target (₹{min_salary:,.0f}).",
                )
            )
        else:
            penalties.append(
                ConstraintEvaluation(
                    constraint_type="SALARY",
                    passed=True,
                    severity="NONE",
                    message="Starting salary satisfies income expectations.",
                )
            )

        return penalty_factor, penalties

    @classmethod
    def calculate_confidence_score(
        cls, assessment_completed_count: int, vector_variance: float
    ) -> Tuple[float, str]:
        """
        Derives statistical confidence rating based on assessment completeness and score stability.
        """
        base_confidence = min(1.0, assessment_completed_count / 10.0)
        stability_modifier = max(0.0, 1.0 - (vector_variance / 2500.0))
        final_confidence = round(0.7 * base_confidence + 0.3 * stability_modifier, 2)

        if final_confidence >= 0.85:
            rating = "HIGH"
        elif final_confidence >= 0.60:
            rating = "MEDIUM"
        else:
            rating = "LOW"

        return final_confidence, rating

    @classmethod
    def rank_career(
        cls,
        career_id: str,
        career_title: str,
        student_vector: Dict[str, float],
        baseline_vector: Dict[str, float],
        max_budget: float,
        max_duration: int,
        min_salary: float,
        training_cost: float,
        training_duration: int,
        projected_salary: float,
        demand_index: float,
    ) -> CareerFitResult:
        aptitude_fit = cls.compute_vector_distance(student_vector, baseline_vector)
        penalty_factor, evaluations = cls.evaluate_constraints(
            max_budget,
            max_duration,
            min_salary,
            training_cost,
            training_duration,
            projected_salary,
        )

        # Multi-Criteria Weighted Decision Score
        # Weight Distribution: 50% Aptitude Vector, 30% Opportunity/Demand, 20% Base Feasibility - Penalty
        opportunity_fit = min(1.0, demand_index / 1.5)
        raw_score = (0.50 * aptitude_fit) + (0.30 * opportunity_fit) + (0.20 * 1.0)
        final_score = max(0.0, min(1.0, raw_score - penalty_factor))

        # Identify strengths and skill gaps
        strengths = []
        gaps = []
        for dim in cls.DIMENSIONS:
            s_val = student_vector.get(dim, 50.0)
            c_val = baseline_vector.get(dim, 50.0)
            if s_val >= c_val:
                strengths.append(dim.replace("_", " ").title())
            elif (c_val - s_val) > 15.0:
                gaps.append(dim.replace("_", " ").title())

        return CareerFitResult(
            career_id=career_id,
            career_title=career_title,
            match_score=round(final_score * 100, 1),
            aptitude_fit_percentage=round(aptitude_fit * 100, 1),
            penalty_deductions=round(penalty_factor * 100, 1),
            strengths=strengths,
            skill_gaps=gaps,
            constraint_evaluations=evaluations,
        )
