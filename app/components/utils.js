'use strict';

exports.forceHttps = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        // 302 temporary - this is a feature that can be disabled
        return res.redirect(302, `https://${req.get('Host')}${req.url}`);
    }
    next();
};

exports.getStore = (redisConfig, session) => {
    if (redisConfig.enabled === 'true') {
        const Redis = require('ioredis');
        const RedisStore = require('connect-redis')(session);
        const tlsOptions = {
            password: redisConfig.password,
            tls: true
        };
        const redisOptions = redisConfig.useTLS === 'true' ? tlsOptions : {};
        const client = new Redis(redisConfig.port, redisConfig.host, redisOptions);
        return new RedisStore({client});
    }
    const MemoryStore = require('express-session').MemoryStore;
    return new MemoryStore();
};
