from fastapi import APIRouter
from app.api.v1.endpoints import auth, assessment, careers, decision, family, health

api_v1_router = APIRouter()

api_v1_router.include_router(auth.router)
api_v1_router.include_router(assessment.router)
api_v1_router.include_router(careers.router)
api_v1_router.include_router(decision.router)
api_v1_router.include_router(family.router)
api_v1_router.include_router(health.router)
