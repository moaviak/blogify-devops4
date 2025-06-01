pipeline {
    agent any

    environment {
        DEPLOY_DIR = '/home/ubuntu/node-app'
    }

    stages {
        stage('Clone Repo') {
      steps {
        git 'https://github.com/moaviak/blogify-devops4.git'
      }
        }

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
      echo 'App deployed and running on port 8000.'
        }
        failure {
      echo 'Something went wrong during deployment.'
        }
    }
}
