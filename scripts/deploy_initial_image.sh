#!/bin/bash

set -e

git_root_dir=`git rev-parse --show-toplevel`
unameOut="$(uname -s)"
case "${unameOut}" in
    Darwin*)    sed -i '' "s+DOCKER_IMAGE_PATH+eu.gcr.io/${TF_VAR_project_id}/birthday-app:0+" $git_root_dir/kube-manifests/app.yml;;
    *)          sed -i "s+DOCKER_IMAGE_PATH+eu.gcr.io/${TF_VAR_project_id}/birthday-app:0+" $git_root_dir/kube-manifests/app.yml
esac
kubectl apply -f $git_root_dir/kube-manifests/app.yml
git restore $git_root_dir/kube-manifests/app.yml
