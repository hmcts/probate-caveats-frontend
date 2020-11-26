const config = require('config');

exports.config = {
    'tests': config.TestPathToRun,
    'output': config.TestOutputDir,
    'helpers': {
        'Puppeteer': {
            'url': config.TestE2EFrontendUrl + config.TestBasePath || 'http://localhost:3000',
            'waitForTimeout': 60000,
            'getPageTimeout': 20000,
            'show': config.TestShowBrowser,
            'waitForNavigation': ['domcontentloaded', 'networkidle0'],
            'chrome': {
                'ignoreHTTPSErrors': true,
                'ignore-certificate-errors': true,
                args: [
                    '--headless', '--disable-gpu', '--no-sandbox', '--allow-running-insecure-content', '--ignore-certificate-errors', '-disable-dev-shm-usage',
                    '--proxy-server=proxyout.reform.hmcts.net:8080',
                    '--proxy-bypass-list=*beta*LB.reform.hmcts.net'
                ]
            },
        },
        JSWait: {require: './helpers/JSWait.js'},
    },
    'include': {
        'I': './pages/steps.js'
    },
    plugins: {
        screenshotOnFail: {
            enabled: true,
            fullPageScreenshots: true
        },
        retryFailedStep: {
            enabled: true,
            retries: 1
        },
        autoDelay: {
            enabled: true
        }
    },
    mocha: {
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: '-',
                options: {steps: true}
            },
            'mocha-junit-reporter': {
                stdout: '-',
                options: {mochaFile: './functional-output/result.xml'}
            },
            mochawesome: {
                stdout: './functional-output/console.log',
                options: {
                    reportDir: config.TestOutputDir,
                    reportName: 'index',
                    inlineAssets: true
                }
            }
        }
    },
    'multiple': {
        'parallel': {
            'chunks': 3
        }
    },
    'name': 'Caveat E2E Tests'
};
