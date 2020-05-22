'use strict';

const expect = require('chai').expect;
const app = require('app');
const request = require('supertest');
const healthcheck = require('app/healthcheck');
const commonContent = require('app/resources/en/translation/common');

describe('healthcheck.js', () => {
    describe('/health endpoint', () => {
        it('should return the correct params', (done) => {
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/health')
                .expect(200)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('name').and.equal(commonContent.serviceName);
                    // expect(res.body).to.have.property('status').and.equal('DOWN');
                    expect(res.body).to.have.property('status').and.equal('UP');
                    expect(res.body).to.have.property('host').and.equal(healthcheck.osHostname);
                    expect(res.body).to.have.property('gitCommitId').and.equal(healthcheck.gitCommitId);
                    done();
                });
        });
    });
});
