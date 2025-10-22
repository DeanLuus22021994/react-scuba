# Docker Swarm Stack with Devcontainer

This demonstrates deploying a stack to Docker Swarm with devcontainer.

## Prerequisites

- Docker Swarm initialized: `docker swarm init`
- Or join existing swarm

## Services

- **app**: Devcontainer with Node.js, Python, NVIDIA GPU
- **db**: PostgreSQL on manager node

## Devcontainer Usage

Open in VS Code Insiders, use "Dev Containers: Reopen in Container" command.

## Swarm Deployment

```bash
cd swarm-stack
docker stack deploy -c docker-compose.yml myapp
```

## Check

```bash
docker stack services myapp
```

## Access

- DB: localhost:5432

## Cleanup

```bash
docker stack rm myapp
```
