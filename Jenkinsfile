#!groovy

properties(
  [[$class: 'GithubProjectProperty', projectUrlStr: 'https://github.com/hmcts/probate-frontend.git'],
  parameters([ 
    string(description: 'Store RPM variable for branches than master or develop (other than "no" stores rpm)', defaultValue: 'no', name: 'store_rpm'),    
    string(description: 'Store docker from Branches other than master (other than "no" create docker)', defaultValue: 'no', name: 'create_docker'),
    string(description: 'Run test (other than "no" run test)', defaultValue: 'yes', name: 'run_test'),
    string(description: 'Run end to end test (other than "no" run e2e test)', defaultValue: 'no', name: 'run_e2e_test')
   ]),
   pipelineTriggers([[$class: 'GitHubPushTrigger']])]
)

//@Library(['Reform', 'PROBATE'])
@Library('Reform')
import uk.gov.hmcts.Packager
import uk.gov.hmcts.Ansible
import uk.gov.hmcts.RPMTagger

def packager = new Packager(this, 'probate')
def ansible = new Ansible(this, 'probate')
def rpmTagger
def app = "frontend"
def artifactorySourceRepo = "probate-local"


node {
    try {
        def storeRPMToArtifactory = false
        def newFrontendVersion
        if(store_rpm != 'no' || "master"  == "${env.BRANCH_NAME}" || "develop"  == "${env.BRANCH_NAME}") {
            storeRPMToArtifactory = true
        }
        def version
        def probateFrontendRPMVersion
        def packageVersion
        stage('Checkout') {
            deleteDir()
            checkout scm
            dir('ansible-management') {
                git url: "https://github.com/hmcts/ansible-management", branch: "master", credentialsId: "jenkins-public-github-api-token"
            }
        }

        if ("master"  != "${env.BRANCH_NAME}") {
            sh "printenv"
            newFrontendVersion = "-SNAPSHOT"           
            if("develop"  != "${env.BRANCH_NAME}") {
                branchInfo = (env.BRANCH_NAME).replaceAll("[^a-zA-Z0-9 ]+",".")
                newFrontendVersion = "-${branchInfo}.SNAPSHOT"
            }

            stage('Develop Branch SNAPSHOT') {
                sh """ 
                    sed -i '/version/ s/",/${newFrontendVersion}",/' package.json
                """
            }
        }

        stage('Setup') {
            sh '''
                yarn install
                yarn setup
            '''
        }

        stage('Lint') {
            sh "yarn eslint"
        }

        stage('Node security check') {
            try {
                sh "yarn security 2> nsp-report.txt"
            } catch (err) {
                sh "cat nsp-report.txt"
                archiveArtifacts 'nsp-report.txt'
                //error "Node security check failed see the report for the errors"
            }
            sh "rm nsp-report.txt"
        }

        if(run_test != 'no'  || "master"  == "${env.BRANCH_NAME}" ) {
            env.PORT = Math.abs(new Random().nextInt() % 1000) + 
                       Math.abs(new Random().nextInt() % 100) + 
                       Math.abs(new Random().nextInt() % 10) +  
                       3001;
            // echo env.PORT
            println ("env.PORT : " + env.PORT)
            stage('Test') {
                env.JUNIT_REPORT_PATH="test-reports.xml"
                try {
                    sh '''
                            yarn test -- --reporter mocha-jenkins-reporter --reporter-options junit_report_packages=true
                        '''
                } 
                // catch (err) {
                //     sh '''
                //         echo "Ignore test error"
                //         echo $err
                //     '''
                // } 
                finally {
                    step([$class: 'JUnitResultArchiver', testResults: env.JUNIT_REPORT_PATH])
                }
            }

            try {
                stage('test coverage sonar update') {
                    sh '''
                        yarn test-coverage
                        yarn sonar-scanner
                    '''
                }
            } catch (err) {
                sh '''
                    echo "Ignore sonar scanner error"
                    echo $err
                '''
            }
        }
        def dockerComposeFile = ""
        // if(create_docker != 'no' || "master"  == "${env.BRANCH_NAME}" || run_e2e_test != 'no') {
        if(create_docker != 'no' || "master"  == "${env.BRANCH_NAME}"  || run_e2e_test != 'no') {
            def serviceDockerVersion
            stage('Package (Docker)') {
                if ("develop" == "${env.BRANCH_NAME}") {
                    serviceDockerVersion = 'develop'
                    dockerImage imageName: 'probate/probate-frontend', tags: [serviceDockerVersion]
                } else if ("master" == "${env.BRANCH_NAME}") {
                    serviceDockerVersion = 'latest'
                    dockerImage imageName: 'probate/probate-frontend'
                } else {
                    serviceDockerVersion = dockerImage imageName: 'probate/probate-frontend'
                }

                sh "echo Docker version is: $serviceDockerVersion"
                env.FRONTEND_TAG = serviceDockerVersion
                if(run_e2e_test != 'no') {
                    probateE2ETestVersion = dockerImage imageName: 'probate/probate-e2e' , dockerArgs: ['-f',  'docker/test/Dockerfile']
                    env.PROBATE_E2E = probateE2ETestVersion
                }
                dockerComposeFile = "docker/docker-compose-with-idam.yml"
            }
        }
        env.PORT=3000
        if(run_e2e_test != 'no') {
            try {
                stage('Run probate docker images') {
                    // sh "docker-compose -f ${dockerComposeFile} build"
                    sh "docker-compose -f ${dockerComposeFile} pull"
                    sh "docker-compose -f ${dockerComposeFile} up -d probate-frontend business-service submit-service persistence-service idam-api authentication-web registration-web"
                    waitUntil {
                        timeout(10) {
                            def probateStatus = sh(script: "wget --retry-connrefused --tries=10  -O /dev/null http://localhost:3000/health 2>&1 | grep -F HTTP | cut -d ' ' -f6", returnStatus: true)
                            if(probateStatus != 0) {
                                error('Error in bringing up the probate docker containers...')
                            }

                            return true
                        }
                    }
                }

                stage('End to end test') {
                    try {
                        // sh "docker-compose -f ${dockerComposeFile} run --build e2e-test"
                        sh "docker-compose -f ${dockerComposeFile} run  --user='jenkins:jenkins' e2e-test"

                    } catch (err) {
                        // sh "cat test/end-to-end/output/index.html"
                        error "End to end test failed see the report for the errors"
                    }
                }
            }finally {
                sh "docker-compose -f ${dockerComposeFile} down --remove-orphans"
                try {
                    dest_dir = "${env.JENKINS_HOME}/reports/probate/frontend/"
                    sh "mkdir -p $dest_dir"
                    sh "ls -lrt ./docker"
                    sh "ls -lrt ./docker/test/"
                    sh "ls -lrt ./docker/test/end-to-end/"
                    sh "ls -lrt ./docker/test/end-to-end/output/"
                    sh "cp ./docker/test/end-to-end/output/index.html $dest_dir"

                    publishHTML target: [
                            alwaysLinkToLastBuild: true,
                            reportDir            : "${env.JENKINS_HOME}/reports/probate/frontend/",
                            reportFiles          : "index.html",
                            reportName           : "frontend e2e report Report"
                    ]

                    //step([$class: 'JUnitResultArchiver', e2eTestResults: 'test/end-to-end/output/index.html'])
                }catch(err) {
                    sh "echo $err"
                }
            }
        }   

        if (storeRPMToArtifactory) {
            stage('Package application (RPM)') {
                probateFrontendRPMVersion = packager.nodeRPM(app)
                sh "echo $probateFrontendRPMVersion"
                version = "{probate_frontend_buildnumber: ${probateFrontendRPMVersion}}"
                sh "echo $version"
            }
            def rpmName = packager.rpmName(app, probateFrontendRPMVersion)
            sh "echo $rpmName"
            rpmTagger = new RPMTagger(this, app, rpmName, artifactorySourceRepo)
            packager.publishNodeRPM(app)  
        }

        if ("develop" == "${env.BRANCH_NAME}") {          
            stage('Install (Dev)') {
                ansible.runInstallPlaybook(version, 'dev')
            }
            stage('Deploy (Dev)') {
                ansible.runDeployPlaybook(version, 'dev')
            }
            stage('Tag Deploy success (Dev)') {
                rpmTagger.tagDeploymentSuccessfulOn('dev')
            }
            stage('Smoke Test (Dev)') {
                ws('workspace/probate-frontend/build') {
                    env.PROBATE_FRONTEND_URL = "https://www-" + 'dev' + ".probate.reform.hmcts.net/"
                    git url: 'git@git.reform.hmcts.net:probate/smoke-tests.git'
                    sh '''
                        npm install
                        npm test
                    '''
                    deleteDir()
                }
            }
            stage('Tag Smoke Test success (Dev)') {
                rpmTagger.tagTestingPassedOn('dev')
            }
        }
    } catch (err) {
        deleteDir()
        slackSend(
            channel: '#probate-jenkins',
            color: 'danger',
            message: "${env.JOB_NAME}:  <${env.BUILD_URL}console|Build ${env.BUILD_DISPLAY_NAME}> has FAILED probate-jenkins frontend")
        throw err
    }
}
