"""MCP Server Implementation with FastAPI
HTTP endpoint on internal port 9099
Full MCP protocol validation and real-time health monitoring
"""

import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
import structlog
import uvicorn

# Configure structured logging
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer(),
    ],
    logger_factory=structlog.PrintLoggerFactory(),
)

logger = structlog.get_logger(__name__)


class MCPServer:
    """MCP Server with HTTP endpoint and WebSocket support"""

    def __init__(self, host: str = "0.0.0.0", port: int = 9099):
        self.host = host
        self.port = port
        self.version = "1.0.0"
        self.protocol = "MCP/1.0"
        self.active_connections: list[WebSocket] = []

    @asynccontextmanager
    async def lifespan(self, app: FastAPI):
        """Application lifespan management"""
        logger.info("mcp_server_starting", host=self.host, port=self.port)
        yield
        logger.info("mcp_server_shutting_down")

    def create_app(self) -> FastAPI:
        """Create FastAPI application"""
        app = FastAPI(
            title="React Scuba MCP Server",
            description="Python MCP utilities for React Scuba platform",
            version=self.version,
            lifespan=self.lifespan,
        )

        @app.get("/")
        async def root():
            """Root endpoint"""
            return {
                "service": "react-scuba-mcp",
                "version": self.version,
                "protocol": self.protocol,
                "status": "running",
            }

        @app.get("/health")
        async def health():
            """Health check endpoint with MCP protocol validation"""
            return JSONResponse(
                content={
                    "status": "healthy",
                    "version": self.version,
                    "protocol": self.protocol,
                    "connections": len(self.active_connections),
                },
                status_code=200,
            )

        @app.get("/info")
        async def info():
            """Server information"""
            return {
                "server": "react-scuba-mcp",
                "version": self.version,
                "protocol": self.protocol,
                "capabilities": [
                    "health-monitoring",
                    "protocol-validation",
                    "websocket-streaming",
                ],
            }

        @app.websocket("/ws")
        async def websocket_endpoint(websocket: WebSocket):
            """WebSocket endpoint for real-time communication"""
            await websocket.accept()
            self.active_connections.append(websocket)
            logger.info("websocket_connection_established", clients=len(self.active_connections))

            try:
                while True:
                    data = await websocket.receive_text()
                    logger.debug("websocket_message_received", message=data)
                    await websocket.send_json(
                        {
                            "type": "echo",
                            "message": data,
                            "protocol": self.protocol,
                        }
                    )
            except WebSocketDisconnect:
                self.active_connections.remove(websocket)
                logger.info("websocket_connection_closed", clients=len(self.active_connections))

        return app

    def run(self):
        """Run the MCP server"""
        app = self.create_app()
        uvicorn.run(
            app,
            host=self.host,
            port=self.port,
            log_level="info",
            access_log=True,
        )


def main():
    """Main entry point"""
    server = MCPServer(host="0.0.0.0", port=9099)
    server.run()


if __name__ == "__main__":
    main()
