pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        APP_NAME = 'blogify'
        PORT = '3000'
        LOG_DIR = '/var/log/jenkins-apps'
        PID_FILE = "/tmp/${APP_NAME}.pid"
    }

    tools {
        nodejs "${NODE_VERSION}"
    }

    stages {
        stage('Checkout') {
      steps {
        checkout scm
      }
        }

        stage('Install Dependencies') {
      steps {
        script {
          sh '''
                        echo "Installing Node.js dependencies..."
                        npm install --production
                    '''
        }
      }
        }

        stage('Stop Previous Instance') {
      steps {
        script {
          sh '''
                        echo "Stopping previous instance if running..."
                        if [ -f ${PID_FILE} ]; then
                            PID=$(cat ${PID_FILE})
                            if ps -p $PID > /dev/null 2>&1; then
                                echo "Killing process with PID: $PID"
                                kill -TERM $PID
                                sleep 5
                                # Force kill if still running
                                if ps -p $PID > /dev/null 2>&1; then
                                    kill -KILL $PID
                                fi
                            fi
                            rm -f ${PID_FILE}
                        fi

                        # Kill any process running on the app port
                        pkill -f "node.*${PORT}" || true
                        sleep 2
                    '''
        }
      }
        }

        stage('Create Log Directory') {
      steps {
        script {
          sh '''
                        echo "Creating log directory..."
                        sudo mkdir -p ${LOG_DIR}
                        sudo chown jenkins:jenkins ${LOG_DIR}
                        sudo chmod 755 ${LOG_DIR}
                    '''
        }
      }
        }

        stage('Deploy Application') {
      steps {
        sh '''
            # Stop existing PM2 process
            pm2 stop blogify || true
            pm2 delete blogify || true

            # Start with PM2
            pm2 start ecosystem.config.js
            pm2 save

            # Verify it's running
            pm2 status
        '''
      }
        }
    }

    post {
        success {
      echo 'Deployment completed successfully!'
      script {
        sh '''
                    echo "Application Status:"
                    echo "PID: $(cat ${PID_FILE})"
                    echo "Port: ${APP_PORT}"
                    echo "Log file: ${LOG_DIR}/${APP_NAME}.log"
                    echo "Recent logs:"
                    tail -20 ${LOG_DIR}/${APP_NAME}.log
                '''
      }
        }

        failure {
      echo 'Deployment failed!'
      script {
        sh '''
                    echo "Checking logs for errors..."
                    if [ -f ${LOG_DIR}/${APP_NAME}.log ]; then
                        echo "Application logs:"
                        tail -50 ${LOG_DIR}/${APP_NAME}.log
                    fi
                '''
      }
        }

        always {
      // Archive logs
      archiveArtifacts artifacts: 'logs/*.log', allowEmptyArchive: true
        }
    }
}
