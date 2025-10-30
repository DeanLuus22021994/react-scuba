#!/usr/bin/env bash
# ==============================================================================
# Generate Tenant Values Files from server/clients/ Directory
# ==============================================================================
# Usage: ./generate-tenant-values.sh [tenant-id]
#        If tenant-id is omitted, generates for all tenants

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
CLIENTS_DIR="${ROOT_DIR}/server/clients"
TENANTS_DIR="${ROOT_DIR}/k8s/tenants"
CHART_DIR="${ROOT_DIR}/k8s/charts/react-scuba"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  log_warn "jq is not installed. Please install jq to generate tenant values."
  exit 1
fi

# Generate values for a single tenant
generate_tenant_values() {
  local tenant_id="$1"
  local config_file="${CLIENTS_DIR}/${tenant_id}/config.json"

  if [[ ! -f "${config_file}" ]]; then
    log_warn "Config file not found: ${config_file}"
    return 1
  fi

  log_info "Generating values for tenant: ${tenant_id}"

  # Parse config.json
  local tenant_name=$(jq -r '.name // "Unknown"' "${config_file}")
  local domain=$(jq -r '.domain // "localhost"' "${config_file}")
  local subdomain=$(jq -r '.subdomain // "app"' "${config_file}")
  local full_domain="${subdomain}.${domain}"

  # Database name (sanitized)
  local db_name=$(echo "${tenant_id}" | tr '-' '_')_db
  local db_user=$(echo "${tenant_id}" | tr '-' '_')_user

  # Extract theme colors
  local primary_color=$(jq -r '.theme.colors.primary // "#0066cc"' "${config_file}")
  local theme=$(jq -r '.theme.mode // "light"' "${config_file}")

  # Extract feature flags
  local enable_booking=$(jq -r '.features.booking // true' "${config_file}")
  local enable_courses=$(jq -r '.features.courses // true' "${config_file}")

  # Generate values.yaml
  cat > "${TENANTS_DIR}/${tenant_id}/values.yaml" <<EOF
# ==============================================================================
# Tenant Values: ${tenant_name}
# ==============================================================================
# Generated from server/clients/${tenant_id}/config.json

global:
  tenantId: "${tenant_id}"
  tenantName: "${tenant_name}"
  domain: "${full_domain}"

database:
  name: "${db_name}"
  user: "${db_user}"
  secretName: "${tenant_id}-db-credentials"

web:
  env:
    theme: "${theme}"
    primaryColor: "${primary_color}"

api:
  env:
    enableBooking: ${enable_booking}
    enableCourses: ${enable_courses}

ingress:
  hosts:
    - host: ${full_domain}
      paths:
        - path: /api
          pathType: Prefix
          service: api
        - path: /
          pathType: Prefix
          service: web

  tls:
    - secretName: ${tenant_id}-tls
      hosts:
        - ${full_domain}
EOF

  log_success "Generated values.yaml for ${tenant_id}"
}

# Main logic
if [[ $# -eq 1 ]]; then
  # Generate for specific tenant
  generate_tenant_values "$1"
else
  # Generate for all tenants
  log_info "Generating values for all tenants..."

  for client_dir in "${CLIENTS_DIR}"/*; do
    if [[ -d "${client_dir}" && ! "$(basename "${client_dir}")" == "_template" ]]; then
      tenant_id="$(basename "${client_dir}")"
      generate_tenant_values "${tenant_id}"
    fi
  done

  log_success "All tenant values generated successfully"
fi
