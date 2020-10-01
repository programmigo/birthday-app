# Install gcloud cli and login
docs: https://cloud.google.com/sdk/docs/install

gcloud components install beta
gcloud auth login

# Connect terraform

gcloud beta billing accounts list

export TF_VAR_billing_account=YOUR_BILLING_ACCOUNT_ID
export TF_VAR_project_id=birthday-app-`openssl rand -hex 4`
export TF_VAR_project_name=birthday-app
export TF_VAR_credentials_path=~/.config/gcloud/birthday-app.json

gcloud projects create $TF_VAR_project_id --name "$TF_VAR_project_name"
gcloud beta billing projects link $TF_VAR_project_id \
  --billing-account $TF_VAR_billing_account
gcloud config set project $TF_VAR_project_id
gcloud iam service-accounts create terraform \
  --display-name "Terraform service account"
gcloud projects add-iam-policy-binding ${TF_VAR_project_id} \
  --member serviceAccount:terraform@${TF_VAR_project_id}.iam.gserviceaccount.com \
  --role roles/owner
gcloud iam service-accounts keys create $TF_VAR_credentials_path \
  --iam-account terraform@${TF_VAR_project_id}.iam.gserviceaccount.com

gcloud services enable appengine.googleapis.com
gcloud services enable firestore.googleapis.com


# Run terraform script

cd terraform
terraform init
terraform apply -auto-approve


# Build and push docker image // TODO: Maybe ansible?

gcloud auth configure-docker eu.gcr.io
cd app
docker build -t eu.gcr.io/birthday-app/birthday-app:v1 .
docker push eu.gcr.io/birthday-app/birthday-app:v1

# Apply kube manifests // TODO: Maybe ansible?

gcloud container clusters get-credentials ${TF_VAR_project_id}-gke --region europe-west3 --project $TF_VAR_project_id
kubectl apply -f kube-manifests/app-deployment.yaml
kubectl apply -f kube-manifests/app-service.yaml


# Destroy resources

terraform destroy -auto-approve
gcloud projects delete $TF_VAR_project_id
