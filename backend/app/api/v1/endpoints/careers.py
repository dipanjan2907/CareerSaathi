import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db_session
from app.core.exceptions import NotFoundException
from app.repositories.career_repository import CareerRepository

router = APIRouter()


@router.get("/{career_id}/roadmap", response_model=Dict[str, Any])
async def get_career_roadmap(
    career_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
):
    """
    Returns nodes and edges for visualizing the ITI -> Apprenticeship -> Advanced Specialist career graph.
    """
    repo = CareerRepository(db)
    career = await repo.get_by_id(career_id)
    if not career:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Career not found."
        )

    nodes = [
        {
            "id": str(career.id),
            "label": career.title,
            "sector": career.sector,
            "nsqf_level": career.nsqf_level,
            "avg_salary": career.average_starting_salary,
        }
    ]
    edges = []

    for next_career in career.next_level_careers:
        nodes.append(
            {
                "id": str(next_career.id),
                "label": next_career.title,
                "sector": next_career.sector,
                "nsqf_level": next_career.nsqf_level,
                "avg_salary": next_career.average_starting_salary,
            }
        )
        edges.append({"source": str(career.id), "target": str(next_career.id)})

    return {"root_career_id": str(career.id), "nodes": nodes, "edges": edges}
