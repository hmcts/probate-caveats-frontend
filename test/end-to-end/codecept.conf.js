const config = require('config');

exports.config = {
    'tests': config.TestPathToRun,
    'output': `${process.cwd()}/${config.TestOutputDir}`,
    'helpers': {
        'Playwright': {
            'url': config.TestE2EFrontendUrl + config.TestBasePath || 'http://localhost:3000',
            'waitForTimeout': 60000,
            'getPageTimeout': 20000,
            'show': config.TestShowBrowser,
            'waitForNavigation': ['domcontentloaded', 'networkidle0'],
            'chrome': {
                'ignoreHTTPSErrors': true,
                'ignore-certificate-errors': true,
                args: [
                    '--disable-gpu', '--no-sandbox', '--allow-running-insecure-content', '--ignore-certificate-errors',
                    //'--proxy-server=proxyout.reform.hmcts.net:8080',
                    //'--proxy-bypass-list=*beta*LB.reform.hmcts.net'
                ]
            },
        },
        JSWait: {require: './helpers/JSWait.js'},
    },
    include: {
        I: './pages/steps.js'
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
        reporter: 'mocha-multi-reporters',
        reporterOptions: {
            reporterEnabled: 'mocha-junit-reporter, mochawesome',
            mochaJunitReporterReporterOptions: {
                mochaFile: 'functional-output/junit/results-[hash].xml',
                useFullSuiteTitle: true,
                suiteTitleSeparatedBy: ' › ',
                attachments: true
            },
            mochawesomeReporterOptions: {
                reportDir: config.TestOutputDir || './functional-output',
                reportFilename: 'mochawesome',
                quiet: true,
                json: true,
                html: true
            }
        }
    },
    multiple: {
        parallel: {
            chunks: 2,
            browsers: ['chrome']
        }
    },
    'name': 'Caveat E2E Tests'
};
