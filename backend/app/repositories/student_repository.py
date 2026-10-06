import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.student import StudentProfile


class StudentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, student_id: uuid.UUID) -> Optional[StudentProfile]:
        result = await self.session.execute(
            select(StudentProfile).where(StudentProfile.id == student_id)
        )
        return result.scalar_one_or_none()

    async def get_by_external_id(
        self, external_user_id: str
    ) -> Optional[StudentProfile]:
        result = await self.session.execute(
            select(StudentProfile).where(
                StudentProfile.external_user_id == external_user_id
            )
        )
        return result.scalar_one_or_none()

    async def create(self, student: StudentProfile) -> StudentProfile:
        self.session.add(student)
        await self.session.commit()
        await self.session.refresh(student)
        return student
