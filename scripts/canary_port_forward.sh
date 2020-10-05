#!/bin/bash

set -e

gcloud container clusters get-credentials ${TF_VAR_project_id}-gke --region $TF_VAR_region --project $TF_VAR_project_id \
 && kubectl port-forward $(kubectl get pod --selector="app=birthday-app,track=canary" --output jsonpath='{.items[0].metadata.name}') 9090:8080
