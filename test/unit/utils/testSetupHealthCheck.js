'use strict';
const healthcheck = require('@hmcts/nodejs-healthcheck');
const setupHealthCheck = require('app/utils/setupHealthCheck');
const config = require('config');
const modulePath = 'app/utils';
const {sinon, expect} = require('@hmcts/one-per-page-test-suite');
const outputs = require('@hmcts/nodejs-healthcheck/healthcheck/outputs');
const logger = require('app/components/logger')('Init');
const app = {};
let res = {};

describe(modulePath, () => {
    beforeEach(() => {
        app.get = sinon.stub();
        sinon.stub(healthcheck, 'web');
        sinon.stub(healthcheck, 'raw');
        sinon.stub(healthcheck, 'status');
        sinon.stub(logger, 'error');
        sinon.stub(outputs, 'up');
        res = {status: 200};
    });

    afterEach(() => {
        healthcheck.web.restore();
        healthcheck.raw.restore();
        healthcheck.status.restore();
        logger.error.restore();
        outputs.up.restore();
    });

    it('set up health check endpoint', () => {
        setupHealthCheck(app);
        sinon.assert.calledWith(app.get, config.endpoints.health);
    });

    describe('case-orchestration-service', () => {
        it('passes health check', () => {
            setupHealthCheck(app);

            const callArgs = healthcheck.web.getCall(0).args;

            // check we are testing correct service
            expect(callArgs[0]).to.eql(`${config.services.orchestrator.url}/health`);

            const cosCallback = callArgs[1].callback;
            cosCallback(null, res);

            sinon.assert.called(outputs.up);
        });

        it('throws an error if health check fails for case-orchestration-service', () => {
            setupHealthCheck(app);

            const callArgs = healthcheck.web.getCall(0).args;

            // check we are testing correct service
            expect(callArgs[0]).to.eql(`${config.services.orchestrator.url}/health`);

            const cosCallback = callArgs[1].callback;
            cosCallback('error');

            sinon.assert.calledOnce(logger.error);
        });
    });
});
