"""FastAPI web router for eigen spectral graph inspection."""

from __future__ import annotations

from fastapi import APIRouter

from ..engine import LAST_EIGEN_CACHE, handle_eigen_partition

router = APIRouter()


@router.get("/status")
def get_eigen_status() -> dict:
    latest = LAST_EIGEN_CACHE.get("latest")
    if not latest:
        latest = handle_eigen_partition({})
    return {
        "plugin": "eigen",
        "status": "active",
        "latest_partition": latest,
    }
