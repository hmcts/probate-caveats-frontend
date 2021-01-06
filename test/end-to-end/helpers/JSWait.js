class JSWait extends codecept_helper {

    _beforeStep(step) {

        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;

        if (step.name === 'seeCurrentUrlEquals' || step.name === 'seeInCurrentUrl') {
            return helper.waitForElement('body', 30);
        }
        return Promise.resolve();
    }

    async navByClick (text, locator) {
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
        const helperIsPuppeteer = this.helpers.Puppeteer;

        helper.click(text, locator).catch(err => {
            console.error(err.message);
        });

        if (helperIsPuppeteer) {
            await helper.page.waitForNavigation({waitUntil: 'networkidle0'});
        } else {
            await helper.wait(2);
        }
    }

    async amOnLoadedPage (url, language ='en') {
        let newUrl = `${url}?lng=${language}`;
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
        const helperIsPuppeteer = this.helpers.Puppeteer;

        if (newUrl.indexOf('http') !== 0) {
            newUrl = helper.options.url + newUrl;
        }

        if (helperIsPuppeteer) {
            helper.page.goto(newUrl).catch(err => {
                console.error(err.message);
            });
            await helper.page.waitForNavigation({waitUntil: 'networkidle0'});

        } else {
            await helper.amOnPage(newUrl);
            await helper.wait(2);
            await helper.waitForElement('body');
        }
    }

    clickBrowserBackButton() {
        const page = this.helpers.WebDriver.page || this.helpers.Puppeteer.page;
        return page.goBack();
    }

    async checkElementExist(selector) {
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;

        try {
            await helper.waitForElement(selector, 3);
        } catch (e) {
            console.log('Element Not Found:', selector);
        }

        return helper
            ._locate(selector)
            .then(els => {
                return Boolean(els.length);
            })
            .catch(err => {
                throw err;
            });
    }
}

module.exports = JSWait;
