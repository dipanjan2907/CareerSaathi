from typing import List, Optional
from pydantic import BaseModel, Field


class ConstraintEvaluation(BaseModel):
    constraint_type: str
    passed: bool
    severity: str
    message: str


class CareerFitResult(BaseModel):
    career_id: str
    career_title: str
    match_score: float = Field(..., ge=0.0, le=100.0)
    aptitude_fit_percentage: float
    penalty_deductions: float
    strengths: List[str]
    skill_gaps: List[str]
    constraint_evaluations: List[ConstraintEvaluation]


class CareerDecisionResponse(BaseModel):
    student_id: str
    confidence_score: float
    confidence_rating: str
    recommendations: List[CareerFitResult]
    counselling_explanation: str


class TradeoffFactor(BaseModel):
    factor_name: str
    option_a_value: str
    option_b_value: str
    favorable_option: str


class FamilyMediationRequest(BaseModel):
    student_id: str
    student_preferred_career_id: str
    family_preferred_career_id: str


class FamilyMediationResponse(BaseModel):
    student_career_title: str
    family_career_title: str
    tradeoffs: List[TradeoffFactor]
    neutral_mediation_summary: str
