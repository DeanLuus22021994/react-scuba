# Zalando Postgres Operator Installation Instructions

## Install Postgres Operator via Helm

## Add Helm repository

```bash
helm repo add postgres-operator-charts <https://opensource.zalando.com/postgres-operator/charts/postgres-operator>
helm repo update
```

## Install operator

```bash
helm install postgres-operator postgres-operator-charts/postgres-operator \
  --namespace postgres-operator \
  --create-namespace \
  --set configKubernetes.enable_pod_antiaffinity=true \
  --set configKubernetes.pod_management_policy=ordered_ready \
  --set configGeneral.docker_image=registry.opensource.zalan.do/acid/spilo-16:3.1-p1
```

## Verify installation

```bash
kubectl get pods -n postgres-operator
kubectl logs -n postgres-operator deployment/postgres-operator
```

## Install UI (optional)

```bash
helm install postgres-operator-ui postgres-operator-charts/postgres-operator-ui \
  --namespace postgres-operator \
  --set envs.appUrl="<http://localhost:8081>"
```

## Access UI (port-forward)

```bash
kubectl port-forward -n postgres-operator svc/postgres-operator-ui 8081:80
```

## Apply PostgreSQL cluster CR

```bash
kubectl apply -f ../../base/databases/postgres-cluster.yaml
```

## Verify cluster creation

```bash
kubectl get postgresql -n databases
kubectl get pods -n databases -l application=react-scuba-postgres
```

## Check cluster status

```bash
kubectl describe postgresql react-scuba-postgres -n databases
```
