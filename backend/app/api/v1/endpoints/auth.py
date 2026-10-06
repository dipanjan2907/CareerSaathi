from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db_session
from app.models.user import User, UserRole, ParentProfile
from app.models.student import StudentProfile
from app.schemas.auth import (
    CaptchaResponse,
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
)
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    generate_math_captcha,
    verify_captcha,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/captcha", response_model=CaptchaResponse)
async def get_captcha():
    captcha_token, _, svg_data = generate_math_captcha()
    return CaptchaResponse(captcha_token=captcha_token, svg_data=svg_data)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLoginRequest, db: AsyncSession = Depends(get_db_session)):
    # 1. Verify CAPTCHA
    if not verify_captcha(payload.captcha_answer, payload.captcha_token):
        raise HTTPException(
            status_code=400, detail="Invalid or expired CAPTCHA answer."
        )

    # 2. Verify User Credentials
    result = await db.execute(
        select(User).where(func.lower(User.email) == str(payload.email).lower())
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    student_id = None
    if user.role == UserRole.STUDENT:
        student_result = await db.execute(
            select(StudentProfile.id).where(
                StudentProfile.external_user_id == str(user.id)
            )
        )
        student_id = student_result.scalar_one_or_none()

    # 3. Issue Token
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value}
    )
    return TokenResponse(
        access_token=access_token,
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        student_id=student_id,
    )


@router.post(
    "/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED
)
async def register(
    payload: UserRegisterRequest, db: AsyncSession = Depends(get_db_session)
):
    # 1. Verify CAPTCHA
    if not verify_captcha(payload.captcha_answer, payload.captcha_token):
        raise HTTPException(
            status_code=400, detail="Invalid or expired CAPTCHA answer."
        )

    # 2. Check if user already exists
    email = str(payload.email).lower()
    existing = await db.execute(
        select(User).where(func.lower(User.email) == email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email is already registered.")

    # 3. Create User record
    hashed_pwd = get_password_hash(payload.password)
    user = User(
        email=email,
        hashed_password=hashed_pwd,
        full_name=payload.full_name,
        role=payload.role,
    )
    db.add(user)
    await db.flush()

    # 4. Create Role-Specific Profile using dynamic user inputs
    student_id = None
    if payload.role == UserRole.STUDENT:
        if (
            payload.state is None
            or payload.district is None
            or payload.max_duration_months is None
            or payload.preferred_work_environment is None
            or payload.max_family_budget is None
        ):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Student profile details are required.",
            )
        student = StudentProfile(
            external_user_id=str(user.id),
            full_name=payload.full_name,
            state=payload.state,
            district=payload.district,
            max_family_budget=payload.max_family_budget,
            max_duration_months=payload.max_duration_months,
            preferred_work_environment=payload.preferred_work_environment,
        )
        db.add(student)
    elif payload.role == UserRole.PARENT:
        if payload.max_family_budget is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="A family training budget is required.",
            )
        parent = ParentProfile(
            user_id=user.id,
            max_family_budget=payload.max_family_budget,
        )
        db.add(parent)

    await db.flush()
    if payload.role == UserRole.STUDENT:
        student_id = student.id
    await db.commit()
    await db.refresh(user)

    # 5. Issue JWT Token
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value}
    )
    return TokenResponse(
        access_token=access_token,
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        student_id=student_id,
    )
