"""React Scuba MCP Utilities Package"""

__version__ = "0.1.0"
__author__ = "React Scuba Development Team"
__description__ = "Python MCP utilities for React Scuba multi-tenant platform"

from .mcp_server import MCPServer
from .health import HealthChecker

__all__ = ["MCPServer", "HealthChecker"]
