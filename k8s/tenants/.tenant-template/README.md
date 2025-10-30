# Tenant Template README

## Instructions for onboarding new tenants to the React Scuba platform

## Quick Start

1. **Copy Template**:
   ```bash
   cp -r .tenant-template ../my-client-name
   cd ../my-client-name
   ```

2. **Replace Placeholders**:
   Find and replace these values throughout all files:
   - `${TENANT_ID}` → Lowercase identifier (e.g., `ocean-spirit-mauritius`)
   - `${TENANT_NAME}` → Display name (e.g., `Ocean Spirit Mauritius`)
   - `${TENANT_DOMAIN}` → Domain (e.g., `oceanspirit.com`)
   - `${DB_NAME}` → Database name (e.g., `ocean_spirit_mauritius_db`)
   - `${DB_USER}` → Database user (e.g., `ocean_spirit_mauritius_user`)

3. **Generate Sealed Secrets**:
   ```bash
   # Create database credentials secret
   kubectl create secret generic db-credentials \
     --namespace=apps \
     --from-literal=username=${DB_USER} \
     --from-literal=password=$(openssl rand -base64 32) \
     --dry-run=client -o yaml | \
     kubeseal -o yaml > sealedsecret-db.yaml

   # Create GitHub token secret (if needed)
   kubectl create secret generic github-token \
     --namespace=apps \
     --from-literal=token=ghp_your_token_here \
     --dry-run=client -o yaml | \
     kubeseal -o yaml > sealedsecret-github.yaml
   ```

4. **Update Database Operator**:
   Add tenant database to `k8s/base/databases/postgres-cluster.yaml`:
   ```yaml
   databases:
     ${DB_NAME}: ${DB_USER}
   users:
     ${DB_USER}:
       - login
   ```

5. **Commit and Push**:
   ```bash
   git add ../my-client-name
   git commit -m "Add tenant: my-client-name"
   git push
   ```

6. **Verify Deployment**:
   ArgoCD will automatically detect and deploy the new tenant.
   ```bash
   # Check ArgoCD application
   argocd app get my-client-name

   # Check pod status
   kubectl get pods -n apps -l tenant=my-client-name

   # Test endpoint
   curl -H "Host: my-client-name.localhost" http://localhost
   ```

## File Structure

```
.tenant-template/
├── README.md                    # This file
├── kustomization.yaml           # Kustomize configuration
├── configmap-api.yaml           # API configuration
├── configmap-web.yaml           # Web configuration
├── ingress.yaml                 # Routing configuration
├── namespace.yaml               # Optional: separate namespace
└── sealedsecret-template.yaml   # Secret template (generate actual)
```

## Configuration Options

### API ConfigMap
- `tenant-id`: Unique identifier
- `db-name`: PostgreSQL database name
- `enable-analytics`: Enable analytics (true/false)
- `enable-caching`: Enable Redis caching (true/false)

### Web ConfigMap
- `tenant-name`: Display name
- `theme`: UI theme (light/dark)
- `language`: Default language (en/fr/es)

### Ingress
- `host`: Domain routing (e.g., client.example.com)
- `tls`: TLS certificate (via cert-manager)

## Troubleshooting

### Pod not starting
```bash
kubectl describe pod -n apps -l tenant=${TENANT_ID}
kubectl logs -n apps -l tenant=${TENANT_ID}
```

### Database connection issues
```bash
kubectl exec -n databases react-scuba-postgres-0 -- \
  psql -U postgres -c "\l" | grep ${DB_NAME}
```

### Ingress not routing
```bash
kubectl get ingress -n apps ${TENANT_ID}-ingress
kubectl describe ingress -n apps ${TENANT_ID}-ingress
```

## Support

For issues or questions, see:
- Platform documentation: `k8s/charts/react-scuba/README.md`
- ArgoCD dashboard: <http://localhost:8080>
- Grafana monitoring: <http://localhost:3000>
