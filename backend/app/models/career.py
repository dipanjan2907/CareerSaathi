import uuid
from typing import List, Optional
from sqlalchemy import (
    ARRAY,
    JSON,
    Column,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

career_prerequisites = Table(
    "career_prerequisites",
    Base.metadata,
    Column(
        "parent_career_id",
        UUID(as_uuid=True),
        ForeignKey("careers.id"),
        primary_key=True,
    ),
    Column(
        "child_career_id",
        UUID(as_uuid=True),
        ForeignKey("careers.id"),
        primary_key=True,
    ),
    Column("transition_time_months", Integer, default=12),
)


class Career(Base):
    __tablename__ = "careers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    sector: Mapped[str] = mapped_column(String(100), index=True)
    nsqf_level: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(Text)

    # Vector baseline [logical, numerical, spatial, mechanical, communication, hands_on]
    competency_baseline: Mapped[dict] = mapped_column(JSON, nullable=False)

    # Financial & Opportunity Constraints
    average_starting_salary: Mapped[float] = mapped_column(Float, nullable=False)
    min_training_cost: Mapped[float] = mapped_column(Float, nullable=False)
    max_training_cost: Mapped[float] = mapped_column(Float, nullable=False)
    training_duration_months: Mapped[int] = mapped_column(Integer, nullable=False)
    demand_index: Mapped[float] = mapped_column(
        Float, default=1.0
    )  # Regional Demand Multiplier

    # Progression Graph Relationships
    next_level_careers = relationship(
        "Career",
        secondary=career_prerequisites,
        primaryjoin=id == career_prerequisites.c.parent_career_id,
        secondaryjoin=id == career_prerequisites.c.child_career_id,
        backref="prerequisite_careers",
    )
