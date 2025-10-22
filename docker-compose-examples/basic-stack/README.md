# Basic Docker Compose Stack with Devcontainer

This is a simple multi-service application with devcontainer support.

## Services

- **app**: Devcontainer with Node.js, Python, NVIDIA GPU
- **db**: PostgreSQL database

## Devcontainer Usage

Open in VS Code Insiders, use "Dev Containers: Reopen in Container" command.

## Manual Usage

```bash
cd basic-stack
docker-compose up -d
```

## Access

- DB: localhost:5432 (user: user, password: password, db: mydb)

## Cleanup

```bash
docker-compose down -v
```
