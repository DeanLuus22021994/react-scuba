# Docker Deployment

Deploy the SCUBA Bali React application using Docker containers for consistent, scalable, and portable deployments.

## Overview

Docker containerization provides:

- Consistent environments across development, staging, and production
- Easy scaling and orchestration
- Simplified dependency management
- Portability across different hosting platforms

## Prerequisites

- Docker installed locally
- Docker Compose (optional, for multi-container setups)
- Basic understanding of container concepts

## Quick Start

### Single Container Deployment

1. **Create Dockerfile**

```dockerfile
# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 80

# Install serve for static file hosting
RUN npm install -g serve

# Start the application
CMD ["serve", "-s", "dist", "-l", "80"]
```

2. **Build and Run**

```bash
# Build the image
docker build -t scuba-bali .

# Run the container
docker run -p 3000:80 scuba-bali
```

## Multi-Stage Build (Optimized)

For production deployments, use multi-stage builds to reduce image size:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

Create `nginx.conf` for SPA routing:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Handle client routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

## Docker Compose Setup

For more complex deployments with additional services:

```yaml
# docker-compose.yml
version: '3.8'

services:
  scuba-app:
    build: .
    ports:
      - '3000:80'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:80']
      interval: 30s
      timeout: 10s
      retries: 3

  # Optional: Reverse proxy with SSL
  nginx-proxy:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl/certs:ro
    depends_on:
      - scuba-app
    restart: unless-stopped
```

## Environment Variables

### Build-time Variables

```dockerfile
# Set environment variables during build
ARG VITE_GA_MEASUREMENT_ID
ARG VITE_API_BASE_URL
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
```

### Runtime Variables

```bash
# Run with environment variables
docker run -e VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX \
           -e VITE_API_BASE_URL=https://api.scubabali.com \
           -p 3000:80 scuba-bali
```

### Environment File

Create `.env` file for sensitive variables:

```bash
# .env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX
VITE_API_BASE_URL=https://api.scubabali.com
VITE_RECAPTCHA_SITE_KEY=your_site_key
```

Use with docker-compose:

```yaml
services:
  scuba-app:
    build: .
    env_file:
      - .env
```

## Development Setup

### Development Container

For development with hot reloading:

```dockerfile
# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose development port
EXPOSE 3000

# Start development server
CMD ["npm", "start"]
```

### Docker Compose for Development

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  scuba-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    command: npm start
```

## Deployment Strategies

### Cloud Platforms

#### AWS

**ECS (Elastic Container Service):**

```yaml
# task-definition.json
{
  'family': 'scuba-bali',
  'containerDefinitions':
    [
      {
        'name': 'scuba-app',
        'image': 'your-registry/scuba-bali:latest',
        'portMappings': [{ 'containerPort': 80, 'hostPort': 80 }],
        'environment': [{ 'name': 'NODE_ENV', 'value': 'production' }],
        'logConfiguration':
          {
            'logDriver': 'awslogs',
            'options': { 'awslogs-group': '/ecs/scuba-bali', 'awslogs-region': 'us-east-1' },
          },
      },
    ],
}
```

#### Google Cloud Run

```bash
# Deploy to Cloud Run
gcloud run deploy scuba-bali \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

#### Azure Container Instances

```bash
# Deploy to ACI
az container create \
  --resource-group myResourceGroup \
  --name scuba-bali \
  --image your-registry/scuba-bali:latest \
  --ports 80 \
  --dns-name-label scuba-bali \
  --environment-variables NODE_ENV=production
```

### Kubernetes Deployment

For scalable, orchestrated deployments:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: scuba-bali
spec:
  replicas: 3
  selector:
    matchLabels:
      app: scuba-bali
  template:
    metadata:
      labels:
        app: scuba-bali
    spec:
      containers:
        - name: scuba-app
          image: your-registry/scuba-bali:latest
          ports:
            - containerPort: 80
          env:
            - name: NODE_ENV
              value: 'production'
          resources:
            requests:
              memory: '128Mi'
              cpu: '100m'
            limits:
              memory: '256Mi'
              cpu: '200m'
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
```

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: scuba-bali-service
spec:
  selector:
    app: scuba-bali
  ports:
    - port: 80
      targetPort: 80
  type: LoadBalancer
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/docker-deploy.yml
name: Docker Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: your-registry/scuba-bali:latest

      - name: Deploy to production
        run: |
          # Add your deployment commands here
          echo "Deploying to production..."
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t scuba-bali .
    - docker tag scuba-bali registry.gitlab.com/your-project/scuba-bali
    - docker push registry.gitlab.com/your-project/scuba-bali

deploy:
  stage: deploy
  script:
    - echo "Deploying to production..."
  only:
    - main
```

## Security Best Practices

### Non-root User

Run containers as non-root user:

```dockerfile
# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs
```

### Security Scanning

```bash
# Scan for vulnerabilities
docker scan scuba-bali

# Use Snyk for additional scanning
npm install -g snyk
snyk container test scuba-bali
```

### Secrets Management

Never bake secrets into images:

```dockerfile
# ❌ Bad: Hardcoded secrets
ENV API_KEY=hardcoded-secret

# ✅ Good: Use runtime secrets
# Pass secrets via environment variables or secret management systems
```

## Monitoring & Logging

### Health Checks

```dockerfile
# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1
```

### Logging

```dockerfile
# Configure logging
RUN mkdir -p /var/log/app
RUN ln -sf /dev/stdout /var/log/app/access.log
RUN ln -sf /dev/stderr /var/log/app/error.log
```

### Monitoring with Prometheus

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'scuba-bali'
    static_configs:
      - targets: ['localhost:9090']
```

## Troubleshooting

### Common Issues

**Container won't start:**

```bash
# Check container logs
docker logs <container-id>

# Check container status
docker ps -a
```

**Port already in use:**

```bash
# Find process using port
lsof -i :3000

# Kill process or use different port
docker run -p 3001:80 scuba-bali
```

**Build fails:**

```bash
# Build with no cache
docker build --no-cache -t scuba-bali .

# Check build logs
docker build -t scuba-bali . 2>&1 | tee build.log
```

**Memory issues:**

```dockerfile
# Increase memory limit
docker run --memory=1g --memory-swap=1g scuba-bali
```

### Performance Optimization

**Multi-stage builds** reduce image size by up to 80%
**Layer caching** speeds up subsequent builds
**Alpine images** provide smaller base images
**Distroless images** for minimal attack surface

### Networking

**Container networking:**

```bash
# List networks
docker network ls

# Inspect network
docker network inspect bridge

# Create custom network
docker network create scuba-network
```

## Migration from Other Platforms

### From Netlify/Vercel

1. Build Docker image with your existing build process
2. Test locally with `docker run`
3. Deploy to your preferred container platform
4. Update DNS to point to new deployment

### From Traditional Hosting

1. Containerize your application
2. Set up orchestration (Docker Compose/Kubernetes)
3. Configure reverse proxy (nginx/traefik)
4. Implement CI/CD pipeline
5. Set up monitoring and logging
