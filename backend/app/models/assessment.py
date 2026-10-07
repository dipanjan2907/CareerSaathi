import uuid
from datetime import datetime
from sqlalchemy import JSON, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("student_profiles.id"), index=True)
    
    sector: Mapped[str] = mapped_column(String(100), nullable=False)
    competency_vector: Mapped[dict] = mapped_column(JSON, nullable=False)
    recommendations_payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    counselling_explanation: Mapped[str] = mapped_column(Text, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile", backref="assessment_results")