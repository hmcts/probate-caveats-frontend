# Probate Caveats Frontend

This is the frontend caveats application for the Probate Caveats online service. The service provides a clear interface for citizens, presented as sequence of HTML 5 web pages designed to GDS Service Design guidelines, so that they can check that they're eligible to apply for Caveats online.

## Getting Started

### Prerequisites

- [Node.js](nodejs.org) >= 8.9.0
- [yarn](yarnpkg.com)

### Installation


Install dependencies by executing the following command:

```
$ yarn install
```

Sass:

```
$ yarn setup
```

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
$ yarn start
```

Open [https://localhost:3000](https://localhost:3000) in a browser

## Developing

### Code style

Before submitting a Pull Request you will be required to run:
`$ yarn eslint`

We have a number of rules relating to code style that can be found in [.eslintrc.js](https://github.com/hmcts/probate-caveats-frontend/blob/develop/.eslintrc.js).

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
`$ yarn test-coverage`

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/hmcts/probate-caveats-frontend/blob/develop/LICENSE.md) file for details
