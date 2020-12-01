'use strict';

const router = require('express').Router();
const os = require('os');
const gitProperties = require('git.properties');
const Healthcheck = require('app/utils/Healthcheck');
const commonContent = require('app/resources/en/translation/common');
const gitRevision = process.env.GIT_REVISION;
const osHostname = os.hostname();
const gitCommitId = gitProperties.git.commit.id;
const config = require('config');

const healthcheckFunc = function (res) {
    const healthcheck = new Healthcheck();
    const services = [
        {name: config.services.orchestrator.name, url: config.services.orchestrator.url}
    ];

    healthcheck.getDownstream(services, healthcheck.health, healthDownstream => {
        return healthcheck.getDownstream(services, healthcheck.info, infoDownstream => {
            return res.json({
                name: commonContent.serviceName,
                // status: healthcheck.status(healthDownstream),
                status: 'UP',
                uptime: process.uptime(),
                host: osHostname,
                version: gitRevision,
                gitCommitId,
                downstream: healthcheck.mergeInfoAndHealthData(healthDownstream, infoDownstream)
            });
        });
    });
};

router.get(`${config.app.basePath}/health`, (req, res) => {
    healthcheckFunc(res);
});

router.get('/health', (req, res) => {
    healthcheckFunc(res);
});

module.exports = router;
module.exports.osHostname = osHostname;
module.exports.gitCommitId = gitCommitId;
