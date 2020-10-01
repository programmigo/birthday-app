variable "billing_account" {}
variable "project_id" {}
variable "project_name" {}
variable "credentials_path" {}
variable "region" {
  default = "europe-west3"
}
variable "gke_num_nodes" {
  default = 1
}
