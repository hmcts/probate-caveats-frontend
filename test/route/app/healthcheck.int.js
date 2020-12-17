const {expect} = require('chai');
const app = require('app');
const request = require('supertest');
const config = require('config');

describe('healthcheck.js', () => {
    it('/health should return the correct params', (done) => {
        const server = app.init();
        const agent = request.agent(server.app);
        agent.get('/health')
            .expect(200)
            .end((err, res) => {
                server.http.close();
                if (err) {
                    throw err;
                }
                expect(res.body).to.have.property('name').and.equal(config.health.service_name);
                expect(res.body).to.have.property('status').and.equal('UP');
                done();
            });
    });
});
