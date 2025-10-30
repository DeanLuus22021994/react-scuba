#!/usr/bin/env bash
# ==============================================================================
# kind Cluster Setup Script for React Scuba
# ==============================================================================
# Provisions kind cluster with all required operators and infrastructure
# Usage: bash setup-cluster.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLUSTER_NAME="react-scuba"
REGISTRY_NAME="kind-registry"
REGISTRY_PORT="5001"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    local missing_tools=()

    command -v docker >/dev/null 2>&1 || missing_tools+=("docker")
    command -v kind >/dev/null 2>&1 || missing_tools+=("kind")
    command -v kubectl >/dev/null 2>&1 || missing_tools+=("kubectl")
    command -v helm >/dev/null 2>&1 || missing_tools+=("helm")

    if [ ${#missing_tools[@]} -gt 0 ]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi

    log_success "All prerequisites satisfied"
}

# Create local docker registry
setup_local_registry() {
    log_info "Setting up local Docker registry..."

    if ! docker ps | grep -q "${REGISTRY_NAME}"; then
        docker run -d --restart=always \
            -p "127.0.0.1:${REGISTRY_PORT}:5000" \
            --name "${REGISTRY_NAME}" \
            registry:2
        log_success "Local registry created at localhost:${REGISTRY_PORT}"
    else
        log_warn "Local registry already running"
    fi
}

# Create kind cluster
create_cluster() {
    log_info "Creating kind cluster '${CLUSTER_NAME}'..."

    if kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
        log_warn "Cluster '${CLUSTER_NAME}' already exists"
        read -p "Do you want to delete and recreate? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kind delete cluster --name "${CLUSTER_NAME}"
        else
            return 0
        fi
    fi

    kind create cluster --config="${SCRIPT_DIR}/cluster-config.yaml" --wait=5m

    # Connect registry to kind network
    if ! docker network ls | grep -q "kind"; then
        docker network create kind
    fi
    docker network connect kind "${REGISTRY_NAME}" 2>/dev/null || true

    log_success "Cluster '${CLUSTER_NAME}' created successfully"
}

# Install local-path-provisioner for storage
install_storage_provisioner() {
    log_info "Installing local-path-provisioner..."

    kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.28/deploy/local-path-storage.yaml
    kubectl wait --for=condition=available --timeout=300s \
        deployment/local-path-provisioner -n local-path-storage

    log_success "local-path-provisioner installed"
}

# Install Linkerd service mesh
install_linkerd() {
    log_info "Installing Linkerd..."

    # Check if linkerd CLI is available
    if ! command -v linkerd >/dev/null 2>&1; then
        log_warn "linkerd CLI not found, skipping Linkerd installation"
        return 0
    fi

    # Pre-check
    linkerd check --pre

    # Install CRDs
    linkerd install --crds | kubectl apply -f -

    # Install control plane
    linkerd install | kubectl apply -f -

    # Wait for control plane
    linkerd check

    # Install viz extension
    linkerd viz install | kubectl apply -f -
    linkerd viz check

    log_success "Linkerd installed successfully"
}

# Install Zalando Postgres Operator
install_postgres_operator() {
    log_info "Installing Zalando Postgres Operator..."

    kubectl create namespace postgres-operator 2>/dev/null || true

    helm repo add postgres-operator-charts https://opensource.zalando.com/postgres-operator/charts/postgres-operator
    helm repo update

    helm upgrade --install postgres-operator \
        postgres-operator-charts/postgres-operator \
        --namespace postgres-operator \
        --set configKubernetes.enable_pod_antiaffinity=true \
        --set configKubernetes.pod_service_account_name=postgres-pod \
        --wait --timeout=10m

    log_success "Zalando Postgres Operator installed"
}

# Install sealed-secrets
install_sealed_secrets() {
    log_info "Installing sealed-secrets controller..."

    helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
    helm repo update

    helm upgrade --install sealed-secrets \
        sealed-secrets/sealed-secrets \
        --namespace kube-system \
        --wait --timeout=5m

    log_success "sealed-secrets controller installed"
}

# Install ArgoCD
install_argocd() {
    log_info "Installing ArgoCD..."

    kubectl create namespace argocd 2>/dev/null || true

    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

    kubectl wait --for=condition=available --timeout=600s \
        deployment/argocd-server -n argocd

    # Get initial admin password
    ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret \
        -o jsonpath="{.data.password}" | base64 -d)

    log_success "ArgoCD installed successfully"
    log_info "ArgoCD admin password: ${ARGOCD_PASSWORD}"
    log_info "Access ArgoCD: kubectl port-forward svc/argocd-server -n argocd 8080:443"
}

# Apply base namespaces
create_namespaces() {
    log_info "Creating namespaces..."

    kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: databases
  labels:
    pod-security.kubernetes.io/enforce: baseline
    linkerd.io/inject: disabled
---
apiVersion: v1
kind: Namespace
metadata:
  name: cache
  labels:
    pod-security.kubernetes.io/enforce: baseline
    linkerd.io/inject: enabled
---
apiVersion: v1
kind: Namespace
metadata:
  name: apps
  labels:
    pod-security.kubernetes.io/enforce: restricted
    linkerd.io/inject: enabled
---
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
  labels:
    pod-security.kubernetes.io/enforce: baseline
    linkerd.io/inject: enabled
---
apiVersion: v1
kind: Namespace
metadata:
  name: mcp
  labels:
    pod-security.kubernetes.io/enforce: restricted
    linkerd.io/inject: enabled
EOF

    log_success "Namespaces created"
}

# Main execution
main() {
    echo "========================================"
    echo "React Scuba - kind Cluster Setup"
    echo "========================================"
    echo

    check_prerequisites
    setup_local_registry
    create_cluster
    install_storage_provisioner
    install_linkerd
    install_postgres_operator
    install_sealed_secrets
    install_argocd
    create_namespaces

    echo
    log_success "==============================================="
    log_success "Cluster setup complete!"
    log_success "==============================================="
    echo
    log_info "Next steps:"
    echo "  1. Apply base manifests: kubectl apply -k k8s/base"
    echo "  2. Deploy tenants: kubectl apply -k k8s/tenants/<client>"
    echo "  3. Access Grafana: kubectl port-forward -n monitoring svc/grafana 3000:3000"
    echo "  4. Access ArgoCD: kubectl port-forward -n argocd svc/argocd-server 8080:443"
}

main "$@"
