# React Scuba Platform 🤿

A **cloud-native multi-tenant SaaS platform** for marine tourism and dive center management. Built on Kubernetes with full tenant isolation, horizontal scaling, and enterprise-grade observability.

**Platform Architecture**: Multi-tenant Kubernetes infrastructure serving independent client deployments
**Reference Clients**: DI Authority Johannesburg (South Africa), Ocean Spirit Mauritius
**Technology Stack**: React 19, Node.js 20, PostgreSQL 17, Linkerd service mesh

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Platform](https://img.shields.io/badge/Platform-Multi--Tenant-success.svg)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.31-326ce5.svg)](https://kubernetes.io/)
![Tenants](https://img.shields.io/badge/Active_Tenants-2-blue.svg)
[![Documentation](https://img.shields.io/badge/docs-live-success.svg)](https://deanluus22021994.github.io/react-scuba/)

## ✨ Features

### Infrastructure (Kubernetes-Native)

- ☸️ **Kubernetes 1.31** - Container orchestration with kind for local dev
- � **Linkerd Service Mesh** - mTLS, traffic shaping, observability
- 🗄️ **Multi-Database** - PostgreSQL 17 (Zalando Operator), MariaDB 11 (Galera)
- 🔄 **GitOps Ready** - ArgoCD ApplicationSets for multi-tenant deployments
- 📦 **Helm Charts** - Parameterized tenant deployments
- 🔒 **Network Policies** - Tenant isolation with zero-trust security
- 🎯 **Horizontal Scaling** - HPA with CPU/memory targets
- � **Full Observability** - Prometheus, Grafana, Jaeger, Fluent Bit

### Multi-Tenancy Architecture

- 🏢 **Tenant Isolation** - Separate databases, configs per tenant
- 🌐 **Domain Routing** - nginx-ingress with tenant-specific subdomains
- � **RBAC** - Least-privilege ServiceAccounts per namespace
- � **Shared Infrastructure** - Optimized resource utilization
- � **Rapid Onboarding** - Tenant template with 5-minute setup
- � **Per-Tenant Metrics** - Isolated monitoring and alerting

### Application Stack

- ⚡ **React 19.2** - Concurrent rendering, server components
- 🚀 **Vite 7.1** - <10s builds with SWC plugin
- 🎨 **Tailwind CSS 4** - PostCSS-based utility framework
- 🔄 **TanStack Query v5** - Server state management
- �️ **Zustand** - Lightweight client state
- 🧪 **Vitest 3.2** - Fast unit testing
- 🎭 **Playwright 1.56** - E2E testing across browsers

### DevOps & Automation

- 🐳 **Docker Compose** - Local multi-service development
- 🔧 **Skaffold** - Hot-reload Kubernetes development
- 🤖 **MCP Services** - Model Context Protocol for AI agents
- 📝 **AI-Optimized Docs** - Machine-readable metadata
- 🔍 **Automated Validation** - Manifest, Helm, policy checks

## 🚀 Quick Start

### Prerequisites

- **Node.js 20.x** and npm 10.9.2
- **Docker Desktop** with Kubernetes enabled
- **kind** (Kubernetes in Docker) - `go install sigs.k8s.io/kind@latest`
- **kubectl** 1.31+
- **Helm** 3.x
- **Git** with submodules support

### Kubernetes Development Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/DeanLuus22021994/react-scuba.git
   cd react-scuba
   ```

2. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Start kind cluster:**
   ```bash
   cd .devcontainer/kind
   ./setup-cluster.sh
   ```

4. **Deploy infrastructure:**
   ```bash
   # Apply base infrastructure
   kubectl apply -k k8s/base/storage
   kubectl apply -k k8s/base/databases
   kubectl apply -k k8s/base/cache
   kubectl apply -k k8s/base/rbac
   kubectl apply -k k8s/base/networking

   # Deploy monitoring stack
   kubectl apply -k k8s/base/monitoring

   # Deploy MCP services
   kubectl apply -k k8s/base/mcp
   ```

5. **Deploy tenant application:**
   ```bash
   # Using Helm
   helm install di-authority-johannesburg k8s/charts/react-scuba \
     --namespace apps \
     --values k8s/tenants/di-authority-johannesburg/values.yaml

   # Or using Skaffold (hot-reload dev)
   skaffold dev --profile dev
   ```

6. **Access services:**
   ```bash
   # API
   kubectl port-forward -n apps svc/node-api 3000:3000

   # Web
   kubectl port-forward -n apps svc/node-web 8080:80

   # Grafana
   kubectl port-forward -n monitoring svc/grafana 3001:3000
   ```

### Traditional Development (Non-Kubernetes)

1. **Install and configure:**
   ```bash
   cd server/apps/web
   npm install
   cp .env.example .env
   # Edit .env with configuration
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

## 📦 Scripts

### Kubernetes Operations

- `npm run mcp:validate` - Validate MCP server configs
- `npm run mcp:build` - Build MCP Docker images
- `npm run mcp:test` - Test MCP server startup
- `npm run validate:docs` - Validate docs structure & metadata
- `.\validate-k8s.ps1` - Full infrastructure validation

### Application Development

- `npm run dev` - Start all workspaces (apps/api, apps/web, apps/content)
- `npm run build` - Build all workspaces
- `npm run build:prod` - Optimized production build
- `npm run build:analyze` - Bundle analysis

### Testing & Quality

- `npm test` - Run all tests (watch mode)
- `npm run test:coverage` - Generate coverage reports
- `npm run lint` - Validate with native TypeScript language server
- `npm run format` - Format all files
- `npx playwright test` - Run E2E tests

### Documentation

- `npm run docs:dev` - Start VitePress documentation server
- `npm run docs:build` - Build documentation site
- `npm run validate:docs` - Validate TOC structure and links

### Deployment

- `skaffold dev` - Deploy with hot-reload (all tenants)
- `skaffold dev --profile dev` - Single tenant development
- `kubectl apply -k k8s/overlays/dev` - Deploy dev environment
- `kubectl apply -k k8s/overlays/prod` - Deploy production environment

## 📚 Documentation

### AI-Optimized Documentation Structure

Documentation is organized for **maximum AI agent comprehension** with machine-readable metadata:

#### `.copilot/` - Semantic AI Context (Root Level)
High-level architecture, planning, and AI agent guides:
- **`architecture/`** - Multi-tenant patterns, industry concepts
- **`infrastructure/`** - DevContainer, MCP services, workflows
- **`modernization/`** - Technology stack evolution
- **`getting-started/`** - Quick start and verification
- **`planning/`** - Infrastructure roadmap
- **`AI-AGENT-GUIDE.md`** - Comprehensive AI agent reference

#### `docs/k8s/` - **Kubernetes Implementation Guide** (NEW)
Complete Kubernetes infrastructure documentation with AI metadata:
- **`00-index.md`** - Navigation hub with implementation checklist
- **`architecture/`** - Multi-tenant design, network topology
- **`infrastructure/`** - Cluster setup, operators, storage
- **`deployments/`** - Service configurations, scaling policies
- **`observability/`** - Monitoring, logging, tracing setup
- **`security/`** - RBAC, NetworkPolicies, secrets management
- **`operations/`** - Runbooks, troubleshooting, maintenance
- **`ai-metadata.yml`** - Structured metadata for AI parsing

**Key Features for AI Agents:**
- ✅ Frontmatter metadata on every file (intent, complexity, dependencies)
- ✅ Token-optimized content (concise, scannable)
- ✅ Cross-reference mapping (file relationships)
- ✅ Implementation status tracking
- ✅ Command examples with expected outputs
- ✅ Validation criteria per section

See [`docs/k8s/00-index.md`](./docs/k8s/00-index.md) for complete Kubernetes documentation.

### GitHub Actions Workflows

GitHub Actions workflows are currently **disabled** (renamed to `.yml.disabled`) for local development focus:

- `ci.yml.disabled` - Continuous Integration checks
- `docs-validation.yml.disabled` - Documentation TOC validation
- `docs-audit.yml.disabled` - Weekly documentation audit
- `docs.yml.disabled` - VitePress documentation deployment
- `test-stacks.yml.disabled` - Docker stack testing

**Re-enabling Workflows**: Remove the `.disabled` extension to activate:
```bash
cd .github/workflows
mv ci.yml.disabled ci.yml
mv docs-validation.yml.disabled docs-validation.yml
```

Workflows can be tested on feature branches before enabling in main.

### Online Documentation

- **[Kubernetes Guide](./docs/k8s/00-index.md)** - AI-optimized K8s implementation guide
- **[Architecture Overview](./docs/k8s/architecture/01-multi-tenant-design.md)** - Multi-tenant patterns
- **[Deployment Workflows](./docs/k8s/deployments/01-helm-deployments.md)** - GitOps with ArgoCD
- **[Monitoring Stack](./docs/k8s/observability/01-prometheus-grafana.md)** - Metrics & dashboards
- **[Operations Runbooks](./docs/k8s/operations/01-cluster-management.md)** - Day-2 operations
- **[VitePress Docs](https://deanluus22021994.github.io/react-scuba/)** - Complete platform documentation

## 🏗️ Architecture

### Multi-Tenant Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Nginx Ingress Controller                 │
│              (tenant routing via subdomain/domain)           │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼─────┐
│  Tenant 1  │  │  Tenant 2  │  │  Tenant N  │
│  (DI Auth) │  │  (Ocean)   │  │  (New)     │
└──────┬─────┘  └──────┬─────┘  └──────┬─────┘
       │               │               │
       └───────────────┼───────────────┘
                       │
       ┌───────────────┴───────────────┐
       │     Shared Infrastructure     │
       ├───────────────────────────────┤
       │ PostgreSQL 17 (Zalando Op)    │
       │ MariaDB 11 (Galera Cluster)   │
       │ Redis (Sentinel HA)           │
       │ Memcached (3 nodes)           │
       │ MinIO (S3-compatible)         │
       └───────────────────────────────┘
```

### Service Mesh (Linkerd)

- **mTLS**: Automatic encryption between services
- **Traffic Shaping**: Retry budgets, timeouts, circuit breakers
- **Observability**: Golden metrics per tenant
- **Zero-config**: Auto-injection via namespace annotation

### Monitoring Stack

- **Prometheus**: Multi-tenant metrics with relabeling
- **Grafana**: Per-tenant dashboards
- **Jaeger**: Distributed tracing
- **Fluent Bit**: Log aggregation with tenant filtering

## 🔐 Security

- **Network Policies**: Zero-trust tenant isolation
- **RBAC**: Least-privilege ServiceAccounts
- **Sealed Secrets**: Encrypted credentials in Git
- **Pod Security**: Non-root, read-only filesystem
- **TLS**: Automated cert-manager with Let's Encrypt

## 📞 Support

Email: <info@mauritius-scuba.com>
Phone: +230 XXXX XXXX
