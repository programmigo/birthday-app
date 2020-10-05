#!/bin/bash

password=$(kubectl get secret --namespace jenkins cd-jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 --decode)
export POD_NAME=$(kubectl get pods --namespace jenkins -l "app.kubernetes.io/component=jenkins-master" -l "app.kubernetes.io/instance=cd-jenkins" -o jsonpath="{.items[0].metadata.name}")
echo "Conntect on http://localhost:8080 in your browser and type credentials username=admin, password=$password"
kubectl --namespace jenkins port-forward $POD_NAME 8080:8080
