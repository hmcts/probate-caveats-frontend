#!/bin/bash
set -ex

export TEST_E2E_URL=$(echo ${TEST_URL})

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
