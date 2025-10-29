#!/usr/bin/env python3
"""Build Grafana dashboards from component library."""
import json
from pathlib import Path

BASE = Path(__file__).parent
COMMON = BASE / "common"
PANELS = BASE / "panels"
COMPLETE = BASE / "complete"

def load_json(path):
    return json.loads(path.read_text())

def save_json(path, data):
    path.write_text(json.dumps(data, indent=2))

def build_cluster():
    return {
        "uid": "mcp-cluster",
        "title": "MCP Cluster",
        "tags": ["mcp", "docker"],
        **load_json(COMMON / "themes.json"),
        **load_json(COMMON / "annotations.json"),
        **load_json(COMMON / "templating.json"),
        "panels": [
            {**load_json(PANELS / "stat/health-status.json"), "id": 1, "gridPos": {"h": 4, "w": 6, "x": 0, "y": 0}, "title": "Total Containers", "targets": [{"expr": "count(up{job=\"docker\"})", "refId": "A"}]},
            {**load_json(PANELS / "stat/health-status.json"), "id": 2, "gridPos": {"h": 4, "w": 6, "x": 6, "y": 0}, "title": "Healthy Containers", "targets": [{"expr": "count(up{job=\"docker\"} == 1)", "refId": "A"}]},
            {**load_json(PANELS / "timeseries/cpu-usage.json"), "id": 3, "gridPos": {"h": 8, "w": 12, "x": 0, "y": 4}, "title": "Container CPU", "targets": [{"expr": "rate(container_cpu_usage_seconds_total{name!=\"\"}[5m]) * 100", "legendFormat": "{{name}}", "refId": "A"}]},
            {**load_json(PANELS / "timeseries/memory-usage.json"), "id": 4, "gridPos": {"h": 8, "w": 12, "x": 12, "y": 4}, "title": "Container Memory", "targets": [{"expr": "container_memory_usage_bytes{name!=\"\"}", "legendFormat": "{{name}}", "refId": "A"}]},
            {**load_json(PANELS / "table/health-table.json"), "id": 5, "gridPos": {"h": 8, "w": 24, "x": 0, "y": 12}, "title": "Container Status", "targets": [{"expr": "up{job=\"docker\"}", "format": "table", "instant": True, "refId": "A"}]},
        ]
    }

def build_database():
    return {
        "uid": "mcp-database",
        "title": "MCP Database",
        "tags": ["mcp", "database"],
        **load_json(COMMON / "themes.json"),
        **load_json(COMMON / "annotations.json"),
        **load_json(COMMON / "templating.json"),
        "panels": [
            {**load_json(PANELS / "stat/health-status.json"), "id": 10, "gridPos": {"h": 4, "w": 6, "x": 0, "y": 0}, "title": "PostgreSQL", "targets": [{"expr": "up{name=\"postgres-db\"}", "refId": "A"}]},
            {**load_json(PANELS / "stat/health-status.json"), "id": 11, "gridPos": {"h": 4, "w": 6, "x": 6, "y": 0}, "title": "MariaDB", "targets": [{"expr": "up{name=\"mariadb\"}", "refId": "A"}]},
            {**load_json(PANELS / "timeseries/cpu-usage.json"), "id": 12, "gridPos": {"h": 8, "w": 12, "x": 0, "y": 4}, "title": "DB Connections", "targets": [{"expr": "pg_stat_database_numbackends{datname!=\"postgres\"}", "legendFormat": "{{datname}}", "refId": "A"}]},
            {**load_json(PANELS / "timeseries/memory-usage.json"), "id": 13, "gridPos": {"h": 8, "w": 12, "x": 12, "y": 4}, "title": "DB Memory", "targets": [{"expr": "container_memory_usage_bytes{name=~\"postgres-db|mariadb\"}", "legendFormat": "{{name}}", "refId": "A"}]},
        ]
    }

def build_system():
    return {
        "uid": "mcp-system",
        "title": "MCP System",
        "tags": ["system", "resources"],
        **load_json(COMMON / "themes.json"),
        **load_json(COMMON / "annotations.json"),
        **load_json(COMMON / "templating.json"),
        "panels": [
            {**load_json(PANELS / "timeseries/cpu-usage.json"), "id": 20, "gridPos": {"h": 9, "w": 12, "x": 0, "y": 0}, "title": "Host CPU", "targets": [{"expr": "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)", "legendFormat": "CPU", "refId": "A"}]},
            {**load_json(PANELS / "timeseries/memory-usage.json"), "id": 21, "gridPos": {"h": 9, "w": 12, "x": 12, "y": 0}, "title": "Host Memory", "targets": [{"expr": "100 * (1 - ((node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes))", "legendFormat": "Memory", "refId": "A"}]},
            {**load_json(PANELS / "gauge/disk-usage.json"), "id": 22, "gridPos": {"h": 8, "w": 12, "x": 0, "y": 9}, "title": "Disk Usage", "targets": [{"expr": "100 - ((node_filesystem_avail_bytes{mountpoint=\"/\"} / node_filesystem_size_bytes{mountpoint=\"/\"}) * 100)", "legendFormat": "Root", "refId": "A"}]},
        ]
    }

if __name__ == "__main__":
    COMPLETE.mkdir(exist_ok=True)
    save_json(COMPLETE / "cluster.json", build_cluster())
    save_json(COMPLETE / "database.json", build_database())
    save_json(COMPLETE / "system.json", build_system())
    print("✓ Built 3 dashboards")
