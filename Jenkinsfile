pipeline {
  agent {
    node {
      label 'node-label'
    }

  }
  stages {
    stage('quality') {
      steps {
        sh 'npm t'
      }
    }

  }
}