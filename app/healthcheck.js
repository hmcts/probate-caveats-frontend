'use strict';

const router = require('express').Router();
const os = require('os');
const gitProperties = require('git.properties');
const commonContent = require('app/resources/en/translation/common');
const gitRevision = process.env.GIT_REVISION;
const osHostname = os.hostname();
const gitCommitId = gitProperties.git.commit.id;

router.get('/', (req, res) => {
    res.json({
        'name': commonContent.serviceName,
        'status': 'UP',
        'uptime': process.uptime(),
        'host': osHostname,
        'version': gitRevision,
        gitCommitId
    });
});

module.exports = router;
module.exports.osHostname = osHostname;
module.exports.gitCommitId = gitCommitId;
