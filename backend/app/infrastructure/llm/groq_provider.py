import json
import uuid
from groq import Groq
from app.core.config import settings
from app.core.exceptions import LLMServiceUnavailableException


class GroqLLMProvider:
    def __init__(self):
        api_key = settings.GROQ_API_KEY
        if not api_key:
            self.client = None
        else:
            self.client = Groq(api_key=api_key)

    async def generate_domain_scenario(
        self, sector: str, difficulty_level: str = "intermediate"
    ) -> dict:
        if not self.client:
            raise LLMServiceUnavailableException("Groq API key is unconfigured.")

        prompt = f"""
Generate a realistic workplace scenario micro-assessment question for the '{sector}' vocational sector at '{difficulty_level}' level.

You must return a valid JSON object matching this EXACT schema layout:
{{
  "scenario_title": "string",
  "scenario_description": "string",
  "options": [
    {{
      "option_key": "A",
      "option_text": "string",
      "competency_impacts": {{
        "logical_reasoning": 10.0,
        "numerical_reasoning": 5.0,
        "spatial_reasoning": 0.0,
        "mechanical_reasoning": 15.0,
        "communication": 5.0,
        "hands_on_preference": 20.0
      }}
    }}
  ]
}}

Rules:
1. "scenario_description" must detail the workplace problem/situation.
2. Provide 3-4 distinct practical choices under options with keys "A", "B", "C", "D" using "option_key" and "option_text".
3. Impact values in competency_impacts must range between 5.0 and 25.0 depending on how strongly the choice demonstrates that trait.
4. Return ONLY valid JSON, no markdown blocks or extra surrounding text.
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
                temperature=0.7,
            )

            raw_content = response.choices[0].message.content
            data = json.loads(raw_content)

            # Inject backend-required top-level fields
            data["scenario_id"] = str(uuid.uuid4())
            data["sector"] = sector

            return data
        except Exception as e:
            raise LLMServiceUnavailableException(
                f"Failed to generate assessment scenario via Groq: {str(e)}"
            )


# Export instance
llm_provider = GroqLLMProvider()
