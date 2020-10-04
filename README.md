# Install gcloud cli, helm and login
gcloud docs: https://cloud.google.com/sdk/docs/install
helm docs: https://helm.sh/docs/intro/install/

```shell
gcloud components install beta
gcloud auth login
```


# Create project, service accounts and keys

```shell
gcloud beta billing accounts list
```

```shell
export TF_VAR_billing_account=YOUR_BILLING_ACCOUNT_ID
export TF_VAR_project_id=birthday-app-`openssl rand -hex 4`
export TF_VAR_project_name=birthday-app
export TF_VAR_region=europe-west3
export TF_VAR_tf_credentials_path=~/.config/gcloud/terraform.json
export firestore_credentials_path=~/.config/gcloud/firestore.json

./setup_project.sh
```


# Run terraform script

```shell
cd terraform
terraform init
terraform apply -auto-approve
```


# Build and push docker image

```shell
gcloud auth configure-docker eu.gcr.io
cd app
docker build -t eu.gcr.io/${TF_VAR_project_id}/birthday-app:v1 .
docker push eu.gcr.io/${TF_VAR_project_id}/birthday-app:v1
```


# Apply kube manifests

```shell
gcloud container clusters get-credentials ${TF_VAR_project_id}-gke --region $TF_VAR_region --project $TF_VAR_project_id
kubectl create secret generic firebase-access-key --from-file ~/.config/gcloud/firestore.json
kubectl apply -f kube-manifests/app.yaml
```

# Install jenkins

```shell
kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin \
        --user=$(gcloud config get-value account)
helm install --namespace jenkins --create-namespace cd-jenkins jenkins/jenkins -f helm-values/jenkins.yml
kubectl create clusterrolebinding jenkins-deploy \
    --clusterrole=cluster-admin --serviceaccount=default:cd-jenkins
```

## Access to Jenkins UI

```shell
printf $(kubectl get secret --namespace default cd-jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 --decode);echo # $password
export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/component=jenkins-master" -l "app.kubernetes.io/instance=cd-jenkins" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace jenkins port-forward $POD_NAME 8080:8080
```

Go to http://127.0.0.1:8080 and login using admin : $password


# Install Prometheus & Grafana for metrics

```shell
helm repo add prometheus https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm install --namespace prometheus --create-namespace prometheus prometheus/prometheus
helm install --namespace grafana --create-namespace grafana grafana/grafana -f helm-values/grafana.yml
```


## Access grafana UI

```shell
kubectl get secret --namespace grafana grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo # $password
export POD_NAME=$(kubectl get pods --namespace grafana -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace grafana port-forward $POD_NAME 3000
```

Go to http://127.0.0.1:3000 and login using admin : $password


# Destroy resources

```shell
terraform destroy -auto-approve
gcloud projects delete $TF_VAR_project_id
```
