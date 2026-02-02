const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');
const testConfig = require('config');

const browser = process.env.BROWSER_GROUP || 'chrome';
const isWebKit = process.env.BROWSER_GROUP === 'webkit_safari';

const defaultSauceOptions = {
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    acceptSslCerts: true,
    windowSize: '1600x900',
    tags: ['probate_caveats']
};

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

    // ✅ Default helpers for SauceLabs browsers
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
    } : {
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

    multiple: {
        microsoft: {
            browsers: getBrowserConfig('microsoft')
            // Uses default WebDriver helpers
        },

        chrome: {
            browsers: getBrowserConfig('chrome')
            // Uses default WebDriver helpers
        },

        firefox: {
            browsers: getBrowserConfig('firefox')
            // Uses default WebDriver helpers
        },

        // ✅ WebKit - explicitly override helpers
        webkit_safari: {
            browsers: ['webkit'],
            helpers: {
                Playwright: {
                    url: testConfig.TestE2EFrontendUrl + testConfig.TestBasePath,
                    browser: 'webkit',
                    restart: true,
                    keepBrowserState: false,
                    keepCookies: false,
                    show: false,
                    waitForTimeout: 10000,
                    timeout: 30000
                }
            }
        }
    }
};
