#!/usr/bin/env python3
"""
FastAPI web server for React Scuba Python utilities.

Provides REST API endpoints for documentation utilities,
leveraging Python 3.14 features for enhanced performance.
"""

import datetime
import json
import sys
import threading
import uuid
from collections.abc import Awaitable, Callable
from typing import Any

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse

from react_scuba_utils.config.config import LogLevel
from react_scuba_utils.config.settings import (
    HTTPConfig,
    LoggingConfig,
    PathConfig,
    get_python_features,
)

path_config = PathConfig()
http_config = HTTPConfig()
features = get_python_features()

# Configure structured logging
logging_config = LoggingConfig(level=LogLevel.INFO)
logging_config.configure_logging()

# FastAPI app instance
app = FastAPI(
    title="React Scuba Python Utilities API",
    description="Python utilities for React Scuba project",
    version="0.2.0",
)

# Global status tracking
status_lock = threading.Lock()
init_status = {
    "status": "initializing",
    "timestamp": datetime.datetime.now().isoformat(),
    "services": {},
}


# Correlation ID middleware
@app.middleware("http")
async def add_correlation_id(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    """Add correlation ID to request and logs."""
    correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))

    # Add to request state for use in handlers
    request.state.correlation_id = correlation_id

    # Add correlation ID to response headers
    response = await call_next(request)
    response.headers["X-Correlation-ID"] = correlation_id

    return response


@app.get("/")
async def root(request: Request) -> dict[str, Any]:
    """Root endpoint with API information."""
    correlation_logger = logging_config.get_correlation_logger(
        request.state.correlation_id
    )
    correlation_logger.info("Root endpoint accessed", extra={"endpoint": "/"})

    return {
        "message": "React Scuba Python Utilities API",
        "version": "0.2.0",
        "python_version": features["version_string"],
        "free_threaded": features["is_free_threaded"],
        "interpreters": features["has_interpreters"],
        "endpoints": {
            "/inventory": "Component inventory",
            "/health": "Health check",
            "/links/check": "Link validation",
        },
    }


@app.get("/health")
async def health(request: Request) -> JSONResponse:
    """Health check endpoint with initialization status."""
    correlation_logger = logging_config.get_correlation_logger(
        request.state.correlation_id
    )
    correlation_logger.info("Health check requested", extra={"endpoint": "/health"})

    with status_lock:
        current_status = init_status.copy()

    # Add Python version and features to response
    current_status.update({"python_version": sys.version, "features": features})

    correlation_logger.info(
        "Health check completed",
        extra={
            "status": current_status["status"],
            "response_size": len(json.dumps(current_status)),
        },
    )

    return JSONResponse(content=current_status)


@app.get("/inventory")
async def get_inventory(request: Request, src_path: str = "src") -> JSONResponse:
    """Generate and return component inventory."""
    correlation_logger = logging_config.get_correlation_logger(
        request.state.correlation_id
    )
    correlation_logger.info(
        "Inventory generation requested",
        extra={"endpoint": "/inventory", "src_path": src_path},
    )

    try:
        from react_scuba_utils.models.models import ComponentInventoryConfig
        from react_scuba_utils.services.component_inventory import (
            ComponentInventoryService,
        )

        config = ComponentInventoryConfig(src_path=src_path)
        service = ComponentInventoryService(config, path_config)
        inventory = service.generate_inventory()

        summary = {
            "pages": len(inventory.get("pages", [])),
            "components": len(inventory.get("components", [])),
            "hooks": len(inventory.get("hooks", [])),
            "utils": len(inventory.get("utils", [])),
        }

        correlation_logger.info(
            "Inventory generation completed",
            extra={"summary": summary, "success": True},
        )

        return JSONResponse(
            content={"status": "success", "data": inventory, "summary": summary}
        )
    except Exception as e:
        correlation_logger.error(
            "Inventory generation failed",
            extra={"error": str(e), "src_path": src_path},
        )
        raise HTTPException(
            status_code=500, detail=f"Error generating inventory: {str(e)}"
        ) from e


@app.get("/links/check")
async def check_links(
    request: Request, workers: int = 10, timeout: int = 10
) -> JSONResponse:
    """Check documentation links."""
    correlation_logger = logging_config.get_correlation_logger(
        request.state.correlation_id
    )
    correlation_logger.info(
        "Link checking requested",
        extra={"endpoint": "/links/check", "workers": workers, "timeout": timeout},
    )

    try:
        from react_scuba_utils.models.models import LinkCheckConfig
        from react_scuba_utils.services.link_checker import LinkCheckerService

        config = LinkCheckConfig(
            max_workers=workers,
            timeout=timeout,
            use_interpreters=features["has_interpreters"],
        )

        service = LinkCheckerService(config, path_config, http_config)
        results = service.check_links_concurrent()

        summary = {
            "valid": len(results.get("valid", [])),
            "broken": len(results.get("broken", [])),
            "skipped": len(results.get("skipped", [])),
        }

        correlation_logger.info(
            "Link checking completed", extra={"summary": summary, "success": True}
        )

        return JSONResponse(
            content={"status": "success", "data": results, "summary": summary}
        )
    except Exception as e:
        correlation_logger.error(
            "Link checking failed",
            extra={"error": str(e), "workers": workers, "timeout": timeout},
        )
        raise HTTPException(
            status_code=500, detail=f"Error checking links: {str(e)}"
        ) from e


if __name__ == "__main__":
    import uvicorn

    try:
        from react_scuba_utils.config.settings import get_python_features

        features = get_python_features()
    except ImportError:
        features = {
            "version_string": "unknown",
            "is_free_threaded": False,
            "has_interpreters": False,
        }

    print("🐍 React Scuba Python Utilities API")
    print(f"📍 Python {features['version_string']}")
    if features["is_free_threaded"]:
        print("🧵 Running in free-threaded mode")
    if features["has_interpreters"]:
        print("🔄 Concurrent interpreters available")

    # Start server
    uvicorn.run(
        "react_scuba_utils.api:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info",
    )
