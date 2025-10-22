"""
Configuration module for React Scuba utilities.

This module handles configuration management, HTTP session setup,
and feature detection for Python 3.14+ capabilities.
"""

import sys
from pathlib import Path
from typing import Optional, TYPE_CHECKING

# Check if requests is available
try:
    import requests
    from requests.adapters import HTTPAdapter
    from urllib3.util.retry import Retry
except ImportError:
    requests = None

# Python 3.14+ features detection
if sys.version_info >= (3, 14):
    try:
        import concurrent.interpreters as interpreters
        from concurrent.futures import InterpreterPoolExecutor
        HAS_INTERPRETERS = True
    except ImportError:
        HAS_INTERPRETERS = False
else:
    HAS_INTERPRETERS = False


class HTTPConfig:
    """
    HTTP configuration and session management.

    Provides a configured HTTP session with retry logic and proper
    timeout handling for link checking operations.
    """

    def __init__(self, timeout: int = 10, retry_attempts: int = 3):
        self.timeout = timeout
        self.retry_attempts = retry_attempts
        self._session = None

    @property
    def session(self):
        """Get configured HTTP session."""
        if self._session is None and requests is not None:
            self._session = requests.Session()
            retry_strategy = Retry(
                total=self.retry_attempts,
                status_forcelist=[429, 500, 502, 503, 504],
                backoff_factor=1
            )
            adapter = HTTPAdapter(max_retries=retry_strategy)
            self._session.mount("http://", adapter)
            self._session.mount("https://", adapter)
        return self._session

    def is_available(self) -> bool:
        """Check if HTTP functionality is available."""
        return requests is not None


class PathConfig:
    """
    Path configuration for documentation and source directories.

    Handles path resolution and validation for the React Scuba project.
    """

    def __init__(self, docs_path: str = "docs", src_path: str = "src"):
        self.docs_path = Path(docs_path)
        self.src_path = Path(src_path)
        self.base_url = "https://deanluus22021994.github.io/react-scuba/"

    def resolve_docs_path(self) -> Path:
        """Resolve and validate docs path."""
        if not self.docs_path.exists():
            raise ValueError(f"Docs path does not exist: {self.docs_path}")
        return self.docs_path

    def resolve_src_path(self) -> Path:
        """Resolve and validate source path."""
        if not self.src_path.exists():
            raise ValueError(f"Source path does not exist: {self.src_path}")
        return self.src_path


def get_python_features() -> dict:
    """
    Get information about available Python features.

    Returns:
        Dictionary with feature availability information
    """
    return {
        'version': sys.version_info,
        'version_string': sys.version,
        'has_interpreters': HAS_INTERPRETERS,
        'is_free_threaded': getattr(sys, '_is_gil_enabled', lambda: True)() is False,
        'has_pathlib_copy': hasattr(Path, 'copy'),
        'has_pathlib_move': hasattr(Path, 'move'),
    }


def is_free_threaded() -> bool:
    """Check if Python is running in free-threaded mode."""
    return getattr(sys, '_is_gil_enabled', lambda: True)() is False


def has_interpreters() -> bool:
    """Check if concurrent interpreters are available."""
    return HAS_INTERPRETERS
