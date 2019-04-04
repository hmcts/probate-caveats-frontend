'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const security = require('app/components/security');
const utils = require('app/components/api-utils');

describe('security', () => {
    describe('getUserToken()', () => {
        let fetchJsonStub;

        beforeEach(() => {
            fetchJsonStub = sinon.stub(utils, 'fetchJson');
        });

        afterEach(() => {
            fetchJsonStub.restore();
        });

        it('should return a successful result', (done) => {
            fetchJsonStub.onFirstCall().returns(Promise.resolve({code: 'KBSsVGrhx3NDeTfd'}));
            fetchJsonStub.onSecondCall().returns(Promise.resolve({access_token: 'userToken'}));

            security.getUserToken('hostname', 'id')
                .then((res) => {
                    expect(res).to.equal('userToken');
                    sinon.assert.callCount(fetchJsonStub, 2);
                    done();
                });
        });

        it('should return an error if idam is not available on first call', (done) => {
            fetchJsonStub.returns(Promise.reject(new Error('FetchError: request to http://localhost:4501/oauth2/authorize')));
            security.getUserToken('hostname', 'id')
                .then((err) => {
                    expect(err.toLocaleString()).to.equal('Error: FetchError: request to http://localhost:4501/oauth2/authorize');
                    sinon.assert.callCount(fetchJsonStub, 1);
                    done();
                });
        });

        it('should return an error if idam is not available on second call', (done) => {
            fetchJsonStub.onFirstCall().returns(Promise.resolve({code: 'KBSsVGrhx3NDeTfd'}));
            fetchJsonStub.returns(Promise.reject(new Error('FetchError: request to http://localhost:4501/oauth2/token')));
            security.getUserToken('hostname', 'id')
                .then((err) => {
                    expect(err.toLocaleString()).to.equal('Error: FetchError: request to http://localhost:4501/oauth2/token');
                    sinon.assert.callCount(fetchJsonStub, 2);
                    done();
                });
        });
    });
});
