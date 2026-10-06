import asyncio
from app.db.session import engine
from app.db.base import Base
import app.models  # Imports all models so SQLAlchemy knows them


async def init():
    print("Creating database tables directly via SQLAlchemy...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully!")


if __name__ == "__main__":
    asyncio.run(init())
