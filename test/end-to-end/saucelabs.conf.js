/* eslint-disable no-console */

const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');
const testConfig = require('config');

const browser = process.env.BROWSER_GROUP || 'chrome';

const defaultSauceOptions = {
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    acceptSslCerts: true,
    windowSize: '1600x900',
    tags: ['probate_caveats']
};

const isWebKit = process.env.BROWSER_GROUP === 'webkit_safari';

function merge(intoObject, fromObject) {
    return Object.assign({}, intoObject, fromObject);
}

function getBrowserConfig(browserGroup) {
    const browserConfig = [];
    for (const candidateBrowser in supportedBrowsers[browserGroup]) {
        const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
        candidateCapabilities['sauce:options'] = merge(
            defaultSauceOptions,
            candidateCapabilities['sauce:options']
        );

        browserConfig.push({
            browser: candidateCapabilities.browserName,
            capabilities: candidateCapabilities
        });
    }
    return browserConfig;
}

exports.config = {
    name: 'Probate Caveats FrontEnd Cross-Browser Tests',

    tests: testConfig.TestPathToRun,
    output: `${process.cwd()}/${testConfig.TestOutputDir}`,

    /**
     * 🔑 CRITICAL PART
     * WebDriver does NOT exist at all for WebKit
     */
    helpers: isWebKit ? {
        Playwright: {
            url: testConfig.TestE2EFrontendUrl + testConfig.TestBasePath,
            browser: 'webkit',
            restart: true,
            keepBrowserState: false,
            keepCookies: false,
            show: false,
            waitForTimeout: 10000
        }
    }: {
        WebDriver: {
            host: 'ondemand.saucelabs.com',
            port: 80,
            user: process.env.SAUCE_USERNAME,
            key: process.env.SAUCE_ACCESS_KEY,
            region: 'eu',
            browser: 'chrome'
        },
        SauceLabsReportingHelper: {
            require: './helpers/SauceLabsReportingHelper.js'
        }
    },

    include: {
        I: './pages/steps.js'
    },

    plugins: {
        retryFailedStep: {
            enabled: true,
            retries: 2
        },
        autoDelay: {
            enabled: true,
            delayAfter: 2000
        }
    },

    mocha: {
        reporterOptions: {
            mochawesome: {
                stdout: testConfig.TestOutputDir + '/console.log',
                options: {
                    reportDir: testConfig.TestOutputDir,
                    reportName: 'index',
                    reportTitle: 'Crossbrowser results for: ' + browser.toUpperCase(),
                    inlineAssets: true
                }
            }
        }
    },

    /**
     * Browser groups for run-multiple
     */
    multiple: {
        microsoft: {
            browsers: getBrowserConfig('microsoft')
        },
        chrome: {
            browsers: getBrowserConfig('chrome')
        },
        firefox: {
            browsers: getBrowserConfig('firefox')
        },

        /**
         * ✅ WebKit group
         * No WebDriver, no SauceLabs
         */
        webkit_safari: {
            browsers: ['webkit']
        }
    }
};
