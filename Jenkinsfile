pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Running build automation'
                sh './gradlew build --no-daemon'
                archiveArtifacts artifacts: 'dist/trainSchedule.zip'
            }
        }
        
        stage('DeployToStaging') {
            when {
                branch 'master'
            }
            steps {
                echo 'Copy files'
                sshPublisher(
                    failOnError: true,
                    continueOnError: false,
                    publishers: [
                        sshPublisherDesc(
                            configName: 'staging',
                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'dist/trainSchedule.zip',
                                    removePrefix: 'dist/',
                                    remoteDirectory: '/tmp',
                                )
                            ]
                        )
                    ]
                )
                
                echo 'Running commands'
                sh 'if systemctl --all --type service | grep -q "train-schedule";then echo '' | sudo -S /usr/bin/systemctl stop train-schedule; fi && echo '' | sudo -S rm -rf /opt/train-schedule/* && echo '' | sudo -S unzip /tmp/trainSchedule.zip -d /opt/train-schedule && echo '' | sudo -S /usr/bin/systemctl start train-schedule'
            }
        }
        
        stage('DeployToProduction') {
            when {
                branch 'master'
            }
            steps {
                input 'Does the staging environment look OK?'
                milestone(1)
                echo 'Copy files'
                sshPublisher(
                    failOnError: true,
                    continueOnError: false,
                    publishers: [
                        sshPublisherDesc(
                            configName: 'production',
                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'dist/trainSchedule.zip',
                                    removePrefix: 'dist/',
                                    remoteDirectory: '/tmp',
                                )
                            ]
                        )
                    ]
                )
                
                echo 'Running commands'
                sh 'if systemctl --all --type service | grep -q "train-schedule";then echo '' | sudo -S /usr/bin/systemctl stop train-schedule; fi && echo '' | sudo -S rm -rf /opt/train-schedule/* && echo '' | sudo -S unzip /tmp/trainSchedule.zip -d /opt/train-schedule && echo '' | sudo -S /usr/bin/systemctl start train-schedule'
            }
        }
        
    }
}
