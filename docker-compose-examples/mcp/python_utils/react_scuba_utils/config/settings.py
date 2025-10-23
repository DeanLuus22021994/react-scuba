"""
Configuration module for React Scuba utilities.

This module provides backward compatibility and convenience functions
while delegating to the centralized configuration system.
"""

import logging
import sys
from typing import TYPE_CHECKING, Optional

# Import from centralized config
from .config import (
    ApplicationConfig,
    get_config,
    get_http_config,
    get_logging_config,
    get_path_config,
)
from .config import CorrelationLogger as BaseCorrelationLogger
from .config import HTTPConfig as BaseHTTPConfig
from .config import LoggingConfig as BaseLoggingConfig
from .config import PathConfig as BasePathConfig

# Re-export for backward compatibility
LoggingConfig = BaseLoggingConfig
HTTPConfig = BaseHTTPConfig
PathConfig = BasePathConfig
CorrelationLogger = BaseCorrelationLogger

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


def get_python_features() -> dict:
    """
    Get information about available Python features.

    Returns:
        Dictionary with feature availability information
    """
    from pathlib import Path

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
