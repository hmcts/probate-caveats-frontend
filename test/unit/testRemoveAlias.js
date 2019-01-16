'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;

describe('RemoveAlias', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

    describe('getContextData', () => {
        it('Removes an alias from the context', (done) => {
            const RemoveAlias = steps.RemoveAlias;
            const req = {
                params: ['name_1'],
                session: {
                    form: {}
                },
                body: {
                    otherNames: {
                        name_0: {
                            firstName: 'alias1',
                            lastName: 'one'
                        },
                        name_1: {
                            firstName: 'alias2',
                            lastName: 'two'
                        },
                        name_2: {
                            firstName: 'alias3',
                            lastName: 'three'
                        }
                    }
                }
            };
            const expected = {
                name_0: {
                    firstName: 'alias1',
                    lastName: 'one'
                },
                name_2: {
                    firstName: 'alias3',
                    lastName: 'three'
                }
            };
            const ret = RemoveAlias.getContextData(req);

            assert.deepEqual(expected, ret.otherNames);
            done();
        });
    });

    describe('handlePost', function () {
        it('updates formdata from the context', function (done) {
            let ctx = {
                otherNames: {
                    name_0: {
                        firstName: 'alias1',
                        lastName: 'one'
                    },
                    name_1: {
                        firstName: 'alias2',
                        lastName: 'two'
                    },
                    name_2: {
                        firstName: 'alias3',
                        lastName: 'three'
                    }
                }
            };
            let errors = {};
            const formdata = {};
            const RemoveAlias = steps.RemoveAlias;
            [ctx, errors] = RemoveAlias.handlePost(ctx, errors, formdata);

            assert.deepEqual(ctx.otherNames, formdata.deceased.otherNames);
            done();
        });
    });
});
