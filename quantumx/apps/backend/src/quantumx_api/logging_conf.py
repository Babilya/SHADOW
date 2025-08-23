from __future__ import annotations
import logging
import time
from typing import Callable

import structlog
from fastapi import Request


def configure_logging() -> None:
	logging.basicConfig(format="%(message)s", level=logging.INFO)
	structlog.configure(
		processors=[
			structlog.processors.TimeStamper(fmt="iso"),
			structlog.processors.add_log_level,
			structlog.processors.JSONRenderer(),
		],
		logger_factory=structlog.stdlib.LoggerFactory(),
	)


async def timing_middleware(request: Request, call_next: Callable):
	start = time.perf_counter()
	response = await call_next(request)
	duration_ms = (time.perf_counter() - start) * 1000
	structlog.get_logger("http").info("request", path=request.url.path, method=request.method, status_code=response.status_code, duration_ms=round(duration_ms, 2))
	return response