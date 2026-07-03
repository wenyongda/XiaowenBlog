pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git submodule update --init --recursive'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run clean'
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([gitUsernamePassword(credentialsId: 'github-credentials')]) {
                    sh 'npx hexo deploy'
                }
            }
        }
    }

    post {
        success {
            echo '博客发布成功!'
        }
        failure {
            echo '博客发布失败!'
        }
    }
}
