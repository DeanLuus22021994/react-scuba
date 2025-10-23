"""
Link checking service for React Scuba documentation.

This module provides comprehensive link validation functionality
with support for concurrent execution and Python 3.14+ features.
"""

import asyncio
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin

from ..config.settings import HAS_INTERPRETERS, HTTPConfig, PathConfig
from ..models.models import LinkCheckConfig, LinkResult

if HAS_INTERPRETERS:
    from concurrent.futures import ProcessPoolExecutor as InterpreterPoolExecutor
else:
    from concurrent.futures import ThreadPoolExecutor


class LinkCheckerService:
    """
    Service for checking documentation links.

    Provides both synchronous and asynchronous link checking with
    support for concurrent interpreters and free-threaded execution.
    """

    def __init__(
        self, config: LinkCheckConfig, path_config: PathConfig, http_config: HTTPConfig
    ) -> None:
        self.config = config
        self.path_config = path_config
        self.http_config = http_config

    def find_markdown_files(self) -> list[Path]:
        """Find all markdown files in the docs directory."""
        docs_path = self.path_config.docs_path
        return list(docs_path.rglob("*.md"))

    def extract_links(self, file_path: Path) -> list[str]:
        """
        Extract all links from a markdown file.

        Returns absolute URLs for both relative and external links.
        """
        links = []
        try:
            content = file_path.read_text(encoding="utf-8")

            # Extract markdown links [text](url)
            md_links = re.findall(r"\[([^\]]+)\]\(([^)]+)\)", content)
            for _, url in md_links:
                if not url.startswith(("http://", "https://", "#")):
                    # Convert relative links to absolute
                    links.append(urljoin(self.path_config.base_url, url))
                else:
                    links.append(url)

            # Extract HTML links
            html_links = re.findall(r'href=["\']([^"\']+)["\']', content)
            for url in html_links:
                if url.startswith(("http://", "https://")):
                    links.append(url)

        except Exception as e:
            print(f"Error reading {file_path}: {e}", file=sys.stderr)

        return list(set(links))  # Remove duplicates

    def check_links_concurrent(self) -> dict[str, list[str]]:
        """
        Check all links using concurrent execution.

        Uses InterpreterPoolExecutor for true parallelism in Python 3.14+.
        """
        results: dict[str, list[str]] = {"valid": [], "broken": [], "skipped": []}

        # Find all markdown files and collect links
        md_files = self.find_markdown_files()
        all_links = set()

        for file_path in md_files:
            links = self.extract_links(file_path)
            all_links.update(links)

        print(f"🔍 Found {len(all_links)} unique links to check...")

        if not all_links:
            return results

        # Choose execution strategy
        if self.config.use_interpreters and HAS_INTERPRETERS:
            print("🚀 Using InterpreterPoolExecutor for true parallelism")
            executor_class = InterpreterPoolExecutor
        else:
            print("⚡ Using ThreadPoolExecutor for concurrent execution")
            executor_class = ThreadPoolExecutor

        # Check links concurrently
        with executor_class(max_workers=self.config.max_workers) as executor:
            futures = [
                executor.submit(self._check_single_link, url) for url in all_links
            ]

            for future in futures:
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
        start_time = time.time()

        try:
            # Skip configured domains
            if any(skip_domain in url for skip_domain in self.config.skip_domains):
                return LinkResult(
                    url=url,
                    is_valid=True,
                    error_message="skipped",
                    response_time=time.time() - start_time,
                )

            # Check if requests is available
            if not hasattr(self, "_requests_available"):
                try:
                    import requests
                    from requests.adapters import HTTPAdapter
                    from urllib3.util.retry import Retry

                    self._requests_available = True
                    # Create session with retry strategy
                    self._session = requests.Session()
                    retry_strategy = Retry(
                        total=self.http_config.max_retries,
                        status_forcelist=self.http_config.retry_status_codes,
                        backoff_factor=self.http_config.backoff_factor,
                    )
                    adapter = HTTPAdapter(max_retries=retry_strategy)
                    self._session.mount("http://", adapter)
                    self._session.mount("https://", adapter)
                    self._session.headers.update(
                        {"User-Agent": self.http_config.user_agent}
                    )
                except ImportError:
                    self._requests_available = False
                    self._session = None

            if not self._requests_available or self._session is None:
                return LinkResult(
                    url=url,
                    is_valid=False,
                    error_message="requests not available",
                    response_time=time.time() - start_time,
                )

            session = self._session

            # Use HEAD request for efficiency, fallback to GET if needed
            response = session.head(
                url, timeout=self.config.timeout, allow_redirects=True
            )

            # Some servers don't support HEAD, try GET for 405 responses
            if response.status_code == 405:
                response = session.get(
                    url, timeout=self.config.timeout, allow_redirects=True
                )

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

    async def async_check_links(self, urls: list[str]) -> dict[str, list[str]]:
        """
        Asynchronous link checking using asyncio.

        Leverages free-threaded execution in Python 3.14+ for true parallelism.
        """
        results: dict[str, list[str]] = {"valid": [], "broken": [], "skipped": []}

        # Check if requests is available
        if not hasattr(self, "_requests_available"):
            try:
                import requests
                from requests.adapters import HTTPAdapter
                from urllib3.util.retry import Retry

                self._requests_available = True
                # Create session with retry strategy
                self._session = requests.Session()
                retry_strategy = Retry(
                    total=self.http_config.max_retries,
                    status_forcelist=self.http_config.retry_status_codes,
                    backoff_factor=self.http_config.backoff_factor,
                )
                adapter = HTTPAdapter(max_retries=retry_strategy)
                self._session.mount("http://", adapter)
                self._session.mount("https://", adapter)
                self._session.headers.update(
                    {"User-Agent": self.http_config.user_agent}
                )
            except ImportError:
                self._requests_available = False
                self._session = None

        if not self._requests_available or self._session is None:
            results["broken"] = [f"{url} (requests not available)" for url in urls]
            return results

        semaphore = asyncio.Semaphore(self.config.max_workers)

        async def check_single_url(url: str) -> tuple[str, bool, str]:
            async with semaphore:
                try:
                    if any(
                        skip_domain in url for skip_domain in self.config.skip_domains
                    ):
                        return url, True, "skipped"

                    session = self._session
                    if session is None:
                        return url, False, "HTTP session not available"

                    # Use asyncio.to_thread for I/O bound operations
                    response = await asyncio.to_thread(
                        session.head,
                        url,
                        timeout=self.config.timeout,
                        allow_redirects=True,
                    )

                    if response.status_code == 405:  # HEAD not allowed
                        response = await asyncio.to_thread(
                            session.get,
                            url,
                            timeout=self.config.timeout,
                            allow_redirects=True,
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
