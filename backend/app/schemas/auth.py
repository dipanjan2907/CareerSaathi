from typing import Literal, Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from app.models.user import UserRole


def validate_password_byte_length(password: str) -> str:
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password must not exceed 72 UTF-8 bytes.")
    return password


class CaptchaResponse(BaseModel):
    captcha_token: str
    svg_data: str


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    full_name: str = Field(..., min_length=1, max_length=255)
    role: UserRole
    captcha_token: str
    captcha_answer: str

    state: Optional[str] = Field(default=None, min_length=1, max_length=100)
    district: Optional[str] = Field(default=None, min_length=1, max_length=100)
    max_family_budget: Optional[float] = Field(default=None, ge=0)
    max_duration_months: Optional[int] = Field(default=None, gt=0)
    preferred_work_environment: Optional[
        Literal["hands_on", "indoor", "outdoor"]
    ] = None

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password_byte_length(value)

    @field_validator("full_name", "state", "district")
    @classmethod
    def strip_text_fields(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be empty.")
        return value

    @model_validator(mode="after")
    def validate_profile_fields(self):
        if self.max_family_budget is None:
            raise ValueError("A family training budget is required.")
        if self.role == UserRole.STUDENT and any(
            value is None
            for value in (
                self.state,
                self.district,
                self.max_duration_months,
                self.preferred_work_environment,
            )
        ):
            raise ValueError(
                "Student registrations require location, duration, and work environment."
            )
        return self


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=72)
    captcha_token: str
    captcha_answer: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password_byte_length(value)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    user_id: UUID
    full_name: str
    student_id: Optional[UUID] = None
