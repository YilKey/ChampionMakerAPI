const Koa = require("koa");
const config = require("config");
const koaCors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const logger = require("./logger");
const emoji = require("node-emoji");
const { serializeError } = require("serialize-error");
const ServiceError = require("./errorHandling/serviceError");

const installRest = require("./rest");
const { initializeData, shutdownData } = require("./data/index.js");

const NODE_ENV = config.get("env");
const CORS_ORIGINS = config.get("cors.origins");
const CORS_MAX_AGE = config.get("cors.maxAge");
const PATH = config.get("url.path");
const PORT = config.get("url.port");

const swaggerJsdoc = require("swagger-jsdoc");
const { koaSwagger } = require("koa2-swagger-ui");
const swaggerOptions = require("../swagger.config");

module.exports = async function createServer() {
  await initializeData();

  const app = new Koa();
  // Add CORS
  app.use(
    koaCors({
      origin: (ctx) => {
        if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
          return ctx.request.header.origin;
        }
        // Not a valid domain at this point, let's return the first valid as we should return a string
        return CORS_ORIGINS[0];
      },
      allowHeaders: ["Accept", "Content-Type", "Authorization"],
      maxAge: CORS_MAX_AGE,
    })
  );
  const log = logger;
  app.use(bodyParser());

  const spec = swaggerJsdoc(swaggerOptions);
  app.use(
    koaSwagger({
      routePrefix: "/swagger",
      specPrefix: "/swagger/spec",
      exposeSpec: true,
      swaggerOptions: {
        spec,
      },
    })
  );

  app.use(async (ctx, next) => {
    const log = logger;
    log.info(`${emoji.get("fast_forward")} ${ctx.method} ${ctx.url}`);

    const getStatusEmoji = () => {
      if (ctx.status >= 500) return emoji.get("skull");
      if (ctx.status >= 400) return emoji.get("x");
      if (ctx.status >= 300) return emoji.get("rocket");
      if (ctx.status >= 200) return emoji.get("white_check_mark");
      return emoji.get("rewind");
    };

    try {
      await next();

      log.info(`${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`);
    } catch (error) {
      log.error(`${emoji.get("x")} ${ctx.method} ${ctx.status} ${ctx.url}`, {
        error,
      });

      throw error;
    }
  });

  app.use(async (ctx, next) => {
    try {
      await next();

      if (ctx.status === 404) {
        ctx.body = {
          code: "NOT_FOUND",
          message: `Unknown resource: ${ctx.url}`,
        };
      }
    } catch (error) {
      const log = logger;
      log.error("Error occured while handling a request", {
        error: serializeError(error),
      });

      let statusCode = error.status || 500;
      let errorBody = {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: error.message,
        details: error.details || {},
        stack: NODE_ENV !== "production" ? error.stack : undefined,
      };

      if (error instanceof ServiceError) {
        if (error.isNotFound) {
          statusCode = 404;
        }

        if (error.isValidationFailed) {
          statusCode = 400;
        }

        if (error.isUnauthorized) {
          statusCode = 401;
        }

        if (error.isForbidden) {
          statusCode = 403;
        }
      }

      ctx.status = statusCode;
      ctx.body = errorBody;
    }
  });

  installRest(app);
  return {
    getApp() {
      return app;
    },
    async start() {
      return new Promise((resolve) => {
        app.listen(PORT);
        log.info(`${emoji.get("ear")} Server listening on ${PATH}${PORT}`);
        resolve();
      });
    },
    async stop() {
      app.removeAllListeners();
      await shutdownData();
      log.info("Goodbye");
    },
  };
};
