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
                // Copy file to remote server 
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
                
                // Execute commands
                echo 'Execute commands'
                sshPublisher(
                    failOnError: true,
                    continueOnError: false,
                    publishers: [
                        sshPublisherDesc(
                            configName: 'staging',
                            transfers: [
                                sshTransfer(
                                    execCommand: 'if systemctl --all --type service | grep -q "train-schedule";then sudo /usr/bin/systemctl stop train-schedule; fi && sudo rm -rf /opt/train-schedule/* && sudo unzip /tmp/trainSchedule.zip -d /opt/train-schedule && sudo /usr/bin/systemctl start train-schedule'
                                )
                            ]
                        )
                    ]
                )
                
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
                
                // Execute commands
                echo 'Execute commands'
                sshPublisher(
                    failOnError: true,
                    continueOnError: false,
                    publishers: [
                        sshPublisherDesc(
                            configName: 'staging',
                            transfers: [
                                sshTransfer(
                                    execCommand: 'if systemctl --all --type service | grep -q "train-schedule";then sudo /usr/bin/systemctl stop train-schedule; fi && sudo rm -rf /opt/train-schedule/* && sudo unzip /tmp/trainSchedule.zip -d /opt/train-schedule && sudo /usr/bin/systemctl start train-schedule'
                                )
                            ]
                        )
                    ]
                )
                
            }
        }
        
    }
}
