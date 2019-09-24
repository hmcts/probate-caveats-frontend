'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');

describe('accessibility', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('Accessibility');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page', (done) => {
            const contentData = {
                myAbilityLink: config.links.myAbilityLink,
                helpLineNumber: config.helpline.number,
                helpLineHours: config.helpline.hours,
                callChargesLink: config.links.callCharges,
                equalityAdvisorLink: config.links.equalityAdvisorLink,
                wcag21Link: config.links.wcag21Link,
                applicationFormPA15: config.links.applicationFormPA15,
                deathReportedToCoroner: config.links.deathReportedToCoroner,
                probateStartApplyLink: config.links.probateStartApplyLink,
                caveatsStartApplyLink: config.links.caveatsStartApplyLink,
            };

            testWrapper.testContent(done, contentData);
        });
    });
});
