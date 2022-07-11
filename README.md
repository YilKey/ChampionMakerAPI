# Championmaker API

Copyright Owner Kerem Yilmaz 2021

## What is championmaker ?

Championmaker is a API where your imagination is the limit of creation. It is a place where you can design and make a fictional champion. You only have to register an account and you are ready to go.

This API was a school project where the task was to make a small but working API with enough complexity.

> Championmaker is available untill the 27th of Decemeber 2021.

- _Close-source project_:

  This API is a private project but you may clone and run this repository locally.

## How to use Championmaker API

### Championmaker API documentation

The API documentation can be found [here](https://kerem-championmaker.herokuapp.com/api/swagger)

### Before installing ChampionMaker API you need

- Git
- Node.js v16.13.0. (at least)

### How to run the API

To start this API, create a `.env` file in the root of this folder with this content

```
NODE_ENV="development"
DATABASE_USERNAME="root"
DATABASE_PASSWORD="root"
PORT="9000"
```

Update the username and password with the credentials of your local database.
You can also change the port on which the app will listen to.

### Used scripts

Run the app with `yarn start`.

Run the test of the app with `yarn test` or `yarn test:coverage`

## Common errors

- Modules not found errors, try this and run again:

```
yarn install
```

- Migrations failed, try dropping the existing `championmaker` database and run again

* If you find any bugs, you may make a new issue for this project with the tag: **bugs**
