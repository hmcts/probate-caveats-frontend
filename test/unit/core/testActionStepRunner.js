import chai, {expect} from 'chai';

import ActionStepRunner from '../../../app/core/runners/ActionStepRunner.js';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('ActionStepRunner', () => {
    it('Test GET', () => {
        const stepName = 'test';
        const step = {name: stepName};

        const req = {};
        req.session = {
            language: 'en'
        };
        req.log = sinon.spy();
        req.log.error = sinon.spy();
        const res = {};
        res.render = sinon.spy();
        res.status = sinon.spy();

        const runner = new ActionStepRunner();
        runner.handleGet(step, req, res);
        expect(req.log.error).to.have.been.calledWith('GET operation not defined for ' + stepName + ' step');
        expect(res.status).to.have.been.calledWith(404);
        expect(res.render).to.have.been.calledWith('errors/error');
    });
});
