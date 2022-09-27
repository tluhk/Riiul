# Riiul API

This is the backend for the Riiul project

## Getting started

### Prerequisites

* node v14.18,
* npm v7.17

### Installation

1. Clone the repository

```shell
git clone https://github.com/Swackles/riiul-api
```

2. install npm packages

````shell
npm install
````

### Development

#### Tests

To run tests, use the `npm run test` command.

#### How to add tests

Tests are added into the `test` directory with same path as the file that is being tested. Tests also must end with `.test.ts` extension.

### Build & Run

1. Transpile typescript into js

````shell
npm run build
````

2. Set the environment variables, check the [environment variables](#environment-variables) section for more info
3. Run database migrations

````shell
npm run migrations
````

4. Run the app

````shell
npm run start
````

> File storage. The project stores files at root level in files folder, if the folder doesn't exist, it will create one.

## Environment variables

This project uses few environment variables described below

| name | type | default | description |
|---|---|---|:---|
| NODE_ENV | development, production, test | development | Used to define in what environment the application is running
| PORT | number | 8080 | Used to set the PORT of the application, defaults to 8080
| DATABASE_URL | string | undefined | This is used to connect to the database
| JWT_TOKEN | string | undefined | This is used to sign a JWT token
| SALT_ROUNDS | number | undefined | Used to generate the salt for password hashing
| ROLLBAR_TOKEN | string | undefined | Used to send errors to rollbar
