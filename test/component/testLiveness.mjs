import App from '../../app.mjs';
import {expect} from 'chai';
import request from 'supertest';

describe('Liveness check', () => {
    describe('/health/liveness endpoint', () => {
        let server;
        before(() => {
            server = App.init();
        });

        after(() => {
            server.http.close();
        });

        it('should return the correct params', (done) => {
            const agent = request.agent(server.app);
            agent.get('/health/liveness')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('status').and.equal('UP');
                    done();
                });
        });
    });
});
