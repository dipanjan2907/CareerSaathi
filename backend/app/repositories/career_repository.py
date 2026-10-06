import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.career import Career


class CareerRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, career_id: uuid.UUID) -> Optional[Career]:
        result = await self.session.execute(
            select(Career).where(Career.id == career_id)
        )
        return result.scalar_one_or_none()

    async def get_by_code(self, code: str) -> Optional[Career]:
        result = await self.session.execute(select(Career).where(Career.code == code))
        return result.scalar_one_or_none()

    async def list_all(self, limit: int = 100) -> List[Career]:
        result = await self.session.execute(select(Career).limit(limit))
        return list(result.scalars().all())
