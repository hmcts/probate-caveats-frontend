#!/bin/bash
set -ex

export TEST_E2E_URL=$(echo ${TEST_URL})

if [[ "$TEST_URL" = "https://probate-caveats-fe-aat.service.core-compute-aat.internal" ]] ||
        [[ "$TEST_URL" = "https://probate-caveats-fe-aat.service.core-compute-aat.internal/" ]] ||
        [[ "$TEST_URL" = "https://probate-caveats-fe-aat-staging.service.core-compute-aat.internal" ]] ||
        [[ "$TEST_URL" = "https://probate-caveats-fe-aat-staging.service.core-compute-aat.internal/" ]] ||
        [[ "$TEST_URL" = "http://probate-caveats-fe-aat-staging.service.core-compute-aat.internal" ]] ;
then
    export TEST_E2E_URL=$(echo "https://probate.aat.platform.hmcts.net")
fi

if [ "$RUN_E2E_TEST" = true ] ;
then
    yarn test-e2e
else
    mkdir -p functional-output
    touch functional-output/mochawesome.html
fi