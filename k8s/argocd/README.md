# React Scuba Kubernetes - ArgoCD GitOps Automation

## Overview

ArgoCD enables automated tenant onboarding through GitOps workflows. When a new tenant directory is created in `k8s/tenants/`, ArgoCD automatically deploys the application.

## Architecture

```
k8s/argocd/
├── applicationset-tenants.yaml    # Automated tenant discovery
├── app-of-apps.yaml               # Infrastructure management
└── README.md                      # This file
```

## Automated Tenant Onboarding

### Step 1: Create Tenant Directory

```bash
# Copy template
cp -r k8s/tenants/.tenant-template k8s/tenants/my-new-client

# Update placeholders
cd k8s/tenants/my-new-client
sed -i 's/${TENANT_ID}/my-new-client/g' *.yaml
sed -i 's/${TENANT_NAME}/My New Client/g' *.yaml
sed -i 's/${TENANT_DOMAIN}/mynewclient.com/g' *.yaml
```

### Step 2: Generate Helm Values

```bash
# Auto-generate from server/clients/my-new-client/config.json
./k8s/scripts/generate-tenant-values.sh my-new-client
```

### Step 3: Commit and Push

```bash
git add k8s/tenants/my-new-client
git commit -m "Add tenant: my-new-client"
git push
```

### Step 4: Automatic Deployment

ArgoCD detects the new directory and:
1. Creates ArgoCD Application `my-new-client`
2. Deploys Helm chart with tenant-specific values
3. Syncs resources to `apps` namespace with `tenant=my-new-client` label

## Manual Deployment

If ArgoCD is not installed, deploy manually:

```bash
# Install tenant via Helm
helm install my-new-client k8s/charts/react-scuba \
  --namespace apps \
  --create-namespace \
  --values k8s/tenants/my-new-client/values.yaml
```

## ApplicationSet Configuration

The ApplicationSet uses a **Git Directory Generator**:

```yaml
generators:
  - git:
      directories:
        - path: k8s/tenants/*
        - path: k8s/tenants/_template
          exclude: true
```

**Key Features**:
- **Auto-discovery**: Scans `k8s/tenants/` every 3 minutes (default)
- **Exclusions**: Ignores `_template` directory
- **Tenant label**: Automatically applies `tenant={{path.basename}}`
- **Self-healing**: Auto-corrects drift from Git source

## Sync Policies

### Automated Sync

All applications use automated sync with:
- **Prune**: Remove resources deleted from Git (except databases)
- **Self-heal**: Correct manual changes back to Git state
- **Retry**: Exponential backoff (5s → 3m, 5 attempts)

### Manual Sync

Force sync via ArgoCD UI or CLI:

```bash
# Sync specific tenant
argocd app sync my-new-client

# Sync all tenants
argocd app sync -l app.kubernetes.io/part-of=react-scuba

# View sync status
argocd app list
```

## Health Checks

ArgoCD monitors:
- **Deployment**: Replicas ready
- **Service**: Endpoints available
- **Ingress**: Rules configured
- **HPA**: Scaling metrics

**Ignore Differences**:
- `/spec/replicas` - HPA controls replica count

## Rollback

Rollback to previous Git commit:

```bash
# Via CLI
argocd app rollback my-new-client <history-id>

# Via Git
git revert <commit-hash>
git push
# ArgoCD auto-syncs to reverted state
```

## Monitoring

View deployment status:

```bash
# ArgoCD dashboard
kubectl port-forward -n argocd svc/argocd-server 8080:443
# Open: https://localhost:8080

# CLI status
argocd app get my-new-client
argocd app logs my-new-client

# Kubernetes events
kubectl get events -n apps --field-selector involvedObject.name=my-new-client-api
```

## Troubleshooting

### ApplicationSet not generating apps

```bash
# Check ApplicationSet status
kubectl get applicationset -n argocd
kubectl describe applicationset react-scuba-tenants -n argocd

# Force refresh
kubectl delete applicationset react-scuba-tenants -n argocd
kubectl apply -f k8s/argocd/applicationset-tenants.yaml
```

### Sync failures

```bash
# View sync errors
argocd app get my-new-client
argocd app sync my-new-client --dry-run

# Check resource errors
kubectl get events -n apps
kubectl logs -n apps -l tenant=my-new-client
```

### Tenant not accessible

```bash
# Check ingress
kubectl get ingress -n apps my-new-client-ingress
kubectl describe ingress -n apps my-new-client-ingress

# Check pods
kubectl get pods -n apps -l tenant=my-new-client
kubectl logs -n apps -l tenant=my-new-client --tail=50
```

## Security

**Repository Credentials**:
- Stored in ArgoCD `argocd-repo-server` secret
- Configure via ArgoCD UI: Settings → Repositories

**Sealed Secrets**:
- Encrypted with kubeseal before committing
- Decrypted by sealed-secrets controller at runtime

**RBAC**:
- ArgoCD uses ServiceAccount `argocd-application-controller`
- Requires cluster-admin for multi-namespace management

## References

- ArgoCD Documentation: <https://argo-cd.readthedocs.io/>
- ApplicationSets: <https://argocd-applicationset.readthedocs.io/>
- Helm Chart: `k8s/charts/react-scuba/README.md`
- Tenant Template: `k8s/tenants/.tenant-template/README.md`
