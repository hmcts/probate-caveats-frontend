const expect = require('chai').expect;
const {cloneDeep} = require('lodash');
const config = require('config');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const modulePath = 'app/setupSecrets';

let mockConfig = {};

describe(modulePath, () => {
    beforeEach(() => {
        mockConfig = cloneDeep(config);
    });

    describe('#setup', () => {
        it('should set config values when secrets path is set', () => {
            mockConfig.secrets = {
                probate: {
                    'caveats-fe-redis-access-key': 'redisValue',
                    'idam-s2s-secret': 'idamValue',
                }
            };

            // Update config with secret setup
            const setupSecrets = proxyquire(modulePath,
                {config: mockConfig});
            setupSecrets();

            expect(mockConfig.redis.password)
                .to.equal(mockConfig.secrets.probate['caveats-fe-redis-access-key']);
            expect(mockConfig.services.idam.service_key)
                .to.equal(mockConfig.secrets.probate['idam-s2s-secret']);
        });

        it('should not set config values when secrets path is not set', () => {
            // Update config with secret setup
            mockConfig.secrets = {
                probate: {
                }
            };
            const setupSecrets = proxyquire(modulePath,
                {config: mockConfig});
            setupSecrets();

            expect(mockConfig.redis.secret)
                .to.equal('OVERWRITE_THIS');
        });

        it('should only set one config value when single secret path is set', () => {
            mockConfig.secrets = {
                probate: {
                    'idam-s2s-secret': 'idamValue',
                }
            };

            // Update config with secret setup
            const setupSecrets = proxyquire(modulePath,
                {config: mockConfig});
            setupSecrets();

            expect(mockConfig.redis.secret)
                .to.equal('OVERWRITE_THIS');
            expect(mockConfig.services.idam.service_key)
                .to.equal(mockConfig.secrets.probate['idam-s2s-secret']);
        });
    });

    describe('localSecrets', () => {
        let execSyncStub;
        let setupSecrets;

        beforeEach(() => {
            execSyncStub = sinon.stub().returns('secretValue');
            setupSecrets = proxyquire(modulePath,
                {'child_process': {execSync: execSyncStub}, config: mockConfig});
        });

        it('should set local config if environment is dev-aat', () => {
            process.env.NODE_ENV = 'dev-aat';
            setupSecrets();

            expect(execSyncStub.callCount).to.equal(7);
            expect(mockConfig.services.idam.service_key).to.equal('secretValue');
            expect(mockConfig.services.idam.service_key).to.equal('secretValue');
            expect(mockConfig.services.idam.probate_oauth2_secret).to.equal('secretValue');
            expect(mockConfig.featureToggles.launchDarklyKey).to.equal('secretValue');
            expect(mockConfig.featureToggles.launchDarklyUser.key).to.equal('secretValue');
            expect(mockConfig.services.idam.caveat_user_email).to.equal('secretValue');
            expect(mockConfig.services.idam.caveat_user_password).to.equal('secretValue');
            expect(mockConfig.services.postcode.token).to.equal('secretValue');
        });

        it('should not set local config if environment is not dev-aat', () => {
            process.env.NODE_ENV = 'production';
            setupSecrets();

            expect(execSyncStub.callCount).to.equal(0);
            expect(mockConfig.services.idam.service_key).to.not.equal('secretValue');
            expect(mockConfig.services.idam.service_key).to.not.equal('secretValue');
            expect(mockConfig.services.idam.probate_oauth2_secret).to.not.equal('secretValue');
            expect(mockConfig.featureToggles.launchDarklyKey).to.not.equal('secretValue');
            expect(mockConfig.featureToggles.launchDarklyUser.key).to.not.equal('secretValue');
            expect(mockConfig.services.idam.caveat_user_email).to.not.equal('secretValue');
            expect(mockConfig.services.idam.caveat_user_password).to.not.equal('secretValue');
            expect(mockConfig.services.postcode.token).to.not.equal('secretValue');
        });
    });
});
