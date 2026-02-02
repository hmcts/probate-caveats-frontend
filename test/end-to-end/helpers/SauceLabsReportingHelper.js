const event = require('codeceptjs').event;
const container = require('codeceptjs').container;
const exec = require('child_process').exec;

function updateSauceLabsResult(result, sessionId) {
    console.log('SauceOnDemandSessionID=' + sessionId + ' job-name=probate-caveats-frontend');
    return 'curl -X PUT -s -d \'{"passed": ' + result + '}\' -u ' + process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY + ' https://eu-central-1.saucelabs.com/rest/v1/' + process.env.SAUCE_USERNAME + '/jobs/' + sessionId;
}

// ✅ Helper function to safely get WebDriver session
function getWebDriverSession() {
    try {
        const helper = container.helpers('WebDriver');

        // Check if WebDriver helper exists and is enabled
        if (!helper) {
            console.log('WebDriver helper not found - skipping SauceLabs reporting');
            return null;
        }

        // Check if browser session exists
        if (!helper.browser) {
            console.log('No browser session found - skipping SauceLabs reporting');
            return null;
        }

        // Check if sessionId exists (WebDriver only, not Playwright)
        if (!helper.browser.sessionId) {
            console.log('No sessionId found (likely Playwright) - skipping SauceLabs reporting');
            return null;
        }

        return helper.browser.sessionId;

    } catch (error) {
        console.log('Error getting WebDriver session:', error.message);
        return null;
    }
}

module.exports = function() {

    // Setting test success on SauceLabs
    event.dispatcher.on(event.test.passed, () => {
        try {
            const sessionId = getWebDriverSession();

            if (sessionId) {
                exec(updateSauceLabsResult('true', sessionId));
            }
        } catch (error) {
            console.error('Error reporting passed test to SauceLabs:', error.message);
        }
    });

    // Setting test failure on SauceLabs
    event.dispatcher.on(event.test.failed, () => {
        try {
            const sessionId = getWebDriverSession();

            if (sessionId) {
                exec(updateSauceLabsResult('false', sessionId));
            }
        } catch (error) {
            console.error('Error reporting failed test to SauceLabs:', error.message);
        }
    });
};
