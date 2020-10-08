#!/bin/bash

set -e

git_root_dir=`git rev-parse --show-toplevel`

# Apply terraform scripts
cd $git_root_dir/terraform
terraform init
terraform apply -auto-approve

# Setup docker registry and push initial build image
gcloud auth configure-docker eu.gcr.io
cd $git_root_dir/app
docker build -t eu.gcr.io/${TF_VAR_project_id}/birthday-app:0 .
docker push eu.gcr.io/${TF_VAR_project_id}/birthday-app:0

# Apply kube manifests and setup firebase secret
cd $git_root_dir
gcloud container clusters get-credentials ${TF_VAR_project_id}-gke --region $TF_VAR_region --project $TF_VAR_project_id
kubectl create secret generic firebase-access-key --from-file $firestore_credentials_path
rm $firestore_credentials_path
$git_root_dir/scripts/deploy_initial_image.sh

# Install jenkins, prometheus, grafana using helm
cd $git_root_dir
kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin \
        --user=$(gcloud config get-value account)

helm repo add jenkins https://charts.jenkins.io
helm repo add prometheus https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts

helm install --namespace jenkins --create-namespace cd-jenkins jenkins/jenkins -f helm-values/jenkins.yml
helm install --namespace prometheus --create-namespace prometheus prometheus/prometheus
helm install --namespace grafana --create-namespace grafana grafana/grafana -f helm-values/grafana.yml

kubectl create clusterrolebinding jenkins-deploy \
    --clusterrole=cluster-admin --serviceaccount=jenkins:cd-jenkins
