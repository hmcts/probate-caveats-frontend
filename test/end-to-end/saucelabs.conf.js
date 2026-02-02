/* eslint-disable no-console */

const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');
const testConfig = require('config');

// const waitForTimeout = parseInt(process.env.WAIT_FOR_TIMEOUT) || 45000;
// const smartWait = parseInt(process.env.SMART_WAIT) || 30000;
const browser = process.env.BROWSER_GROUP || 'chrome';
const defaultSauceOptions = {
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    acceptSslCerts: true,
    windowSize: '1600x900',
    tags: ['probate_caveats']
};

function merge (intoObject, fromObject) {
    return Object.assign({}, intoObject, fromObject);
}

/*const sauceLabsHelpers = {
    WebDriver: {
        host: 'ondemand.saucelabs.com',
        port: 80,
        user: process.env.SAUCE_USERNAME,
        key: process.env.SAUCE_ACCESS_KEY,
        region: 'eu',
        browser: 'chrome',
        desiredCapabilities: {
            // your capabilities
        }
    },
    SauceLabsReportingHelper: {
        require: './helpers/SauceLabsReportingHelper.js'
    }
};*/

const isWebKit = process.env.BROWSER_GROUP === 'webkit_safari';

function getBrowserConfig(browserGroup) {
    const browserConfig = [];
    for (const candidateBrowser in supportedBrowsers[browserGroup]) {
        if (candidateBrowser) {
            const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
            candidateCapabilities['sauce:options'] = merge(
                defaultSauceOptions, candidateCapabilities['sauce:options']
            );
            browserConfig.push({
                browser: candidateCapabilities.browserName,
                capabilities: candidateCapabilities
            });
        } else {
            console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
        }
    }
    return browserConfig;
}

const setupConfig = {
    tests: testConfig.TestPathToRun,
    output: `${process.cwd()}/${testConfig.TestOutputDir}`,
    helpers: isWebKit ? {
        // Only Playwright for webkit
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
        // WebDriver for other browsers
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
    include: {
        I: './pages/steps.js'
    },
    mocha: {
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: '-',
                options: {steps: true}
            },
            'mocha-junit-reporter': {
                stdout: '-',
                options: {mochaFile: `${testConfig.TestOutputDir}/result.xml`}
            },
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
        },
        chrome: {
            browsers: getBrowserConfig('chrome')
        },
        firefox: {
            browsers: getBrowserConfig('firefox')
        },
        webkit_safari: {
            browsers: ['webkit'],
            helpers: {
                Playwright: {// Use Playwright helper, not WebDriver
                    url: testConfig.TestE2EFrontendUrl + testConfig.TestBasePath,
                    browser: 'webkit',
                    restart: true,
                    keepBrowserState: false,
                    keepCookies: false,
                    show: false,
                    waitForTimeout: 10000
                }
            }
        }
    },
    name: 'Probate Caveats FrontEnd Cross-Browser Tests'
};

exports.config = setupConfig;
