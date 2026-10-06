from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["Health Check"])


@router.get("", summary="Perform Health Check")
async def health_check():
    return {"status": "healthy", "service": "CareerSaathi API"}
