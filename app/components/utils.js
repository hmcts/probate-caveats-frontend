'use strict';

exports.getStore = (redisConfig) => {
    if (redisConfig.enabled === 'true') {
        const Redis = require('ioredis');
        const RedisStore = require('connect-redis').default;
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
