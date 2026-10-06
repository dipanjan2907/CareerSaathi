import uuid
from datetime import datetime
from sqlalchemy import JSON, DateTime, Float, String, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    external_user_id: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    state: Mapped[str] = mapped_column(String(100), index=True)
    district: Mapped[str] = mapped_column(String(100), index=True)

    # Computed Competency Vector
    competency_vector: Mapped[dict] = mapped_column(JSON, nullable=True)

    # Hard & Soft Constraints
    max_family_budget: Mapped[float] = mapped_column(Float, nullable=False)
    max_duration_months: Mapped[int] = mapped_column(Integer, nullable=False)
    preferred_work_environment: Mapped[str] = mapped_column(
        String(50)
    )  # hands_on, indoor, outdoor
    min_expected_salary: Mapped[float] = mapped_column(Float, default=0.0)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
