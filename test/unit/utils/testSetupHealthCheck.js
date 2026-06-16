import config from 'config';
import {expect} from 'chai';
import healthcheck from '@hmcts/nodejs-healthcheck';
import logger from '../../../app/components/logger.js';
import outputs from '@hmcts/nodejs-healthcheck/healthcheck/outputs';
import setupHealthCheck from '../../../app/utils/setupHealthCheck.js';
import sinon from 'sinon';

const assert = sinon.assert;
const loggerInit = logger('Init');
const modulePath = 'app/utils';

const app = {};
let res = {};

describe(modulePath, () => {
    beforeEach(() => {
        app.get = sinon.stub();
        sinon.stub(healthcheck, 'web');
        sinon.stub(healthcheck, 'raw');
        sinon.stub(healthcheck, 'status');
        sinon.stub(loggerInit, 'error');
        sinon.stub(outputs, 'up');
        res = {status: 200};
    });

    afterEach(() => {
        healthcheck.web.restore();
        healthcheck.raw.restore();
        healthcheck.status.restore();
        loggerInit.error.restore();
        outputs.up.restore();
    });

    it('set up health check endpoint', () => {
        setupHealthCheck(app);
        assert.calledWith(app.get, config.endpoints.health);
    });

    describe('case-orchestration-service', () => {
        it('passes health check', () => {
            setupHealthCheck(app);

            const callArgs = healthcheck.web.getCall(0).args;

            // check we are testing correct service
            expect(callArgs[0]).to.eql(`${config.services.orchestrator.url}/health`);

            const cosCallback = callArgs[1].callback;
            cosCallback(null, res);

            assert.called(outputs.up);
        });

        it('throws an error if health check fails for case-orchestration-service', () => {
            setupHealthCheck(app);

            const callArgs = healthcheck.web.getCall(0).args;

            // check we are testing correct service
            expect(callArgs[0]).to.eql(`${config.services.orchestrator.url}/health`);

            const cosCallback = callArgs[1].callback;
            cosCallback('error');

            assert.calledOnce(loggerInit.error);
        });
    });
});
