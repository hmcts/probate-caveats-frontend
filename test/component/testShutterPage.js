'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');

const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const shutterFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.caveats_shutter_toggle}`;
const featureTogglesNock = (status = 'true') => {
    nock(featureToggleUrl)
        .get(shutterFeatureTogglePath)
        .reply(200, status);
};

describe('shutter-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('ShutterPage');
        featureTogglesNock('true');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the page', (done) => {
            const excludeContent = ['paragraph3'];

            testWrapper.testContent(done, {}, excludeContent);
        });
    });
});
