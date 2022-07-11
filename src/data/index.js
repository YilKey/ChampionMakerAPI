const config = require("config");
const knex = require("knex");
const logger = require("../logger");
const { join } = require("path");
const emoji = require("node-emoji");

const NODE_ENV = config.get("env");
const isDevelopment = NODE_ENV === "development"; //om te checken of je in dev mode bent

const DATABASE_CLIENT = config.get("database.client");
const DATABASE_NAME = config.get("database.name");
const DATABASE_HOST = config.get("database.host");
const DATABASE_PORT = config.get("database.port");
const DATABASE_USERNAME = config.get("database.username");
const DATABASE_PASSWORD = config.get("database.password");

let knexInstance;

async function initializeData() {
  const log = logger;
  const knexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: isDevelopment,
    },
    migrations: {
      tableName: "knex_meta",
      directory: join("src", "data", "migrations"),
    },
    seeds: {
      directory: join("src", "data", "seeds"),
    },
  };

  knexInstance = knex(knexOptions);

  try {
    await knexInstance.raw("select 1+1 as result");
    await knexInstance.raw(`create database if not exists ${DATABASE_NAME}`);
    await knexInstance.destroy();

    knexOptions.connection.database = DATABASE_NAME;
    knexInstance = knex(knexOptions);
    await knexInstance.raw("select 1+1 as result");
  } catch (error) {
    log.error(error.message, { error });
    throw new Error("Could not initialize the data layer");
  }

  let migrationsFailed = true;
  try {
    await knexInstance.migrate.latest();
    migrationsFailed = false;
  } catch (error) {
    log.error("Error while migrating the database", error);
  }

  if (migrationsFailed) {
    try {
      await knexInstance.migrate.down();
    } catch (error) {
      log.error("Error while undoing last migrating", error);
    }

    throw new Error("Migrations failed");
  }

  if (isDevelopment) {
    try {
      await knexInstance.seed.run();
    } catch (error) {
      log.error("Error while seeding database", error);
    }
  }

  log.info(`${emoji.get("white_check_mark")} Data layer initialized`);
  return knexInstance;
}

async function shutdownData() {
  const log = logger;
  log.info("Shutting down database connection");

  await knexInstance.destroy();
  knexInstance = null;

  log.info("Database connection closed");
}

function getKnex() {
  if (!knexInstance) throw new Error("Please initilize datalayer");
  return knexInstance;
}

const tables = Object.freeze({
  champion: "champions",
  user: "users",
  type: "types",
});

module.exports = {
  initializeData,
  getKnex,
  tables,
  shutdownData,
};
