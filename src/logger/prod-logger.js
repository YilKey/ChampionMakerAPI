const { format, createLogger, transports } = require("winston");
const { timestamp, combine, errors, json, printf } = format;

function buildProdLogger() {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} | ${level}: ${stack || message} | dev mode`;
  });

  return createLogger({
    level: "info",
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: "user-service" },
    transports: [
      new transports.Console(),
      new transports.File({ filename: "combined.log" }),
    ],
  });
}

module.exports = {
  buildProdLogger,
};
