# ==============================================================================
# Linkerd Service Mesh Installation Instructions
# ==============================================================================
# Install Linkerd control plane and extensions via CLI

# Prerequisites
# 1. Install linkerd CLI: curl -sL https://run.linkerd.io/install | sh
# 2. Add to PATH: export PATH=$PATH:$HOME/.linkerd2/bin

# Pre-installation checks
linkerd check --pre

# Install Linkerd CRDs
linkerd install --crds | kubectl apply -f -

# Install Linkerd control plane
linkerd install \
  --identity-trust-anchors-file <path-to-ca.crt> \
  --identity-trust-domain cluster.local \
  --set proxyInit.runAsRoot=true \
  | kubectl apply -f -

# Verify installation
linkerd check

# Install Linkerd Viz extension (dashboard + metrics)
linkerd viz install | kubectl apply -f -
linkerd viz check

# Install Linkerd Jaeger extension (distributed tracing)
linkerd jaeger install | kubectl apply -f -
linkerd jaeger check

# Access Linkerd dashboard
linkerd viz dashboard

# Inject Linkerd proxy into existing deployments
kubectl get deploy -n apps -o yaml | linkerd inject - | kubectl apply -f -

# Verify proxy injection
linkerd -n apps check --proxy
