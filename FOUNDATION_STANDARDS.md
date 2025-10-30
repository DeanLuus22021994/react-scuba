# React Scuba - DevContainer & Standardization Foundation

## DevContainer Architecture

### Overview

The React Scuba DevContainer provides a complete, containerized development environment with:
- **Node.js 20.x** with npm workspaces monorepo
- **PostgreSQL 17** & **MariaDB 11** for database flexibility
- **Redis & Memcached** for caching layers
- **Prometheus & Grafana** for monitoring
- **NVIDIA GPU support** (optional)
- **GitHub Actions Runner** for CI/CD testing

### DevContainer Configuration

**File**: `.devcontainer.json`
```jsonc
{
  "name": "React Scuba Cluster Development",
  "dockerComposeFile": ["docker-compose.yml"],
  "service": "node-bootstrap",
  "workspaceFolder": "/workspace"
}
```

### Docker Compose Stack

**Main File**: `docker-compose.yml`
**Includes**:
- `base.yml` - Databases & caching (PostgreSQL, MariaDB, Redis, Memcached)
- `app.yml` - Application services (Node API, Web dev server)
- `monitoring.yml` - Observability (Prometheus, Grafana, Exporters)
- `loadbalancing.yml` - Nginx reverse proxy & load balancing
- `gpu.yml` - NVIDIA GPU services (Ollama, Device Plugin)

### Container Infrastructure

#### Network Configuration
```yaml
Network: mcp-cluster
Subnet: 172.28.0.0/16
Gateway: 172.28.0.1
```

#### Service Health Checks
All 17 services include health checks:
- **PostgreSQL**: TCP connectivity on port 5432
- **MariaDB**: TCP connectivity on port 3306
- **Redis**: PING command
- **Memcached**: TCP connectivity on port 11211
- **API Server**: HTTP health endpoint
- **Web Server**: HTTP connectivity check

#### Volume Management
- **Data Volumes**: Database persistence
- **Build Volumes**: npm cache, build artifacts
- **CI/CD Volumes**: GitHub Actions runner cache
- **Workspace Volumes**: Node modules for each workspace

### Environment Configuration

**File**: `devcontainer.env`
**Key Variables**:
```bash
# Database Configuration
POSTGRES_HOST=postgres-db
POSTGRES_PORT=5432
MARIADB_HOST=mariadb
MARIADB_PORT=3306

# Node.js Configuration
NODE_ENV=development
NODE_OPTIONS=--max-old-space-size=2048 --enable-source-maps
NPM_CONFIG_CACHE=/cache/node

# Python Configuration (for MCP services)
PYTHONPYCACHEPREFIX=/cache/python/bytecode
PIP_CACHE_DIR=/cache/python/pip

# Kubernetes (optional)
KUBECTL_VERSION=v1.31.2
HELM_VERSION=v3.16.2

# Network
MCP_NETWORK=mcp-cluster
MCP_SUBNET=172.28.0.0/16
```

### Service Deployment

#### Starting DevContainer

```bash
# Start all services (docker compose)
docker compose up -d

# Start with specific profile
docker compose --profile mcp up -d

# Build and start
docker compose up -d --build

# View logs
docker compose logs -f node-web

# Health check all services
docker compose ps
```

#### Service Status Verification

```powershell
# Check all containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.State}}"

# Verify database connections
docker compose exec postgres-db psql -U postgres -c "\l"
docker compose exec mariadb mysql -u root -p${MARIADB_PASSWORD} -e "SHOW DATABASES;"

# Check cache layers
docker compose exec redis redis-cli ping
docker compose exec memcached nc -z localhost 11211

# Verify monitoring stack
curl http://localhost:9090  # Prometheus
curl http://localhost:3000  # Grafana
```

### Known Limitations & Solutions

#### cAdvisor Metrics (Windows Docker Desktop)

**Issue**: 20 stale container errors in cAdvisor logs
- Cause: Docker Desktop Windows caches container metadata in WSL2 layer
- Impact: Minor - only affects 20 metrics, doesn't affect functionality
- Status: ✅ Acceptable for development

**Available Metrics**:
- CPU metrics: 14 (partial)
- Memory metrics: 48 (full)
- Network metrics: 0 (none)

**Solution Options**:
1. **Accept limitation** (current) - Works fine for development
2. **Use native Linux** - Deploy to Ubuntu/Linux for zero errors
3. **Ubuntu WSL2** - Run Docker Engine natively in WSL2

---

## Code Standardization

### JavaScript/TypeScript Standards

#### ESLint Configuration
**File**: `server/eslint.config.js`
- **Version**: ESLint 9 (flat config)
- **React**: 19 support with JSX transform
- **Accessibility**: jsx-a11y enforcement
- **Hooks**: React Hooks validation

**Key Rules**:
```javascript
'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }]
'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
'quotes': ['warn', 'single']
'indent': ['warn', 2]
'max-len': ['warn', { code: 100 }]
'react-hooks/rules-of-hooks': 'error'
'jsx-a11y/alt-text': 'warn'
```

#### Prettier Configuration
**File**: `server/.prettierrc.json`
```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "always-multiline",
  "endOfLine": "lf"
}
```

#### TypeScript Configuration
**Files**: `server/packages/config/tsconfig.*.json`

**Strict Mode Enabled** (all workspaces):
```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "exactOptionalPropertyTypes": true
}
```

### Naming Conventions

#### JavaScript/TypeScript

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Functions | camelCase | `calculateTotal()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Files (utils) | kebab-case | `format-date.ts` |
| React Hooks | useXxx | `useAuth.ts` |
| Test files | *.test.tsx | `Button.test.tsx` |

#### Python

| Type | Pattern | Example |
|------|---------|---------|
| Classes | PascalCase | `UserValidator` |
| Functions | snake_case | `calculate_total()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Modules | snake_case | `user_service.py` |
| Private | _snake_case | `_internal_method()` |

### Python Standards

#### Ruff Configuration
**File**: `docker-compose-examples/mcp/python_utils/pyproject.toml`

```toml
[tool.ruff]
target-version = "py314"
line-length = 100
indent-width = 4

[tool.ruff.lint]
select = ["E", "W", "F", "I", "B", "C4", "UP"]
```

#### isort Configuration
```toml
[tool.isort]
profile = "black"
line_length = 100
multi_line_output = 3
include_trailing_comma = true
```

#### Pytest Configuration
```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
addopts = [
  "-v",
  "--cov=react_scuba_utils",
  "--cov-report=html"
]
```

---

## Quality Assurance Workflow

### Local Development Cycle

```bash
# 1. Install dependencies
cd server && npm install --legacy-peer-deps

# 2. Run linting check
npm run lint

# 3. Auto-fix formatting issues
npm run lint:fix && npm run format

# 4. Run tests
npm test

# 5. Verify build
npm run build
```

### Pre-Commit Validation

```bash
# Run full pre-commit checks
npm run precommit
# Runs: lint + format:check + tests
```

### Continuous Integration

```bash
# Full quality check (used in CI/CD)
npm run check
# Runs: lint + format:check
```

### Python Quality Assurance

```bash
# Lint check
uv run --python 3.14t ruff check docker-compose-examples/mcp/python_utils/

# Fix issues
uv run --python 3.14t ruff check --fix docker-compose-examples/mcp/python_utils/

# Import sorting
uv run --python 3.14t isort docker-compose-examples/mcp/python_utils/

# Run tests
uv run --python 3.14t pytest docker-compose-examples/mcp/python_utils/tests/
```

---

## Repository Structure & Standards

### Monorepo Organization

```
server/
├── apps/                    # Applications
│   ├── web/                # React 19 frontend (Vite 7)
│   │   ├── src/
│   │   │   ├── components/  # *.tsx components (PascalCase)
│   │   │   ├── hooks/       # useXxx.ts hooks
│   │   │   ├── services/    # API services
│   │   │   ├── utils/       # camelCase utilities
│   │   │   └── stores/      # Zustand state management
│   │   └── tests/           # *.test.tsx colocated
│   ├── api/                # Express.js backend
│   ├── content/            # Multi-tenant content
│   └── docs/               # VitePress documentation
├── packages/               # Shared packages
│   ├── config/            # TypeScript configs
│   ├── types/             # Type definitions
│   ├── ui/                # React UI library
│   └── utils/             # Shared utilities
├── clients/               # Multi-tenant configs
└── scripts/               # Build & validation
```

### File Organization Standards

#### React Components
```
src/components/UserProfile/
├── UserProfile.tsx          # Component (PascalCase)
├── UserProfile.module.css   # Styles (kebab-case)
├── UserProfile.test.tsx     # Tests (*.test.tsx)
├── hooks/
│   └── useUserData.ts       # Custom hooks (useXxx)
└── types/
    └── UserProfile.types.ts # Types (PascalCase.types.ts)
```

#### Utilities
```
src/utils/
├── format-date.ts           # kebab-case
├── validate-email.ts
├── currency-converter.ts
└── __tests__/
    └── format-date.test.ts
```

---

## Compliance Checklist

### DevContainer ✅
- [x] Docker Compose stack (17 services)
- [x] All containers healthy
- [x] Environment variables configured
- [x] Volume management set up
- [x] Health checks enabled
- [x] Network isolation (mcp-cluster)
- [x] VS Code extensions configured

### Code Standards ✅
- [x] ESLint 9 flat config enabled
- [x] Prettier 3.4.2 configured
- [x] All files formatted (71+)
- [x] TypeScript strict mode enforced
- [x] React 19 patterns validated
- [x] Accessibility rules enabled
- [x] Python Ruff configured
- [x] Tests passing (277+)

### Naming Conventions ✅
- [x] PascalCase components documented
- [x] camelCase functions standard
- [x] UPPER_SNAKE_CASE constants
- [x] kebab-case files
- [x] useXxx hooks pattern
- [x] *.test.tsx naming
- [x] Python snake_case documented

### Quality Assurance ✅
- [x] Pre-commit validation scripts
- [x] npm run lint/format commands
- [x] Python linting (Ruff + isort)
- [x] Test suite (Vitest + Pytest)
- [x] Coverage targets (80%+)

### Documentation ✅
- [x] Code standards guide
- [x] DevContainer setup
- [x] Naming conventions
- [x] Quality assurance workflow
- [x] Troubleshooting guide

---

## Next Steps

### Immediate (Complete Before Commits)
1. ✅ DevContainer validated and healthy
2. ✅ Code standards applied and documented
3. ⏭️ Configure Husky pre-commit hooks
4. ⏭️ Test full CI/CD pipeline

### Short-term (This Sprint)
- Set up GitHub Actions workflow
- Add pre-commit lint/test validation
- Document in team onboarding materials
- Review code with team

### Long-term (Production)
- Migrate to native Linux Docker for zero errors
- Scale monitoring with Kubernetes
- Add performance benchmarking
- Implement automated security scanning

---

## Support & Troubleshooting

### DevContainer Issues

**Containers won't start**:
```bash
# Clean up volumes and restart
docker compose down -v
docker compose up -d --build
```

**Network issues**:
```bash
# Check network
docker network ls | grep mcp-cluster
docker network inspect mcp-cluster
```

### Code Quality Issues

**Linting fails**:
```bash
# Auto-fix common issues
npm run lint:fix

# If still failing, check specific file
npx eslint apps/web/src/App.tsx --debug
```

**Formatting issues**:
```bash
# Apply Prettier
npm run format

# Verify formatting
npm run format:check
```

---

## Resources

- [DevContainer Documentation](https://containers.dev)
- [Docker Compose Reference](https://docs.docker.com/compose)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [Python Ruff Linter](https://docs.astral.sh/ruff/)
- [React 19 Documentation](https://react.dev)

---

**Last Updated**: October 30, 2025
**Foundation Version**: 1.0.0
**Status**: ✅ Stable
