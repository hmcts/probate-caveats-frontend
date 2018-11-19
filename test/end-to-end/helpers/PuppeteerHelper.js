'use strict';

const Helper = codecept_helper;
const helperName = 'Puppeteer';

class PuppeteerHelper extends Helper {

    clickBrowserBackButton() {
        const page = this.helpers[helperName].page;

        return page.goBack();
    }

}

module.exports = PuppeteerHelper;
