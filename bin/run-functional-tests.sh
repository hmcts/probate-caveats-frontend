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
    mkdir -p output
    touch output/mochawesome.html
fi

#below 2 lines for function test output in cnp pipeline
mkdir -p functional-output
cp -r output/mochawesome.* functional-output/. 2>/dev/null
