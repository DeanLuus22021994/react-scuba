"""Configuration management and settings."""

from .config import (
    ApplicationConfig,
    DatabaseConfig,
    RedisConfig,
    HTTPConfig,
    PathConfig,
    LoggingConfig,
    ServiceConfig,
    Environment,
    LogLevel,
    get_config,
    reload_config,
    validate_config,
    get_database_config,
    get_redis_config,
    get_http_config,
    get_path_config,
    get_logging_config,
)

from .settings import (
    LoggingConfig as LegacyLoggingConfig,
    HTTPConfig as LegacyHTTPConfig,
    PathConfig as LegacyPathConfig,
    CorrelationLogger,
    get_python_features,
    is_free_threaded,
    has_interpreters,
)

__all__ = [
    # New centralized config
    "ApplicationConfig",
    "DatabaseConfig",
    "RedisConfig",
    "HTTPConfig",
    "PathConfig",
    "LoggingConfig",
    "ServiceConfig",
    "Environment",
    "LogLevel",
    "get_config",
    "reload_config",
    "validate_config",
    "get_database_config",
    "get_redis_config",
    "get_http_config",
    "get_path_config",
    "get_logging_config",
    # Legacy compatibility
    "LegacyLoggingConfig",
    "LegacyHTTPConfig",
    "LegacyPathConfig",
    "CorrelationLogger",
    "get_python_features",
    "is_free_threaded",
    "has_interpreters",
]
