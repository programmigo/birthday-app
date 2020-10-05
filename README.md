# Install gcloud cli, docker, helm
gcloud docs: https://cloud.google.com/sdk/docs/install
helm docs: https://helm.sh/docs/intro/install/
docker docs: https://docs.docker.com/get-docker/

```shell
gcloud components install beta
gcloud auth login
```


# Create project, service accounts and keys

```shell
gcloud beta billing accounts list
```

Set environments, they are necessary for setup scripts

```shell
export TF_VAR_billing_account=YOUR_BILLING_ACCOUNT_ID
export TF_VAR_project_id=birthday-app-`openssl rand -hex 4`
export TF_VAR_project_name=birthday-app
export TF_VAR_region=europe-west3
export TF_VAR_credentials_path=~/.config/gcloud/terraform.json
export firestore_credentials_path=~/.config/gcloud/firestore.json

scripts/setup_project.sh
scripts/setup_infrastructure.sh
```


# Access App

```shell
scripts/app_external_ip.sh
```


# Access to Jenkins UI

```shell
scripts/jenkins_ui.sh
```

Go to http://127.0.0.1:8080 and login using admin : $password


# Access grafana UI

```shell
scripts/grafana_ui.sh
```

Go to http://127.0.0.1:3000 and login using admin : $password


# Access canary instance during deployment

```shell
scripts/canary_port_forward.sh
```


# Destroy resources

```shell
cd terraform
terraform destroy -auto-approve
rm -r .terraform terraform.tfstate*
gcloud projects delete $TF_VAR_project_id
rm $TF_VAR_credentials_path
rm ~/.kube/config
```
