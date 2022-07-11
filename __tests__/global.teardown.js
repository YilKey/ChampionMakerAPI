const { shutdownData, getKnex, tables } = require("../src/data");

module.exports = async () => {
  await getKnex()(tables.champion).delete();
  await getKnex()(tables.user).delete();
  await getKnex()(tables.type).delete();
  await shutdownData();
};
