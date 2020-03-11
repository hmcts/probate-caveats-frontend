const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const request = require('superagent');
const config = require('config');
const frontendUrl = config.TestFrontendUrl;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const healthcheckRequest = (url, cb) => {
    return request
        .get(`${url}/health`)
        .end((err, res) => {
            if (err) {
                throw err;
            }
            cb(res);
        });
};

chai.use(chaiHttp);

describe('Probate frontend health check', () => {
    it('should return a 200 status code, body status UP and HOST in the body', done => {
        healthcheckRequest(frontendUrl, res => {
            expect(res).to.have.status(200);
            expect(res.body.status).to.equal('UP');
            expect(res.body).to.have.property('host');
            done();
        });
    });
});
