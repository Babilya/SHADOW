import pytest
from httpx import AsyncClient
from quantumx_api.main import app

@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        res = await ac.get("/")
    assert res.status_code == 200
    assert res.json()["name"] == "QuantumX"
