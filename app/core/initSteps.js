'use strict';

const requireDir = require('require-directory');
const i18next = require('i18next');
const logger = require('app/components/logger')('Init');
const path = require('path');
const steps = {};

const initStep = (filePath, language) => {
    const stepObject = require(filePath);
    const filePathFragments = filePath.search('ui') >= 0 ? filePath.split(`${path.sep}ui${path.sep}`) : filePath.split(`${path.sep}action${path.sep}`);
    let resourcePath = filePathFragments[1];
    resourcePath = resourcePath.replace(`${path.sep}index.js`, '');
    const section = resourcePath.split(path.sep);

    if (section.length > 1) {
        section.pop();
    }

    const schemaPath = filePath.replace('index.js', 'schema');
    let schema;

    try {
        schema = require(schemaPath);
    } catch (e) {
        schema = {};
    }

    resourcePath = resourcePath.replace(path.sep, '/');
    return new stepObject(steps, section.toString(), resourcePath, i18next, schema, language);
};

const initSteps = (stepLocations, language = 'en') => {
    initI18Next();

    const calculatePath = path => {
        if ((/index.js$/).test(path)) {
            const step = initStep(path, language);
            steps[step.name] = step;
            return true;
        }
        return false;
    };
    for (const location of stepLocations) {
        requireDir(module, location, {include: calculatePath});
    }

    return steps;
};

const initI18Next = () => {
    const content = requireDir(module, '../', {include: /resources/});
    i18next.createInstance();
    i18next.init(content, (err) => {
        if (err) {
            logger.error(err);
        }
    });
};

module.exports = initSteps;
module.exports.initI18Next = initI18Next;
module.exports.steps = steps;
