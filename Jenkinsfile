def appName = 'birthday-app'
def projectId = ''
def imageTag = ''

pipeline {
  agent {
    kubernetes {
      label 'birthday-app'
      defaultContainer 'jnlp'
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    component: ci
spec:
  serviceAccountName: cd-jenkins
  containers:
  # TOOD: Add container for test app
  - name: gcloud
    image: gcr.io/cloud-builders/gcloud
    command:
    - cat
    tty: true
"""
    }
  }
  stages {
    stage('Get project variables') {
      steps {
        container('gcloud') {
          script {
            projectId = sh(script: "gcloud config get-value project", returnStdout: true).trim()
            imageTag = "eu.gcr.io/${projectId}/${appName}:${env.BUILD_NUMBER}"
          }
        }
      }
    }

    // TODO: ADD TEST STAGE

    stage('Build and push image to Container Registry using Cloud Build') {
      when {
        branch 'master'
      }
      steps {
        container('gcloud') {
          sh "gcloud builds submit --tag ${imageTag} ./app"
        }
      }
    }

    stage('Deploy Canary') {
      when {
        branch 'master'
      }
      steps {
        container('gcloud') {
          sh "sed -i 's|DOCKER_IMAGE_PATH|'${imageTag}'|g' kube-manifests/app-canary.yml"
          sh "kubectl apply -f kube-manifests/app-canary.yml"
        }
      }
    }

    stage('Deploy Production') {
      when {
        branch 'master'
      }
      steps {
        input 'Deploy to Production?'
        milestone(1)
        container('gcloud') {
          sh "sed -i 's|DOCKER_IMAGE_PATH|'${imageTag}'|g' kube-manifests/app.yml"
          sh "kubectl apply -f kube-manifests/app.yml"
          sh "kubectl delete -f kube-manifests/app-canary.yml"
        }
      }
    }
  }
}