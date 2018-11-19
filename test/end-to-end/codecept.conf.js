const testConfig = require('test/config.js');

exports.config = {
    'tests': './paths/**/*.js',
    'output': './output',
    'helpers': {
        'Puppeteer': {
            'url': testConfig.TestFrontendUrl || 'http://localhost:3000',
            'waitForTimeout': 60000,
            'waitForAction': 2000,
            'show': false,
            'chrome': {
                'ignoreHTTPSErrors': true
            },
            'switches': {
                'ignore-certificate-errors': true
            }
        },
        'PuppeteerHelper': {
            'require': './helpers/PuppeteerHelper.js'
        },
        'JSWaitHelper': {
            'require': './helpers/JSWaitHelper.js'
        }
    },
    'include': {
        'I': './pages/steps.js'
    },
    'mocha': {
        'reporterOptions': {
            'reportDir': process.env.E2E_OUTPUT_DIR || './output',
            'reportName': 'index',
            'inlineAssets': true
        }
    },
    'name': 'Codecept Tests'
};
