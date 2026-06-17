import chai, {expect} from 'chai';

import OptionGetRunner from '../../../app/core/runners/OptionGetRunner.js';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('OptionGetRunner', () => {
    it('Test POST', () => {
        const step = {name: 'test'};

        const req = {};
        req.session = {
            language: 'en'
        };
        req.log = sinon.spy();
        req.log.error = sinon.spy();
        const res = {};
        res.render = sinon.spy();
        res.status = sinon.spy();

        const runner = new OptionGetRunner();
        runner.handlePost(step, req, res);
        expect(req.log.error).to.have.been.calledWith('Post operation not defined for OptionGetRunner');
        expect(res.status).to.have.been.calledWith(404);
        expect(res.render).to.have.been.calledWith('errors/error');
    });
});
