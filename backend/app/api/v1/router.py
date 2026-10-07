from fastapi import APIRouter
from app.api.v1.endpoints import assessment, careers, decision, family, health

api_v1_router = APIRouter()

api_v1_router.include_router(health.router, prefix="/health", tags=["System Health"])
api_v1_router.include_router(decision.router, prefix="/decision", tags=["Career Decision Engine"])
api_v1_router.include_router(assessment.router, prefix="/assessment", tags=["Competency Assessment"]) # <-- Prefix defined here
api_v1_router.include_router(family.router, prefix="/family", tags=["Family Decision Room"])
api_v1_router.include_router(careers.router, prefix="/careers", tags=["Career Knowledge Graph"])