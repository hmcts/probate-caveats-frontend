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
                    done();
                });
        });
    });
});
