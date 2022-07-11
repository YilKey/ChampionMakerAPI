const Router = require("@koa/router");
const typeService = require("../service/type");
const validate = require("./_validation");
const Joi = require("joi");
const {
  requireAuthentication,
  makeRequireRole,
} = require("../authentication/auth");
const Roles = require("../authentication/roles");

/**
 * @swagger
 *  tags:
 *   name: Types
 *   description: Everything about types
 */

//GET request:

/**
 * @swagger
 * /api/types:
 *   get:
 *     tags:
 *     - Types
 *     summary: Get all types (paginated)
 *     description: Everyone can look up all types available in our API.
 *     parameters:
 *     - $ref: "#/components/parameters/limitParam"
 *     - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: List of all types available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TypeList"
 */
const getAllTypes = async (ctx) => {
  let limit = ctx.query.limit && Number(ctx.query.limit);
  let offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await typeService.getAllTypes(limit, offset);
};
getAllTypes.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and("limit", "offset"),
};

// const getTypeById = async (ctx) => {
//   const id = ctx.params.id;
//   ctx.body = await typeService.getById(id);
// };
/**
 * @swagger
 * /api/types/{name}:
 *   get:
 *     description: Everyone can look up the existing champion types here.
 *     tags:
 *     - Types
 *     summary: Get the type with given name
 *     parameters:
 *     - $ref: "#/components/parameters/typeParam"
 *     responses:
 *       200:
 *         description: Type with given name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Type"
 */

const getType = async (ctx) => {
  const name = ctx.params.name;
  ctx.body = await typeService.getType(name);
};
getType.validationScheme = {
  params: {
    name: Joi.string().alphanum().required(),
  },
};

//DELETE request:
/**
 * @swagger
 * /api/types:
 *   delete:
 *     description: Only admins can delete all types here.
 *     tags:
 *       - Types
 *     security:
 *       - bearerAuth: []
 *     summary: Delete all types existing
 *     responses:
 *       200:
 *         description: Count of deleted rows and 204 status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessItems"
 */

const deleteAllTypes = async (ctx) => {
  ctx.body = await typeService.eraseAllTypes();
};
// const deleteTypeById = async (ctx) => {
//   const id = ctx.params.id;
//   ctx.body = await typeService.eraseById(id);
// };

/**
 * @swagger
 * /api/types/{name}:
 *   delete:
 *     description: Only admins can delete a type with its name here.
 *     parameters:
 *     - $ref: "#/components/parameters/typeParam"
 *     tags:
 *       - Types
 *     security:
 *       - bearerAuth: []
 *     summary: Delete type with given name
 *     responses:
 *       200:
 *         description: Count of deleted rows and 204 status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessItems"
 */
const deleteType = async (ctx) => {
  const name = ctx.params.name;
  ctx.body = await typeService.eraseType(name);
};
deleteType.validationScheme = {
  params: {
    name: Joi.string().alphanum().required(),
  },
};
//POST request
/**
 * @swagger
 * /api/types:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new type
 *     description: Only admins can make types for champion here.
 *     tags:
 *      - Types
 *     requestBody:
 *       $ref: "#/components/requestBodies/Type"
 *     responses:
 *       200:
 *         description: The created type's id and status 204
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessCreatedItem"
 */
const createType = async (ctx) => {
  ctx.body = await typeService.makeType(ctx.request.body);
};
createType.validationScheme = {
  body: {
    typename: Joi.string().alphanum().required(),
    typediscription: Joi.string().max(255).required(),
  },
};

const requireAdmin = makeRequireRole(Roles.ADMIN);

module.exports = (app) => {
  const router = new Router({
    prefix: "/types",
  });

  //===GET================================================================
  router.get("/", validate(getAllTypes.validationScheme), getAllTypes);
  // router.get("/id/:id", getTypeById);
  router.get("/:name", validate(getType.validationScheme), getType);
  //===DELETE=============================================================
  router.delete("/", requireAuthentication, requireAdmin, deleteAllTypes);
  // router.delete("/id/:id", deleteTypeById);
  router.delete(
    "/:name",
    requireAuthentication,
    requireAdmin,
    validate(deleteType.validationScheme),
    deleteType
  );
  //===POST===============================================================
  router.post(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(createType.validationScheme),
    createType
  );
  app.use(router.routes()).use(router.allowedMethods());
};
