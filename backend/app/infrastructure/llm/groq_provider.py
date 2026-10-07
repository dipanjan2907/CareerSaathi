import json
import uuid
from typing import Any, Dict
from groq import Groq
from app.core.config import settings
from app.core.exceptions import LLMServiceUnavailableException
from app.infrastructure.llm.base import BaseLLMProvider


class GroqLLMProvider(BaseLLMProvider):
    def __init__(self):
        api_key = settings.GROQ_API_KEY
        if not api_key:
            self.client = None
        else:
            self.client = Groq(api_key=api_key)

    async def generate_counselling_explanation(
        self, payload: Dict[str, Any], language: str = "English"
    ) -> str:
        if not self.client:
            raise LLMServiceUnavailableException("Groq API key is unconfigured.")

        prompt = f"""
You are an expert vocational career counsellor in India. Explain the following structured decision engine recommendation to a student in clear, empathetic {language}.

CRITICAL INSTRUCTION:
- Use ONLY the evidence provided below.
- DO NOT invent salaries, costs, or statistics not present in the payload.
- Address both strengths and limitations directly.

DECISION ENGINE PAYLOAD:
{payload}
"""
        try:
            response = self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            raise LLMServiceUnavailableException(f"Groq service error: {str(e)}")

    async def generate_family_mediation_summary(
        self, mediation_payload: Dict[str, Any], language: str = "English"
    ) -> str:
        if not self.client:
            raise LLMServiceUnavailableException("Groq API key is unconfigured.")

        prompt = f"""
You are a neutral family career mediator in India helping a family weigh vocational training versus conventional academic options.

CRITICAL INSTRUCTION:
- Respect both student aspirations and parent financial/security concerns.
- DO NOT say any party is 'wrong'. Frame as objective trade-offs in {language}.

DECISION ROOM COMPARISON PAYLOAD:
{mediation_payload}
"""
        try:
            response = self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            raise LLMServiceUnavailableException(f"Groq service error: {str(e)}")

    async def generate_domain_scenario(
        self, sector: str, difficulty_level: str = "intermediate"
    ) -> Dict[str, Any]:
        if not self.client:
            raise LLMServiceUnavailableException("Groq API key is unconfigured.")

        prompt = f"""
Generate 10 realistic, distinct workplace scenario micro-assessment questions for the '{sector}' vocational sector at '{difficulty_level}' level.

You must return a valid JSON object matching this EXACT schema layout:
{{
  "sector": "{sector}",
  "scenarios": [
    {{
      "scenario_id": "scen-1",
      "scenario_title": "string",
      "scenario_description": "string",
      "options": [
        {{
          "option_key": "A",
          "option_text": "string",
          "competency_impacts": {{
            "logical_reasoning": 15.0,
            "numerical_reasoning": 5.0,
            "spatial_reasoning": 0.0,
            "mechanical_reasoning": 10.0,
            "communication": 5.0,
            "hands_on_preference": 15.0
          }}
        }},
        {{
          "option_key": "B",
          "option_text": "string",
          "competency_impacts": {{
            "logical_reasoning": 5.0,
            "numerical_reasoning": 0.0,
            "spatial_reasoning": 15.0,
            "mechanical_reasoning": 20.0,
            "communication": 0.0,
            "hands_on_preference": 20.0
          }}
        }},
        {{
          "option_key": "C",
          "option_text": "string",
          "competency_impacts": {{
            "logical_reasoning": 0.0,
            "numerical_reasoning": 10.0,
            "spatial_reasoning": 5.0,
            "mechanical_reasoning": 5.0,
            "communication": 20.0,
            "hands_on_preference": 5.0
          }}
        }}
      ]
    }}
  ]
}}

Rules:
1. Provide EXACTLY 10 practical workplace scenarios for {sector}. Keep descriptions concise (2-3 sentences max per scenario).
2. Each scenario must have 3-4 distinct practical choices using keys "A", "B", "C", "D".
3. Return ONLY valid raw JSON, no markdown formatting.
"""
        try:
            response = self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert vocational skill assessor. Output strict JSON adhering strictly to requested field names.",
                    },
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                max_tokens=4096,
                temperature=0.7,
            )

            raw_content = response.choices[0].message.content or "{}"
            data = json.loads(raw_content)
            return data
        except Exception as e:
            raise LLMServiceUnavailableException(
                f"Failed to generate 10-question scenario suite via Groq: {str(e)}"
            )