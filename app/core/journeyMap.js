'use strict';

const {get} = require('lodash');
const journey = require('app/journeys/probate-caveats');
const steps = require('app/core/initSteps').steps;

const nextOptionStep = (currentStep, ctx) => {
    const match = currentStep.nextStepOptions(ctx).options
        .find((option) => get(ctx, option.key) === option.value);
    return match ? match.choice : 'otherwise';
};

const nextStep = (currentStep, ctx) => {
    let nextStepName = journey.stepList[currentStep.name];
    if (nextStepName !== null && typeof nextStepName === 'object') {
        nextStepName = nextStepName[nextOptionStep(currentStep, ctx)];
    }
    return steps[nextStepName];
};

module.exports = nextStep;
module.exports.stepList = journey.stepList;
