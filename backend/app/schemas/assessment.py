from typing import Dict, List
from pydantic import BaseModel, ConfigDict, Field


class ScenarioOption(BaseModel):
    option_key: str = Field(..., description="Option key, e.g., A, B, C, D")
    option_text: str = Field(..., description="User-facing option text")
    competency_impacts: Dict[str, float] = Field(
        ...,
        description="Impact deltas for competency dimensions",
    )

    model_config = ConfigDict(from_attributes=True)


class ScenarioItem(BaseModel):
    scenario_id: str
    scenario_title: str
    scenario_description: str
    options: List[ScenarioOption]

    model_config = ConfigDict(from_attributes=True)


class GeneratedAssessmentScenario(BaseModel):
    sector: str
    scenarios: List[ScenarioItem]

    model_config = ConfigDict(from_attributes=True)


class AssessmentSubmissionRequest(BaseModel):
    selected_option_keys: List[str]