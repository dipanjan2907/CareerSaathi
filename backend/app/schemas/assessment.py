from typing import Dict, List
from pydantic import BaseModel, Field


class ScenarioOption(BaseModel):
    option_key: str = Field(..., description="Unique option identifier, e.g., OPTION_A")
    option_text: str = Field(..., description="User-facing option text")
    competency_impacts: Dict[str, float] = Field(
        ...,
        description="Impact deltas for logical_reasoning, numerical_reasoning, spatial_reasoning, mechanical_reasoning, communication, hands_on_preference",
    )


class GeneratedAssessmentScenario(BaseModel):
    scenario_id: str
    sector: str
    scenario_title: str
    scenario_description: str
    options: List[ScenarioOption]


class AssessmentSubmissionRequest(BaseModel):
    selected_option_keys: List[str]
