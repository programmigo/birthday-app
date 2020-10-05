#!/bin/bash

set -e

external_ip=$(kubectl get services birthday-app-service --output jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "http://$external_ip:80"