pipeline {
    agent any

    environment {
        DEPLOY_DIR = '/var/lib/jenkins/deployed-app'
    }

    stages {
        stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
        }

        stage('Deploy and Run') {
      steps {
        sh '''
                    mkdir -p $DEPLOY_DIR
                    cp -r * $DEPLOY_DIR/
                    cd $DEPLOY_DIR
                    nohup npm start > output.log 2>&1 &
                '''
      }
        }
    }

    post {
        success {
      echo 'App deployed and running.'
        }
        failure {
      echo 'Something went wrong during deployment.'
        }
    }
}
