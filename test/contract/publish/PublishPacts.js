'use strict';

/* eslint no-console: 0 */

const path = require('path');
const pact = require('@pact-foundation/pact-node');
const config = require('config');
const git = require('git-rev-sync');

const opts = {
    pactFilesOrDirs: [path.resolve(process.cwd(), config.services.pact.pactDirectory)],
    pactBroker: config.services.pact.url,
    consumerVersion: git.short(),
};

const tags = config.services.pact.tag;

if (tags === 'master') {
    console.log(`tags is [${tags}], using directly`);
    opts.tags = tags;
} else {
    console.log(`tags is [${tags}], using value Dev`);
    opts.tags = 'Dev';
}

pact.publishPacts(opts)
    .then(() => {
        console.log('Pact contract publishing complete!');
    })
    .catch(e => {
        console.log('Pact contract publishing failed: ', e);

    });
