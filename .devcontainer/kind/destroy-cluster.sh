#!/usr/bin/env bash
# ==============================================================================
# kind Cluster Teardown Script
# ==============================================================================
# Safely destroys kind cluster and local registry
# Usage: bash destroy-cluster.sh

set -euo pipefail

CLUSTER_NAME="react-scuba"
REGISTRY_NAME="kind-registry"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Confirm destruction
confirm_destroy() {
    echo "========================================"
    echo "Cluster Destruction Confirmation"
    echo "========================================"
    echo
    echo "This will destroy:"
    echo "  - kind cluster: ${CLUSTER_NAME}"
    echo "  - All pods, deployments, and data"
    echo "  - Local registry: ${REGISTRY_NAME}"
    echo
    read -p "Are you sure you want to continue? (yes/NO) " -r
    echo
    if [[ ! $REPLY =~ ^yes$ ]]; then
        log_info "Destruction cancelled"
        exit 0
    fi
}

# Delete kind cluster
delete_cluster() {
    log_info "Deleting kind cluster '${CLUSTER_NAME}'..."
    
    if kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
        kind delete cluster --name "${CLUSTER_NAME}"
        log_success "Cluster '${CLUSTER_NAME}' deleted"
    else
        log_info "Cluster '${CLUSTER_NAME}' not found, skipping"
    fi
}

# Stop and remove local registry
delete_registry() {
    log_info "Removing local Docker registry..."
    
    if docker ps -a | grep -q "${REGISTRY_NAME}"; then
        docker stop "${REGISTRY_NAME}" 2>/dev/null || true
        docker rm "${REGISTRY_NAME}" 2>/dev/null || true
        log_success "Registry '${REGISTRY_NAME}' removed"
    else
        log_info "Registry '${REGISTRY_NAME}' not found, skipping"
    fi
}

# Main execution
main() {
    confirm_destroy
    delete_cluster
    delete_registry
    
    echo
    log_success "==============================================="
    log_success "Cluster teardown complete!"
    log_success "==============================================="
}

main "$@"
