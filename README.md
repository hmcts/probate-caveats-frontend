# Probate Caveats Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Caveat&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Caveat) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Caveat&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Caveat) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Caveat&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Caveat) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Caveat&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Caveat)

This is the frontend caveats application for the Probate Caveats online service. The service provides a clear interface for citizens, presented as sequence of HTML 5 web pages designed to GDS Service Design guidelines, so that they can check that they're eligible to apply for Caveats online..

## Overview

<p align="center">
<a href="https://github.com/hmcts/probate-frontend">probate-frontend</a> • <b><a href="https://github.com/hmcts/probate-caveats-frontend">probate-caveats-frontend</a></b> • <a href="https://github.com/hmcts/probate-back-office">probate-back-office</a> • <a href="https://github.com/hmcts/probate-orchestrator-service">probate-orchestrator-service</a> • <a href="https://github.com/hmcts/probate-business-service">probate-business-service</a> • <a href="https://github.com/hmcts/probate-submit-service">probate-submit-service</a> • <a href="https://github.com/hmcts/probate-persistence-service">probate-persistence-service</a>
</p>

<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/c4/probate/images/structurizr-probate-overview.png" width="800"/>
</p>

<details>
<summary>Citizen view</summary>
<img src="https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/c4/probate/images/structurizr-probate-citizen.png" width="700">
</details>
<details>
<summary>Caseworker view</summary>
<img src="https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/c4/probate/images/structurizr-probate-caseworker.png" width="700">
</details>

## Getting Started

### Prerequisites

- [Node.js](nodejs.org) >= 12.15.0
- [yarn](yarnpkg.com)

### Installation

Install dependencies by executing the following command:
```
$ yarn install
```

Compile SASS stylesheets by running the following command:
```
$ yarn setup
```

Build a `git.properties.json` by running the following command:
```
$ yarn git-info
```

Note. if setting up on an M1 with ARM architecure, and node-sass is not successfully installing, make sure you're using node version 15

Git hooks:

We have git hooks that enforce rules for commit messages.

These can be activated by running the following commands:
```
$ ln -s ../../pre-commit.sh .git/hooks/pre-commit
$ ln -s ../../commit-msg.sh .git/hooks/commit-msg
```

### Running the application

Run the application local server:
```
$ yarn start:ld
```

The application can be completed locally at [https://localhost:3000](https://localhost:3000), provided all services are running in the background as described in the next section.

add a dev.yaml file to the /config folder with contents if you want to run LauchDarkly locally

### Running the other services in Docker

To run probate-frontend with the other services locally you will need to clone and run the following services:

- probate-back-office: `https://github.com/hmcts/probate-back-office` - Follow the instructions in `probate-back-office/compose/README.md`.
- probate-orchestrator-service: `https://github.com/hmcts/probate-orchestrator-service` - Follow the instructions in `probate-orchestrator-service/README.md`
- probate-submit-service: `https://github.com/hmcts/probate-submit-service` - Follow the instructions in `probate-submit-service/README.md`

### Running the application locally with backend pointing to AAT
Install Redis to local machine i.e.
```
$ brew install Redis
```
Then run Redis server from where redis was installed to
```
$ redis-server
```
Run the application local server alongside Redis server:
```
$ yarn start:dev:ld:aat
```

The application can be completed locally at [https://localhost:3001](https://localhost:3001). Caveats will appear in AAT. 

## Developing
### Code style

Before submitting a Pull Request you will be required to run `$ yarn eslint` (which is also run automatically when trying to commit anyway).

We have a number of rules relating to code style that can be found in [.eslintrc.js](https://github.com/hmcts/probate-caveats-frontend/blob/develop/.eslintrc.js).

### Config

For development only config, rename the `config/dev_template.yaml` file to `config/dev.yaml`. Running the app with the node environment set to `dev` will ensure this file is used.
This file is not version controlled so any config here will not be pushed to git.

As an example, if you want to use LanuchDarkly locally, place the SDK Key in this file. You can keep the key there as this file is not version controlled.

### Running the tests

Mocha is used for writing tests.

The test suite can be run with:
`$ yarn test`

For unit tests:
`$ yarn test-unit`

For component tests:
`$ yarn test-component`

For accessibility tests:
`$ yarn test-accessibility`

For test coverage:
`$ yarn test:coverage`

#### Running tests on the pipeline
If you are concerned about the impact of your code changes, you may want to run a more comprehensive set of tests as
part of the PR build. To do this, you can add the appropriate label to the PR (in GitHub), as detailed below:
- `nightly`: This will run `yarn test:fullfunctional` command.
- `nightly-without-welsh-tests`: This will run `yarn test:fullfunctional` command but only in English language.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/hmcts/probate-caveats-frontend/blob/develop/LICENSE.md) file for details
