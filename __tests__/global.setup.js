const { initializeData, getKnex, tables } = require("../src/data");
const logger = require("../src/logger");
const { data } = require("./rest/mock-data");

module.exports = async () => {
  await initializeData();
  const knex = getKnex();

  await knex(tables.user).insert(data.users);
  await knex(tables.type).insert(data.types);
  await knex(tables.champion).insert(data.champions);
};
