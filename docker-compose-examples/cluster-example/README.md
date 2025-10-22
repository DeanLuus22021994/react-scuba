# Docker Cluster Example with Devcontainer

This simulates a simple cluster with devcontainer load balancer.

## Services

- **loadbalancer**: Devcontainer with Node.js, Python, NVIDIA GPU
- **web1-3**: Nginx web servers
- **db**: PostgreSQL database

## Devcontainer Usage

Open in VS Code Insiders, use "Dev Containers: Reopen in Container" command.

## Manual Usage

```bash
cd cluster-example
docker-compose up -d
```

## Access

- Load balanced web: <http://localhost:8080>
- DB: localhost:5432

## Cleanup

```bash
docker-compose down -v
```
