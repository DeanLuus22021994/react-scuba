"""Test suite for React Scuba MCP utilities"""

import pytest
from react_scuba_utils.mcp_server import MCPServer
from react_scuba_utils.health import HealthChecker


class TestMCPServer:
    """Test MCP server functionality"""

    def test_server_initialization(self):
        """Test server initialization with default parameters"""
        server = MCPServer()
        assert server.host == "0.0.0.0"
        assert server.port == 9099
        assert server.version == "1.0.0"
        assert server.protocol == "MCP/1.0"
        assert server.active_connections == []

    def test_server_custom_port(self):
        """Test server initialization with custom port"""
        server = MCPServer(host="localhost", port=8080)
        assert server.host == "localhost"
        assert server.port == 8080

    def test_app_creation(self):
        """Test FastAPI app creation"""
        server = MCPServer()
        app = server.create_app()
        assert app.title == "React Scuba MCP Server"
        assert app.version == "1.0.0"


class TestHealthChecker:
    """Test health checker functionality"""

    def test_health_checker_initialization(self):
        """Test health checker initialization"""
        checker = HealthChecker()
        assert checker.endpoint == "http://localhost:9099/health"
        assert checker.timeout == 5.0

    def test_health_checker_custom_endpoint(self):
        """Test health checker with custom endpoint"""
        checker = HealthChecker(endpoint="http://example.com:9099/health")
        assert checker.endpoint == "http://example.com:9099/health"

    @pytest.mark.asyncio
    async def test_health_check_timeout(self):
        """Test health check timeout handling"""
        checker = HealthChecker(endpoint="http://invalid-endpoint:9999/health")
        result = await checker.check()
        assert result["status"] == "unhealthy"
        assert "error" in result


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
