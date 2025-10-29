"""Health checker with MCP protocol validation
Full protocol compliance testing and health monitoring
"""

import argparse
import sys
from typing import Dict, Any

import httpx
import structlog

logger = structlog.get_logger(__name__)


class HealthChecker:
    """Health checker with protocol validation"""

    def __init__(self, endpoint: str = "http://localhost:9099/health"):
        self.endpoint = endpoint
        self.timeout = 5.0

    async def check(self, protocol_validation: bool = False) -> Dict[str, Any]:
        """Perform health check"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.endpoint, timeout=self.timeout)

                if response.status_code != 200:
                    return {
                        "status": "unhealthy",
                        "error": f"HTTP {response.status_code}",
                        "endpoint": self.endpoint,
                    }

                data = response.json()

                if protocol_validation:
                    # Validate MCP protocol compliance
                    required_fields = ["status", "version", "protocol"]
                    missing_fields = [field for field in required_fields if field not in data]

                    if missing_fields:
                        return {
                            "status": "unhealthy",
                            "error": f"Missing MCP protocol fields: {missing_fields}",
                            "endpoint": self.endpoint,
                        }

                    # Validate protocol format
                    if not data.get("protocol", "").startswith("MCP/"):
                        return {
                            "status": "unhealthy",
                            "error": f"Invalid protocol format: {data.get('protocol')}",
                            "endpoint": self.endpoint,
                        }

                return {
                    "status": "healthy",
                    "endpoint": self.endpoint,
                    "data": data,
                }

        except httpx.TimeoutException:
            return {
                "status": "unhealthy",
                "error": "Request timeout",
                "endpoint": self.endpoint,
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "endpoint": self.endpoint,
            }


async def main_async():
    """Async main entry point"""
    parser = argparse.ArgumentParser(description="MCP Health Checker")
    parser.add_argument(
        "--endpoint",
        default="http://localhost:9099/health",
        help="Health check endpoint URL",
    )
    parser.add_argument(
        "--protocol-validation",
        action="store_true",
        help="Enable MCP protocol validation",
    )
    args = parser.parse_args()

    checker = HealthChecker(endpoint=args.endpoint)
    result = await checker.check(protocol_validation=args.protocol_validation)

    if result["status"] == "healthy":
        logger.info("health_check_passed", **result)
        return 0
    else:
        logger.error("health_check_failed", **result)
        return 1


def main():
    """Main entry point"""
    import asyncio

    sys.exit(asyncio.run(main_async()))


if __name__ == "__main__":
    main()
