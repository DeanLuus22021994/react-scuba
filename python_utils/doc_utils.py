#!/usr/bin/env python3
"""
Documentation utilities for React Scuba project.

Enhanced for Python 3.14 with free-threaded execution,
concurrent interpreters, and improved parallelism.
"""

import asyncio
import json
import os
import re
import sys
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Optional, Union
from urllib.parse import urljoin, urlparse

import yaml

# Python 3.14+ features
if sys.version_info >= (3, 14):
    try:
        import concurrent.interpreters as interpreters
        from concurrent.futures import InterpreterPoolExecutor

        HAS_INTERPRETERS = True
    except ImportError:
        HAS_INTERPRETERS = False
else:
    HAS_INTERPRETERS = False

try:
    import requests
    from requests.adapters import HTTPAdapter
    from urllib3.util.retry import Retry
except ImportError:
    requests = None


@dataclass
class LinkResult:
    """Result of a link check operation."""

    url: str
    is_valid: bool
    status_code: int | None = None
    error_message: str | None = None
    response_time: float | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class ComponentInfo:
    """Information about a React component."""

    name: str
    file: str
    path: str
    category: str
    exports: list[str]
    imports: list[str]
    size_bytes: int

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class DocUtils:
    """
    Enhanced documentation utilities leveraging Python 3.14 features.

    Features:
    - Free-threaded execution for true parallelism
    - Concurrent interpreters for isolated execution
    - Improved pathlib operations
    - Enhanced error handling and type safety
    """

    def __init__(self, docs_path: str = "docs", use_interpreters: bool = True):
        self.docs_path = Path(docs_path)
        self.base_url = "https://deanluus22021994.github.io/react-scuba/"
        self.use_interpreters = use_interpreters and HAS_INTERPRETERS

        # Configure HTTP session with retries
        if requests:
            self.session = requests.Session()
            retry_strategy = Retry(
                total=3, status_forcelist=[429, 500, 502, 503, 504], backoff_factor=1
            )
            adapter = HTTPAdapter(max_retries=retry_strategy)
            self.session.mount("http://", adapter)
            self.session.mount("https://", adapter)
        else:
            self.session = None

    def find_markdown_files(self) -> list[Path]:
        """Find all markdown files in the docs directory using pathlib."""
        return list(self.docs_path.rglob("*.md"))

    def extract_links(self, file_path: Path) -> list[str]:
        """Extract all links from a markdown file with improved regex."""
        links = []
        try:
            content = file_path.read_text(encoding="utf-8")

            # Enhanced regex for markdown links with better pattern matching
            md_links = re.findall(r"\[([^\]]+)\]\(([^)]+)\)", content)
            for _, url in md_links:
                if not url.startswith(("http://", "https://", "#")):
                    # Relative link - convert to absolute
                    links.append(urljoin(self.base_url, url))
                else:
                    links.append(url)

            # Also find HTML links
            html_links = re.findall(r'href=["\']([^"\']+)["\']', content)
            for url in html_links:
                if url.startswith(("http://", "https://")):
                    links.append(url)

        except Exception as e:
            print(f"Error reading {file_path}: {e}", file=sys.stderr)

        return list(set(links))  # Remove duplicates

    def check_links_concurrent(self, max_workers: int = 10) -> dict[str, list[str]]:
        """
        Check all links using concurrent execution.

        Uses InterpreterPoolExecutor for true parallelism in Python 3.14+.
        """
        results = {"valid": [], "broken": [], "skipped": []}

        # Find all markdown files
        md_files = self.find_markdown_files()
        all_links = set()

        # Collect all unique links
        for file_path in md_files:
            links = self.extract_links(file_path)
            all_links.update(links)

        print(f"🔍 Found {len(all_links)} unique links to check...")

        if not all_links:
            return results

        # Choose execution strategy based on Python version and availability
        if self.use_interpreters and HAS_INTERPRETERS:
            print("🚀 Using InterpreterPoolExecutor for true parallelism")
            executor_class = InterpreterPoolExecutor
        else:
            print("⚡ Using ThreadPoolExecutor for concurrent execution")
            executor_class = ThreadPoolExecutor

        # Check links concurrently
        with executor_class(max_workers=max_workers) as executor:
            futures = [
                executor.submit(self._check_single_link, url) for url in all_links
            ]

            for future in as_completed(futures):
                result: LinkResult = future.result()
                if result.error_message and "skipped" in result.error_message:
                    results["skipped"].append(result.url)
                elif result.is_valid:
                    results["valid"].append(result.url)
                else:
                    status_info = (
                        f" (status: {result.status_code})" if result.status_code else ""
                    )
                    results["broken"].append(f"{result.url}{status_info}")

        return results

    def _check_single_link(self, url: str) -> LinkResult:
        """
        Check a single link with enhanced error handling.

        Optimized for concurrent execution in free-threaded Python.
        """
        import time

        start_time = time.time()

        try:
            # Skip local development URLs
            if any(
                skip_domain in url
                for skip_domain in ["localhost", "127.0.0.1", "0.0.0.0"]
            ):
                return LinkResult(
                    url=url,
                    is_valid=True,
                    error_message="skipped",
                    response_time=time.time() - start_time,
                )

            if not self.session:
                return LinkResult(
                    url=url,
                    is_valid=False,
                    error_message="requests not available",
                    response_time=time.time() - start_time,
                )

            # Use HEAD request for efficiency, fallback to GET if needed
            response = self.session.head(url, timeout=10, allow_redirects=True)

            # Some servers don't support HEAD, try GET for 405 responses
            if response.status_code == 405:
                response = self.session.get(url, timeout=10, allow_redirects=True)

            return LinkResult(
                url=url,
                is_valid=response.status_code < 400,
                status_code=response.status_code,
                response_time=time.time() - start_time,
            )

        except Exception as e:
            return LinkResult(
                url=url,
                is_valid=False,
                error_message=str(e),
                response_time=time.time() - start_time,
            )

    def generate_component_inventory(
        self, src_path: str = "src"
    ) -> dict[str, list[dict[str, Any]]]:
        """
        Generate an enhanced inventory of React components.

        Uses pathlib improvements and better analysis.
        """
        components = {"pages": [], "components": [], "hooks": [], "utils": []}

        src_dir = Path(src_path)

        # Find component files with multiple extensions
        extensions = ["*.jsx", "*.js", "*.tsx", "*.ts"]
        component_files = []
        for ext in extensions:
            component_files.extend(src_dir.rglob(ext))

        for file_path in component_files:
            try:
                relative_path = file_path.relative_to(src_dir)
                content = file_path.read_text(encoding="utf-8")
                size_bytes = file_path.stat().st_size

                # Determine category with improved logic
                category = self._determine_category(str(relative_path))

                # Extract enhanced component information
                component_info = self._extract_component_info(
                    content, file_path, category
                )

                if component_info:
                    component_info.size_bytes = size_bytes
                    components[category].append(component_info.to_dict())

            except Exception as e:
                print(f"Error processing {file_path}: {e}", file=sys.stderr)

        return components

    def _determine_category(self, relative_path: str) -> str:
        """Determine component category with improved logic."""
        path_lower = relative_path.lower()

        if "page" in path_lower or "screen" in path_lower:
            return "pages"
        elif "hook" in path_lower:
            return "hooks"
        elif "util" in path_lower or "helper" in path_lower:
            return "utils"
        else:
            return "components"

    def _extract_component_info(
        self, content: str, file_path: Path, category: str
    ) -> ComponentInfo | None:
        """Extract comprehensive component information."""
        # Extract component name
        component_name = self._extract_component_name(content, file_path.name)

        # Extract exports
        exports = self._extract_exports(content)

        # Extract imports
        imports = self._extract_imports(content)

        return ComponentInfo(
            name=component_name,
            file=str(file_path.relative_to(file_path.parents[2])),  # Relative to src
            path=str(file_path),
            category=category,
            exports=exports,
            imports=imports,
            size_bytes=0,  # Will be set by caller
        )

    def _extract_component_name(self, content: str, filename: str) -> str:
        """Extract component name with improved patterns."""
        # Try various export patterns
        patterns = [
            r"export default (\w+)",
            r"export \{ default as (\w+) \}",
            r"(?:export )?(?:const|function|class) (\w+)",
            r"module\.exports = (\w+)",
        ]

        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1)

        # Fallback to filename
        return (
            filename.replace(".jsx", "")
            .replace(".js", "")
            .replace(".tsx", "")
            .replace(".ts", "")
        )

    def _extract_exports(self, content: str) -> list[str]:
        """Extract all exports from the file."""
        exports = []

        # Named exports
        named_exports = re.findall(
            r"export (?:const|function|class|let|var) (\w+)", content
        )
        exports.extend(named_exports)

        # Export statements
        export_statements = re.findall(r"export \{([^}]+)\}", content)
        for statement in export_statements:
            # Handle aliases like "Component as Comp"
            items = [item.split(" as ")[0].strip() for item in statement.split(",")]
            exports.extend(items)

        return list(set(exports))  # Remove duplicates

    def _extract_imports(self, content: str) -> list[str]:
        """Extract all imports from the file."""
        imports = []

        # ES6 imports
        es6_imports = re.findall(r'import .* from ["\']([^"\']+)["\']', content)
        imports.extend(es6_imports)

        # CommonJS requires
        cjs_imports = re.findall(r'require\(["\']([^"\']+)["\']', content)
        imports.extend(cjs_imports)

        return list(set(imports))  # Remove duplicates

    def copy_file(self, src: Path, dst: Path, follow_symlinks: bool = True) -> bool:
        """
        Copy a file using pathlib's new copy method (Python 3.14+).

        Falls back to shutil for older versions.
        """
        try:
            if hasattr(src, "copy"):  # Python 3.14+
                src.copy(dst, follow_symlinks=follow_symlinks)
            else:
                import shutil

                shutil.copy2(src, dst, follow_symlinks=follow_symlinks)
            return True
        except Exception as e:
            print(f"Error copying {src} to {dst}: {e}", file=sys.stderr)
            return False

    def move_file(self, src: Path, dst: Path) -> bool:
        """
        Move a file using pathlib's new move method (Python 3.14+).

        Falls back to shutil for older versions.
        """
        try:
            if hasattr(src, "move"):  # Python 3.14+
                src.move(dst)
            else:
                import shutil

                shutil.move(src, dst)
            return True
        except Exception as e:
            print(f"Error moving {src} to {dst}: {e}", file=sys.stderr)
            return False


async def async_check_links(
    self, urls: list[str], max_concurrency: int = 10
) -> dict[str, list[str]]:
    """
    Asynchronous link checking using asyncio for Python 3.14+ free-threaded execution.

    This method leverages the free-threaded nature of Python 3.14 for true parallelism.
    """
    results = {"valid": [], "broken": [], "skipped": []}

    if not self.session:
        results["broken"] = [f"{url} (requests not available)" for url in urls]
        return results

    semaphore = asyncio.Semaphore(max_concurrency)

    async def check_single_url(url: str) -> tuple[str, bool, str]:
        async with semaphore:
            try:
                if any(
                    skip_domain in url
                    for skip_domain in ["localhost", "127.0.0.1", "0.0.0.0"]
                ):
                    return url, True, "skipped"

                # Use asyncio.to_thread for I/O bound operations
                response = await asyncio.to_thread(
                    self.session.head, url, timeout=10, allow_redirects=True
                )

                if response.status_code == 405:  # HEAD not allowed
                    response = await asyncio.to_thread(
                        self.session.get, url, timeout=10, allow_redirects=True
                    )

                return (
                    url,
                    response.status_code < 400,
                    f"status: {response.status_code}",
                )

            except Exception as e:
                return url, False, str(e)

    # Create tasks for all URLs
    tasks = [check_single_url(url) for url in urls]
    completed_results: list[
        tuple[str, bool, str] | BaseException
    ] = await asyncio.gather(*tasks, return_exceptions=True)

    # Process results
    for result in completed_results:
        if isinstance(result, BaseException):
            print(f"Async task error: {result}", file=sys.stderr)
            continue

        url, is_valid, reason = result
        if "skipped" in reason:
            results["skipped"].append(url)
        elif is_valid:
            results["valid"].append(url)
        else:
            results["broken"].append(f"{url} ({reason})")

    return results


def main():
    """Enhanced CLI entry point with Python 3.14 features."""
    import argparse

    parser = argparse.ArgumentParser(
        description="React Scuba Documentation Utilities (Python 3.14 Enhanced)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python -m python_utils.doc_utils check-links
  python -m python_utils.doc_utils inventory --src-path src
  python -m python_utils.doc_utils check-links --workers 20

Python 3.14 Features:
  - Free-threaded execution for true parallelism
  - Concurrent interpreters for isolated processing
  - Enhanced pathlib operations
  - Improved concurrent.futures support
        """,
    )

    parser.add_argument(
        "command",
        choices=["check-links", "inventory", "async-check"],
        help="Command to run",
    )
    parser.add_argument("--docs-path", default="docs", help="Path to docs directory")
    parser.add_argument("--src-path", default="src", help="Path to source directory")
    parser.add_argument(
        "--workers", type=int, default=10, help="Number of worker threads/interpreters"
    )
    parser.add_argument(
        "--no-interpreters",
        action="store_true",
        help="Disable concurrent interpreters (use threads only)",
    )
    parser.add_argument("--output", help="Output file for results")

    args = parser.parse_args()

    # Initialize with Python 3.14 features
    use_interpreters = not args.no_interpreters and HAS_INTERPRETERS
    utils = DocUtils(args.docs_path, use_interpreters=use_interpreters)

    print(f"🐍 Python {sys.version}")
    print(
        f"🔧 Using {'InterpreterPoolExecutor' if use_interpreters else 'ThreadPoolExecutor'}"
    )

    if args.command == "check-links":
        print("🔗 Checking documentation links...")
        results = utils.check_links_concurrent(max_workers=args.workers)

        print(f"✅ Valid links: {len(results['valid'])}")
        print(f"❌ Broken links: {len(results['broken'])}")
        print(f"⏭️  Skipped links: {len(results['skipped'])}")

        if results["broken"]:
            print("\n❌ Broken links:")
            for link in results["broken"][:10]:  # Show first 10
                print(f"  - {link}")
            if len(results["broken"]) > 10:
                print(f"  ... and {len(results['broken']) - 10} more")

    elif args.command == "async-check":
        if sys.version_info >= (3, 14):
            print("🔗 Checking links asynchronously (Python 3.14 free-threaded)...")

            # Get all links first
            md_files = utils.find_markdown_files()
            all_links = set()
            for file_path in md_files:
                links = utils.extract_links(file_path)
                all_links.update(links)

            # Run async check
            results = asyncio.run(
                utils.async_check_links(list(all_links), args.workers)
            )

            print(f"✅ Valid links: {len(results['valid'])}")
            print(f"❌ Broken links: {len(results['broken'])}")
            print(f"⏭️  Skipped links: {len(results['skipped'])}")
        else:
            print("❌ Async checking requires Python 3.14+")

    elif args.command == "inventory":
        print("📦 Generating component inventory...")
        inventory = utils.generate_component_inventory(args.src_path)

        print(f"📄 Pages: {len(inventory['pages'])}")
        print(f"🧩 Components: {len(inventory['components'])}")
        print(f"🪝 Hooks: {len(inventory['hooks'])}")
        print(f"🛠️  Utils: {len(inventory['utils'])}")

        # Save to JSON with pretty printing
        output_file = args.output or "docs/testing/component-inventory.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(inventory, f, indent=2, ensure_ascii=False)

        print(f"📝 Inventory saved to {output_file}")

    # Save results if requested
    if args.output and args.command in ["check-links", "async-check"]:
        results_file = f"{args.output}.json"
        with open(results_file, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"📊 Results saved to {results_file}")


if __name__ == "__main__":
    main()
