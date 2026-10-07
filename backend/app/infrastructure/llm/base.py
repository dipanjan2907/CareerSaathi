from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate_counselling_explanation(
        self, payload: Dict[str, Any], language: str = "English"
    ) -> str:
        """Translates structured decision engine payload into natural counselling advice."""
        pass

    @abstractmethod
    async def generate_family_mediation_summary(
        self, mediation_payload: Dict[str, Any], language: str = "English"
    ) -> str:
        """Provides neutral trade-off summary for family decision room."""
        pass

    @abstractmethod
    async def generate_domain_scenario(
        self, sector: str, difficulty_level: str = "intermediate"
    ) -> Dict[str, Any]:
        """Dynamically generates a domain-specific micro-assessment scenario."""
        pass