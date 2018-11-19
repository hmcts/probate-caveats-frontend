class JSWaitHelper extends codecept_helper { // eslint-disable-line camelcase
    _beforeStep(step) {
        const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;

        // Wait for content to load before checking URL
        if (step.name === 'seeCurrentUrlEquals') {
            helper.waitForElement('#content', 300);
        }
    }
}

module.exports = JSWaitHelper;
