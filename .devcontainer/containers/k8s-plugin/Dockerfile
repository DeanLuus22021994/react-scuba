# Kubernetes Plugin for Docker Compose - Official implementation
# Reference: https://github.com/docker/compose-on-kubernetes
# Provides Kubernetes cluster management and deployment capabilities
#
# OPTIMIZATION: Lightweight Alpine, kubectl, helm, kompose integration

FROM alpine:3.21 AS base

WORKDIR /app

# Install Kubernetes tooling with cache mount
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add --no-cache \
  curl \
  wget \
  ca-certificates \
  tini \
  bash \
  git \
  && rm -rf /tmp/*

# Install kubectl (official Kubernetes CLI)
ARG KUBECTL_VERSION=v1.31.2
RUN --mount=type=cache,target=/tmp/k8s-downloads,sharing=locked \
  [ -f /tmp/k8s-downloads/kubectl ] || \
  (curl -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl" && \
  mv kubectl /tmp/k8s-downloads/kubectl) && \
  cp /tmp/k8s-downloads/kubectl /usr/local/bin/kubectl && \
  chmod +x /usr/local/bin/kubectl

# Install Helm (Kubernetes package manager)
ARG HELM_VERSION=v3.16.2
RUN --mount=type=cache,target=/tmp/helm-downloads,sharing=locked \
  [ -f /tmp/helm-downloads/helm ] || \
  (wget -q https://get.helm.sh/helm-${HELM_VERSION}-linux-amd64.tar.gz -O - | \
  tar -xzO linux-amd64/helm > /tmp/helm-downloads/helm) && \
  cp /tmp/helm-downloads/helm /usr/local/bin/helm && \
  chmod +x /usr/local/bin/helm

# Install Kompose (Docker Compose to Kubernetes converter)
ARG KOMPOSE_VERSION=v1.34.0
RUN --mount=type=cache,target=/tmp/kompose-downloads,sharing=locked \
  [ -f /tmp/kompose-downloads/kompose ] || \
  (curl -L https://github.com/kubernetes/kompose/releases/download/${KOMPOSE_VERSION}/kompose-linux-amd64 \
  -o /tmp/kompose-downloads/kompose) && \
  cp /tmp/kompose-downloads/kompose /usr/local/bin/kompose && \
  chmod +x /usr/local/bin/kompose

# Install K9s (Kubernetes TUI)
ARG K9S_VERSION=v0.32.5
RUN --mount=type=cache,target=/tmp/k9s-downloads,sharing=locked \
  [ -f /tmp/k9s-downloads/k9s ] || \
  (wget -q https://github.com/derailed/k9s/releases/download/${K9S_VERSION}/k9s_Linux_amd64.tar.gz -O - | \
  tar -xzO k9s > /tmp/k9s-downloads/k9s) && \
  cp /tmp/k9s-downloads/k9s /usr/local/bin/k9s && \
  chmod +x /usr/local/bin/k9s

# Create kubeconfig directory
RUN mkdir -p /root/.kube /cache/k8s && \
  chmod 755 /root/.kube /cache/k8s

VOLUME [\"/root/.kube\", \"/cache/k8s\"]

# Environment variables for Kubernetes
ENV KUBECONFIG=/root/.kube/config \
  HELM_CACHE_HOME=/cache/k8s/helm \
  HELM_CONFIG_HOME=/root/.config/helm \
  HELM_DATA_HOME=/root/.local/share/helm

# Health check script
COPY <<'EOF' /app/health.sh
#!/bin/bash
set -e
kubectl version --client --output=json > /dev/null 2>&1 || exit 1
helm version --short > /dev/null 2>&1 || exit 1
kompose version > /dev/null 2>&1 || exit 1
echo "✓ Kubernetes tooling healthy"
exit 0
EOF

RUN chmod +x /app/health.sh

ENTRYPOINT ["/sbin/tini", "--"]

# Install NVIDIA GPU support
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add --no-cache nvidia-container-toolkit || true

# Update health check to include GPU
COPY <<'EOF' /app/health.sh
#!/bin/bash
set -e
kubectl version --client --output=json > /dev/null 2>&1 || exit 1
helm version --short > /dev/null 2>&1 || exit 1
kompose version > /dev/null 2>&1 || exit 1
# GPU health check (only if NVIDIA_VISIBLE_DEVICES is set)
if [ ! -z "$NVIDIA_VISIBLE_DEVICES" ]; then
  nvidia-smi > /dev/null 2>&1 || (echo "❌ GPU not available" && exit 1)
  echo "✅ GPU available: $(nvidia-smi --query-gpu=name --format=csv,noheader,nounits)"
fi
echo "✅ Kubernetes tooling healthy"
exit 0
EOF

RUN chmod +x /app/health.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD /app/health.sh || exit 1

CMD ["kubectl", "cluster-info"]

LABEL k8s.plugin="official" \
  k8s.kubectl.version="${KUBECTL_VERSION}" \
  k8s.helm.version="${HELM_VERSION}" \
  k8s.kompose.version="${KOMPOSE_VERSION}" \
  k8s.k9s.version="${K9S_VERSION}" \
  optimization.cache="enabled" \
  description="Kubernetes plugin for Docker Compose - cluster management and deployment"