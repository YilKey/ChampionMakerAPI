const config = require("config");
const { buildDevLogger } = require("./dev-logger");
const { buildProdLogger } = require("./prod-logger");
const NODE_ENV = config.get("env");
const emoji = require("node-emoji");

let logger = null;
if (NODE_ENV === "development" || NODE_ENV === "test") {
  logger = buildDevLogger();
  if (logger != null) {
    logger.info(`${emoji.get("white_check_mark")} Logger is ready for use!`);
  }
} else {
  logger = buildProdLogger();
}

module.exports = logger;
