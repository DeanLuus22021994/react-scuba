"""
MCP (Model Context Protocol) server for React Scuba utilities.

This module implements an MCP server that exposes documentation utilities
as MCP tools for integration with AI assistants and other MCP clients.
"""

import asyncio
from collections.abc import Sequence
from typing import Any

from ..config.settings import HTTPConfig, PathConfig
from ..models.models import ComponentInventoryConfig, LinkCheckConfig
from ..services.component_inventory import ComponentInventoryService
from ..services.link_checker import LinkCheckerService

try:
    import mcp.server.stdio
    from mcp import Tool
    from mcp.server import Server
    from mcp.types import TextContent

    MCP_AVAILABLE = True
except ImportError:
    MCP_AVAILABLE = False

    # Define dummy classes for type checking
    class Tool:
        pass

    class Server:
        pass


class ReactScubaMCPServer:
    """
    MCP server for React Scuba documentation utilities.

    Provides tools for link checking and component inventory generation
    through the Model Context Protocol.
    """

    def __init__(self):
        if not MCP_AVAILABLE:
            raise ImportError("MCP package is required for MCP server functionality")

        self.server = Server("react-scuba-utils")
        self.path_config = PathConfig()
        self.http_config = HTTPConfig()

        # Register tools
        self._register_tools()

    def _register_tools(self):
        """Register MCP tools."""

        @self.server.list_tools()
        async def list_tools() -> list[Tool]:
            """List available MCP tools."""
            return [
                Tool(
                    name="check_documentation_links",
                    description="Check all links in documentation files for validity",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "docs_path": {
                                "type": "string",
                                "description": "Path to documentation directory",
                                "default": "docs",
                            },
                            "max_workers": {
                                "type": "integer",
                                "description": "Maximum number of concurrent workers",
                                "default": 10,
                            },
                            "use_interpreters": {
                                "type": "boolean",
                                "description": "Use concurrent interpreters if available",
                                "default": True,
                            },
                        },
                    },
                ),
                Tool(
                    name="generate_component_inventory",
                    description="Generate an inventory of React components in the source code",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "src_path": {
                                "type": "string",
                                "description": "Path to source directory",
                                "default": "src",
                            },
                            "extensions": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "File extensions to scan",
                                "default": ["*.jsx", "*.js", "*.tsx", "*.ts"],
                            },
                        },
                    },
                ),
                Tool(
                    name="get_component_info",
                    description="Get detailed information about a specific component",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "component_name": {
                                "type": "string",
                                "description": "Name of the component to analyze",
                            },
                            "src_path": {
                                "type": "string",
                                "description": "Path to source directory",
                                "default": "src",
                            },
                        },
                        "required": ["component_name"],
                    },
                ),
            ]

        @self.server.call_tool()
        async def call_tool(
            name: str, arguments: dict[str, Any]
        ) -> Sequence[TextContent]:
            """Handle tool calls."""
            if name == "check_documentation_links":
                return await self._check_links_tool(arguments)
            elif name == "generate_component_inventory":
                return await self._generate_inventory_tool(arguments)
            elif name == "get_component_info":
                return await self._get_component_info_tool(arguments)
            else:
                raise ValueError(f"Unknown tool: {name}")

    async def _check_links_tool(
        self, arguments: dict[str, Any]
    ) -> Sequence[TextContent]:
        """Handle link checking tool calls."""
        docs_path = arguments.get("docs_path", "docs")
        max_workers = arguments.get("max_workers", 10)
        use_interpreters = arguments.get("use_interpreters", True)

        # Update path config
        self.path_config = PathConfig(docs_path=docs_path)

        # Create link checker service
        config = LinkCheckConfig(
            max_workers=max_workers, use_interpreters=use_interpreters
        )
        service = LinkCheckerService(config, self.path_config, self.http_config)

        # Run link check
        results = service.check_links_concurrent()

        # Format results
        output = "Link Check Results:\n"
        output += f"✅ Valid links: {len(results['valid'])}\n"
        output += f"❌ Broken links: {len(results['broken'])}\n"
        output += f"⏭️  Skipped links: {len(results['skipped'])}\n"

        if results["broken"]:
            output += "\n❌ Broken links:\n"
            for link in results["broken"][:10]:
                output += f"  - {link}\n"
            if len(results["broken"]) > 10:
                output += f"  ... and {len(results['broken']) - 10} more\n"

        return [TextContent(type="text", text=output)]

    async def _generate_inventory_tool(
        self, arguments: dict[str, Any]
    ) -> Sequence[TextContent]:
        """Handle component inventory tool calls."""
        src_path = arguments.get("src_path", "src")
        extensions = arguments.get("extensions", ["*.jsx", "*.js", "*.tsx", "*.ts"])

        # Update path config
        self.path_config = PathConfig(src_path=src_path)

        # Create inventory service
        config = ComponentInventoryConfig(src_path=src_path, extensions=extensions)
        service = ComponentInventoryService(config, self.path_config)

        # Generate inventory
        inventory = service.generate_inventory()

        # Format results
        output = "Component Inventory:\n"
        output += f"📄 Pages: {len(inventory['pages'])}\n"
        output += f"🧩 Components: {len(inventory['components'])}\n"
        output += f"🪝 Hooks: {len(inventory['hooks'])}\n"
        output += f"🛠️  Utils: {len(inventory['utils'])}\n"

        # Add detailed breakdown
        for category, components in inventory.items():
            if components:
                output += f"\n{category.upper()}:\n"
                for comp in components[:5]:  # Show first 5
                    output += f"  - {comp['name']} ({comp['file']})\n"
                if len(components) > 5:
                    output += f"  ... and {len(components) - 5} more\n"

        return [TextContent(type="text", text=output)]

    async def _get_component_info_tool(
        self, arguments: dict[str, Any]
    ) -> Sequence[TextContent]:
        """Handle component info tool calls."""
        component_name = arguments["component_name"]
        src_path = arguments.get("src_path", "src")

        # Update path config
        self.path_config = PathConfig(src_path=src_path)

        # Create inventory service
        config = ComponentInventoryConfig(src_path=src_path)
        service = ComponentInventoryService(config, self.path_config)

        # Generate inventory and find component
        inventory = service.generate_inventory()

        # Search for component
        for category, components in inventory.items():
            for comp in components:
                if comp["name"] == component_name:
                    output = f"Component Information: {component_name}\n"
                    output += f"Category: {category}\n"
                    output += f"File: {comp['file']}\n"
                    output += f"Path: {comp['path']}\n"
                    output += f"Size: {comp['size_bytes']} bytes\n"
                    output += f"Exports: {', '.join(comp['exports']) if comp['exports'] else 'None'}\n"
                    output += f"Imports: {', '.join(comp['imports']) if comp['imports'] else 'None'}\n"
                    return [TextContent(type="text", text=output)]

        return [
            TextContent(type="text", text=f"Component '{component_name}' not found")
        ]

    async def run(self):
        """Run the MCP server."""
        async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream, write_stream, self.server.create_initialization_options()
            )


def main():
    """MCP server entry point."""
    if not MCP_AVAILABLE:
        print("❌ MCP package is required. Install with: pip install mcp")
        return 1

    server = ReactScubaMCPServer()
    asyncio.run(server.run())
    return 0


if __name__ == "__main__":
    exit(main())
