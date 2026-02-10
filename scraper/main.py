import sys
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_cache.decorator import cache
from ingest_leads import main as get_leads_logic

# --- CRITICAL WINDOWS FIX ---
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
# ----------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    FastAPICache.init(InMemoryBackend())
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
@cache(expire=3600)
async def root():
    # Directly await the coroutine (do NOT use asyncio.run)
    return await get_leads_logic()

if __name__ == "__main__":
    import uvicorn
    # reload=False is often required on Windows to avoid the loop being reset
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)