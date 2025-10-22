#!/usr/bin/env python3
"""
FastAPI web server for React Scuba Python utilities.

Provides REST API endpoints for documentation utilities,
leveraging Python 3.14 features for enhanced performance.
"""

import sys
import json
import threading
import time
import subprocess
import asyncio
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Import our utilities (moved to functions to allow startup without them)
# from react_scuba_utils.config.settings import PathConfig, get_python_features, HTTPConfig
# from react_scuba_utils.services.component_inventory import ComponentInventoryService
# from react_scuba_utils.services.link_checker import LinkCheckerService
# from react_scuba_utils.types.models import ComponentInventoryConfig, LinkCheckConfig

# Global initialization status
init_status = {
    "status": "ready",
    "message": "API is fully operational",
    "packages_installed": True,
    "services_ready": True
}

# Thread lock for status updates
status_lock = threading.Lock()

def update_init_status(status: str, message: str, packages_installed: bool = None, services_ready: bool = None):
    """Update the global initialization status."""
    with status_lock:
        init_status["status"] = status
        init_status["message"] = message
        if packages_installed is not None:
            init_status["packages_installed"] = packages_installed
        if services_ready is not None:
            init_status["services_ready"] = services_ready

# Remove the async package installation since packages are installed in Dockerfile
# install_packages_async function removed
# install_thread removed

# Initialize FastAPI app
app = FastAPI(
    title="React Scuba Python Utilities API",
    description="Documentation utilities API with Python 3.14 enhancements",
    version="0.2.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize configurations
from react_scuba_utils.config.settings import PathConfig, get_python_features, HTTPConfig

path_config = PathConfig()
http_config = HTTPConfig()
features = get_python_features()

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "React Scuba Python Utilities API",
        "version": "0.2.0",
        "python_version": features["version_string"],
        "free_threaded": features["is_free_threaded"],
        "interpreters": features["has_interpreters"],
        "endpoints": {
            "/inventory": "Component inventory",
            "/health": "Health check",
            "/links/check": "Link validation"
        }
    }

@app.get("/health")
async def health():
    """Health check endpoint with initialization status."""
    with status_lock:
        current_status = init_status.copy()

    # Add Python version and features to response
    current_status.update({
        "python_version": sys.version,
        "features": features
    })

    return JSONResponse(content=current_status)

@app.get("/inventory")
async def get_inventory(src_path: str = "src"):
    """Generate and return component inventory."""
    try:
        from react_scuba_utils.services.component_inventory import ComponentInventoryService
        from react_scuba_utils.models.models import ComponentInventoryConfig

        config = ComponentInventoryConfig(src_path=src_path)
        service = ComponentInventoryService(config, path_config)
        inventory = service.generate_inventory()

        return JSONResponse(
            content={
                "status": "success",
                "data": inventory,
                "summary": {
                    "pages": len(inventory.get("pages", [])),
                    "components": len(inventory.get("components", [])),
                    "hooks": len(inventory.get("hooks", [])),
                    "utils": len(inventory.get("utils", []))
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating inventory: {str(e)}")

@app.get("/links/check")
async def check_links(workers: int = 10, timeout: int = 10):
    """Check documentation links."""
    try:
        from react_scuba_utils.services.link_checker import LinkCheckerService
        from react_scuba_utils.models.models import LinkCheckConfig

        config = LinkCheckConfig(
            max_workers=workers,
            timeout=timeout,
            use_interpreters=features["has_interpreters"]
        )

        service = LinkCheckerService(config, path_config, http_config)
        results = service.check_links_concurrent()

        return JSONResponse(
            content={
                "status": "success",
                "data": results,
                "summary": {
                    "valid": len(results.get("valid", [])),
                    "broken": len(results.get("broken", [])),
                    "skipped": len(results.get("skipped", []))
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking links: {str(e)}")

if __name__ == "__main__":
    import uvicorn

    try:
        from react_scuba_utils.config.settings import get_python_features
        features = get_python_features()
    except ImportError:
        features = {"version_string": "unknown", "is_free_threaded": False, "has_interpreters": False}

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
        log_level="info"
    )
