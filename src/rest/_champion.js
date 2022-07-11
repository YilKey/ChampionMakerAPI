const Router = require("@koa/router");
const Joi = require("joi");
const championService = require("../service/champion");
const validate = require("./_validation");
const {
  requireAuthentication,
  makeRequireRole,
} = require("../authentication/auth");
const Roles = require("../authentication/roles");
const { deleteChampionsByUser } = require("../repository/champion");

/**
 * @swagger
 *  tags:
 *   name: Champions
 *   description: Everything about champions
 */

//GET request:
/**
 * @swagger
 * /api/champions:
 *   get:
 *     tags:
 *     - Champions
 *     summary: Get all champions (paginated)
 *     description: Everyone can look up all champions available in our API.
 *     parameters:
 *     - $ref: "#/components/parameters/limitParam"
 *     - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: List of all champions available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ChampionList"
 */
const getAllChampions = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await championService.getAllChampions(limit, offset);
};
getAllChampions.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and("limit", "offset"),
};
// const getChampionById = async (ctx) => {
//   const id = ctx.params.id;
//   ctx.body = await championService.getById(id);
// };
/**
 * @swagger
 * /api/champions/name-{champname}:
 *   get:
 *     description: Everyone can look up a champion with its name.
 *     tags:
 *     - Champions
 *     summary: Get the champion with given name
 *     parameters:
 *     - $ref: "#/components/parameters/champParam"
 *     responses:
 *       200:
 *         description: Champion with given name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Champion"
 */
const getChampion = async (ctx) => {
  const name = ctx.params.name;
  ctx.body = await championService.getChampion(name);
};
getChampion.validationScheme = {
  params: {
    name: Joi.string().alphanum().required(),
  },
};
/**
 * @swagger
 * /api/champions/user-{user}:
 *   get:
 *     description: Everyone can look up a all champions from a particular user.
 *     parameters:
 *     - $ref: "#/components/parameters/userParam"
 *     tags:
 *     - Champions
 *     summary: Get all champions from given user
 *     responses:
 *       200:
 *         description: List of all champions from given user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserChampionList"
 */
const getChampionsFromUser = async (ctx) => {
  const user = ctx.params.user;
  ctx.body = await championService.getChampionsByUser(user);
};
getChampionsFromUser.validationScheme = {
  params: {
    user: Joi.string().alphanum().required(),
  },
};
//DELETE request:

/**
 * @swagger
 * /api/champions:
 *   delete:
 *     description: Only admins can delete all champions here.
 *     tags:
 *       - Champions
 *     security:
 *       - bearerAuth: []
 *     summary: Delete all champions existing
 *     responses:
 *       200:
 *         description: Count of deleted rows and 204 status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessItems"
 */
const deleteAllChampions = async (ctx) => {
  ctx.body = await championService.eraseAllChampions();
};
// const deleteChampionById = async (ctx) => {
//   const id = ctx.params.id;
//   ctx.body = await championService.eraseById(id);
// };

/**
 * @swagger
 * /api/champions/name-{champname}:
 *   delete:
 *     description: Only admins can delete a champion with its name here.
 *     parameters:
 *     - $ref: "#/components/parameters/champParam"
 *     tags:
 *       - Champions
 *     security:
 *       - bearerAuth: []
 *     summary: Delete champion with given name
 *     responses:
 *       200:
 *         description: Count of deleted rows and 204 status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessItems"
 *
 */
const deleteChampion = async (ctx) => {
  const name = ctx.params.name;
  ctx.body = await championService.eraseChampion(name);
};
deleteChampion.validationScheme = {
  params: {
    name: Joi.string().alphanum().required(),
  },
};

/**
 * @swagger
 * /api/champions/user-{user}:
 *   delete:
 *     description: Only admins can delete all champions from a particular user.
 *     parameters:
 *     - $ref: "#/components/parameters/userParam"
 *     tags:
 *       - Champions
 *     security:
 *       - bearerAuth: []
 *     summary: Delete all champions from given user
 *     responses:
 *       200:
 *         description: Count of deleted rows and 204 status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessItems"
 */
const deleteChampionsFromUser = async (ctx) => {
  const user = ctx.params.user;
  ctx.body = await championService.eraseChampionsByUser(user);
};
deleteChampionsFromUser.validationScheme = {
  params: {
    user: Joi.string().alphanum().required(),
  },
};
//POST request
/**
 * @swagger
 * /api/champions/user-{user}:
 *   post:
 *     parameters:
 *     - $ref: "#/components/parameters/userParam"
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new champion for given user
 *     description: Only admins can make champions for users without there premission here.
 *     tags:
 *      - Champions
 *     requestBody:
 *       $ref: "#/components/requestBodies/Champion"
 *     responses:
 *       200:
 *         description: The created champion for given user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessCreatedItem"
 */
const createChampion = async (ctx) => {
  const user = ctx.params.user;
  let data = ctx.request.body;
  data.user = user;
  ctx.body = await championService.makeChampion(data);
};
createChampion.validationScheme = {
  params: {
    user: Joi.string().alphanum().required(),
  },
  body: {
    name: Joi.string().alphanum().required(),
    disc: Joi.string()
      .max(255)
      .empty("")
      .default("no discription yet")
      .required(),
    type: Joi.string().alphanum().required(),
  },
};
//PUT request
/**
 * @swagger
 * /api/champions/{champname}:
 *   put:
 *     parameters:
 *     - $ref: "#/components/parameters/champParam"
 *     security:
 *       - bearerAuth: []
 *     summary: Upvote the rating of given champion.
 *     description: Only authenticated users can upvote the rating of a champion.
 *     tags:
 *      - Champions
 *     responses:
 *       200:
 *         description: The id and status from the newly made champion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessItems"
 */

const updateRating = async (ctx) => {
  ctx.body = await championService.changeRating(ctx.params.champname);
};

const requireAdmin = makeRequireRole(Roles.ADMIN);

module.exports = (app) => {
  const router = new Router({
    prefix: "/champions",
  });

  //===GET================================================================
  router.get("/", validate(getAllChampions.validationScheme), getAllChampions);
  // router.get("/id/:id", getChampionById);
  router.get(
    "/name-:name",
    validate(getChampion.validationScheme),
    getChampion
  );
  router.get(
    "/user-:user",
    validate(getChampionsFromUser.validationScheme),
    getChampionsFromUser
  );
  //===DELETE=============================================================
  router.delete("/", requireAuthentication, requireAdmin, deleteAllChampions);
  // router.delete("/id/:id", deleteChampionById);
  router.delete(
    "/name-:name",
    requireAuthentication,
    requireAdmin,
    validate(deleteChampion.validationScheme),
    deleteChampion
  );
  router.delete(
    "/user-:user",
    requireAuthentication,
    requireAdmin,
    validate(deleteChampionsFromUser.validationScheme),
    deleteChampionsFromUser
  );
  //===POST===============================================================
  router.post(
    "/user-:user",
    requireAuthentication,
    requireAdmin,
    validate(createChampion.validationScheme),
    createChampion
  );
  //==PUT=================================================================
  router.put("/:champname", requireAuthentication, updateRating);
  app.use(router.routes()).use(router.allowedMethods());
};
