import asyncio
import structlog
from app.db.session import AsyncSessionLocal
from app.models.career import Career

logger = structlog.get_logger()

INITIAL_CAREERS = [
    {
        "code": "EV_TECH_L4",
        "title": "EV Service Specialist & Technician",
        "sector": "Automotive",
        "nsqf_level": 4,
        "description": "Diagnoses, services, and repairs electric vehicle battery packs, motors, and electronic controllers.",
        "competency_baseline": {
            "logical_reasoning": 70,
            "numerical_reasoning": 60,
            "spatial_reasoning": 75,
            "mechanical_reasoning": 85,
            "communication": 55,
            "hands_on_preference": 90,
        },
        "average_starting_salary": 22000.0,
        "min_training_cost": 35000.0,
        "max_training_cost": 50000.0,
        "training_duration_months": 12,
        "demand_index": 1.4,
    },
    {
        "code": "IND_ELEC_L4",
        "title": "Industrial Automation Electrician",
        "sector": "Electrical & Electronics",
        "nsqf_level": 4,
        "description": "Installs and maintains PLC panels, motors, and industrial automated wiring systems.",
        "competency_baseline": {
            "logical_reasoning": 75,
            "numerical_reasoning": 65,
            "spatial_reasoning": 70,
            "mechanical_reasoning": 80,
            "communication": 50,
            "hands_on_preference": 85,
        },
        "average_starting_salary": 20000.0,
        "min_training_cost": 25000.0,
        "max_training_cost": 40000.0,
        "training_duration_months": 24,
        "demand_index": 1.25,
    },
]


async def seed_database():
    logger.info("Initializing database seed operation...")
    async with AsyncSessionLocal() as session:
        for cdata in INITIAL_CAREERS:
            existing = await session.execute(
                Career.__table__.select().where(Career.code == cdata["code"])
            )
            if not existing.first():
                career = Career(**cdata)
                session.add(career)
                logger.info("Inserted vocational career record", code=cdata["code"])
        await session.commit()
    logger.info("Database seed operation complete.")


if __name__ == "__main__":
    asyncio.run(seed_database())
