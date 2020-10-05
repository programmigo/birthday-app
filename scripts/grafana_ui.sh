#!/bin/bash

password=$(kubectl get secret --namespace grafana grafana -o jsonpath="{.data.admin-password}" | base64 --decode)
export POD_NAME=$(kubectl get pods --namespace grafana -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana" -o jsonpath="{.items[0].metadata.name}")
echo "Conntect on http://localhost:3000 in your browser and type credentials username=admin, password=$password"
kubectl --namespace grafana port-forward $POD_NAME 3000
