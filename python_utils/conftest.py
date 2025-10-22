"""
Pytest configuration and fixtures for React Scuba tests.

Provides automatic mocking of external dependencies for isolated testing.
"""

import pytest
import sys
import os
from pathlib import Path

# Add python_utils to path for testing
sys.path.insert(0, str(Path(__file__).parent.parent / "python_utils"))

from tests.mocks.api_mock import mock_external_dependencies


@pytest.fixture(autouse=True)
def mock_external_services():
    """
    Automatically mock external API dependencies for all tests.

    This fixture patches HTTP requests, database connections, and Redis
    operations to prevent network calls and external service dependencies
    during unit testing.
    """
    with mock_external_dependencies() as mocks:
        yield mocks


@pytest.fixture
def api_mock():
    """Provide direct access to API mock for specific test scenarios."""
    from tests.mocks.api_mock import api_mock
    return api_mock


@pytest.fixture
def database_mock():
    """Provide direct access to database mock for specific test scenarios."""
    from tests.mocks.database_mock import database_mock
    return database_mock


@pytest.fixture
def redis_mock():
    """Provide direct access to Redis mock for specific test scenarios."""
    from tests.mocks.redis_mock import redis_client_mock
    return redis_client_mock
