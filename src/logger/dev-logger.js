const { format, createLogger, transports } = require("winston");
const { timestamp, combine, printf, errors } = format;

//custom format
function buildDevLogger() {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level} <=> ${stack || message}`;
  });

  return createLogger({
    level: "silly",
    format: combine(
      //kleur geven aan levels
      format.colorize(),
      //tijd formatie in log
      timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
      //stack trace aan zetten als er een error is
      errors({ stack: true }),
      logFormat
    ),
    //naar waar schrijven we onze logs
    transports: [
      //naar de console schrijven
      new transports.Console(),
    ],
  });
}

module.exports = {
  buildDevLogger,
};
