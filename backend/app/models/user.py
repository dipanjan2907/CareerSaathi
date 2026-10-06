import enum
import uuid
from sqlalchemy import Column, String, Boolean, Enum, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class UserRole(str, enum.Enum):
    STUDENT = "student"
    PARENT = "parent"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)

    # Relationships
    parent_profile = relationship("ParentProfile", back_populates="user", uselist=False)


class ParentProfile(Base):
    __tablename__ = "parent_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    linked_student_id = Column(
        UUID(as_uuid=True), ForeignKey("student_profiles.id"), nullable=True
    )
    max_family_budget = Column(Numeric(12, 2), default=50000.0)
    preferred_max_duration_months = Column(Numeric(4, 1), default=12.0)

    user = relationship("User", back_populates="parent_profile")
