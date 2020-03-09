'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const FeatureToggle = require('app/services/FeatureToggle');
const config = require('config');
const utils = require('app/components/api-utils');

describe('FeatureToggleService', () => {
    describe('get()', () => {
        it('should call log() and fetchText()', (done) => {
            const endpoint = 'http://localhost';
            const featureToggleKey = 'probate-document-download';
            const fetchOptions = {method: 'GET'};
            const featureToggle = new FeatureToggle(endpoint, 'abc123');
            const logSpy = sinon.spy(featureToggle, 'log');
            const fetchTextSpy = sinon.spy(utils, 'fetchText');
            const fetchOptionsStub = sinon.stub(utils, 'fetchOptions').returns(fetchOptions);

            featureToggle.get(featureToggleKey);

            expect(featureToggle.log.calledOnce).to.equal(true);
            expect(featureToggle.log.calledWith('Get feature toggle')).to.equal(true);
            expect(utils.fetchText.calledOnce).to.equal(true);
            expect(utils.fetchText.calledWith(`${config.featureToggles.url}${config.featureToggles.path}/${featureToggleKey}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchTextSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
