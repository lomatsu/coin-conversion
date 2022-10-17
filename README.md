# coin-conversion (Back-end)

O [coin-conversion] é que consulta a api Exchange Rates [https://apilayer.com/marketplace/exchangerates_data-api#details-tab] com a finalidade de obter as taxas de cambio atuais para que o usuário converta o valor da moeda que desejar em tempo real.

Ambientes:

- Production - []()
- Local - [http://localhost:3000/api/](http://localhost:3000/api/)


## Contents

- [coin-conversion (Back-end)](#coin-conversion-back-end)
  - [Contents](#contents)
  - [Structure](#structure)
  - [Usage](#usage)

## Structure

Projeto escrito utilizando [NodeJS](https://nodejs.org/en/), [Express](https://expressjs.com/) and [Typescript](https://www.typescriptlang.org/).

```
.husky
src
  |_ bin
  |_ common
  |_ config
  |_ database
  |     |_helps
  |     |_ migrations
  |     |_ model
  |     |_ seeds
  |_ repositories
  |_ routes
app.ts
.env.example
.dockerignore
.editorconfig
.gitignore
docker-compose.yml
docker-compose.yml
Dockerfile
Jenkinsfile
jest.config
package.json
README.md
tsconfig.json
yarn.lock
```

## Usage

```bash

# run develop

yarn start:dev

# unit tests

yarn test

# lint project

yarn lint

# e2e tests

yarn test:e2e

# build

yarn build

# run production

yarn start

# run migrations

yarn knex:prod:migrate

# run seeds

yarn knex:prod:seed

```

**Docker**

Rodando projeto localmente com docker

```bash

# running through facilitator

docker-compose -f ./docker-compose.yml up -d database

# build

yarn build

# run develop

yarn start:dev

# run production

yarn start


```

