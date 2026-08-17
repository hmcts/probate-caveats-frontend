'use strict';

const expect = require('chai').expect;
const app = require('app');
const request = require('supertest');

describe('Liveness check', () => {
    describe('/health/liveness endpoint', () => {
        it('should return the correct params', (done) => {
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/health/liveness')
                .expect(200)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('status').and.equal('UP');
                    expect(res.headers['permissions-policy']).to.equal('geolocation=(), camera=(), microphone=()');
                    expect(res.headers['content-security-policy']).to.contain('script-src \'self\' \'strict-dynamic\'');
                    expect(res.headers['content-security-policy']).to.contain('style-src \'self\' \'unsafe-inline\'');
                    expect(res.headers['content-security-policy']).to.not.contain('script-src \'unsafe-inline\'');
                    // eslint-disable-next-line no-undefined
                    expect(res.headers['x-frame-options']).to.equal(undefined);
                    // eslint-disable-next-line no-undefined
                    expect(res.headers['x-xss-protection']).to.equal(undefined);
                    done();
                });
        });
    });
});
