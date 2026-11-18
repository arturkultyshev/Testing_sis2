pipeline {
  agent none
  options {
    skipDefaultCheckout()
    disableConcurrentBuilds()
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(artifactDaysToKeepStr: '14'))
  }
  triggers { pollSCM('H/5 * * * *') }
  parameters {
    choice(name: 'SHARDS', choices: ['4', '1'], description: '4 for normal CI; 1 for the timing baseline')
  }
  environment {
    CI = 'true'
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1'
    NPM_CONFIG_CACHE = "${env.JENKINS_HOME}/npm-cache"
  }
  stages {
    stage('Tests') {
      steps {
        script {
          int total = (params.SHARDS ?: '4').toInteger()
          def shards = [:]
          for (int i = 1; i <= total; i++) {
            int shard = i
            shards["Shard ${shard}/${total}"] = {
              node {
                deleteDir()
                checkout scm
                sh 'npm ci'
                sh 'npx playwright install --dry-run chromium'
                try {
                  sh "bash -c 'time npx playwright test --shard=${shard}/${total}'"
                } finally {
                  stash name: "blob-${shard}", includes: 'blob-report/*.zip', allowEmpty: true
                  junit testResults: 'reports/junit.xml', allowEmptyResults: true
                  sh "mkdir -p shard-${shard}; for path in test-results reports; do if [ -d \"\$path\" ]; then cp -R \"\$path\" shard-${shard}/; fi; done"
                  archiveArtifacts artifacts: "shard-${shard}/**", allowEmptyArchive: true
                }
              }
            }
          }
          parallel shards
        }
      }
    }
  }
  post {
    always {
      script {
        node {
          deleteDir()
          checkout scm
          sh 'npm ci --ignore-scripts'
          int total = (params.SHARDS ?: '4').toInteger()
          dir('all-blob-reports') {
            for (int i = 1; i <= total; i++) {
              dir("shard-${i}") {
                catchError(buildResult: 'FAILURE', catchInterruptions: false) {
                  unstash "blob-${i}"
                }
              }
            }
          }
          sh '''
            set -eu
            mkdir -p merged-blobs
            find all-blob-reports -name '*.zip' -exec cp {} merged-blobs/ \\;
            npx playwright merge-reports --config merge.config.ts merged-blobs
          '''
          archiveArtifacts artifacts: 'playwright-report/**,reports/junit-merged.xml'
        }
      }
    }
  }
}
