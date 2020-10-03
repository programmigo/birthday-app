#!/bin/bash

# Create project
gcloud projects create $TF_VAR_project_id --name "$TF_VAR_project_name"
gcloud beta billing projects link $TF_VAR_project_id \
  --billing-account $TF_VAR_billing_account
gcloud config set project $TF_VAR_project_id

# Create terraform service account
gcloud iam service-accounts create terraform \
  --display-name "Terraform service account"
gcloud projects add-iam-policy-binding ${TF_VAR_project_id} \
  --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com \
  --role roles/owner
gcloud iam service-accounts keys create $TF_VAR_tf_credentials_path \
  --iam-account terraform@${TF_VAR_project_id}.iam.gserviceaccount.com

# Create firestore credentials for GKE
gcloud iam service-accounts create firestore-user \
  --display-name "Firestore access service account"
gcloud projects add-iam-policy-binding ${TF_VAR_project_id} \
  --member serviceAccount:firestore-user@${TF_VAR_project_id}.iam.gserviceaccount.com \
  --role roles/iam.serviceAccountUser
gcloud projects add-iam-policy-binding ${TF_VAR_project_id} \
  --member serviceAccount:firestore-user@${TF_VAR_project_id}.iam.gserviceaccount.com \
  --role roles/datastore.user
gcloud iam service-accounts keys create $firestore_credentials_path \
  --iam-account firestore-user@${TF_VAR_project_id}.iam.gserviceaccount.com

# Enable necessary APIs
gcloud services enable appengine.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable cloudbuild.googleapis.com
