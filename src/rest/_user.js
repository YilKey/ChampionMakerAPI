const Router = require("@koa/router");
const userService = require("../service/user");
const validate = require("./_validation");
const {
  requireAuthentication,
  makeRequireRole,
} = require("../authentication/auth");
const Roles = require("../authentication/roles");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

/**
 * @swagger
 *  tags:
 *   name: Users
 *   description: Everything about users
 */

//GET request

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *     - Users
 *     summary: Get all users (paginated)
 *     description: Only admins can ask for all users at once.
 *     parameters:
 *     - $ref: "#/components/parameters/limitParam"
 *     - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: List of all users available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserList"
 */
const getAllUsers = async (ctx) => {
  let limit = ctx.query.limit && Number(ctx.query.limit);
  let offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await userService.getAllUsers(limit, offset);
};
getAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and("limit", "offset"),
};
// const getUserById = async (ctx) => {
//   const id = ctx.params.id;
//   ctx.body = await userService.getById(id);
// };

/**
 * @swagger
 * /api/users/{user}:
 *   get:
 *     description: Only authenticated users can look up eachothers account information.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *     - Users
 *     summary: Get the user with given name
 *     parameters:
 *     - $ref: "#/components/parameters/userParam"
 *     responses:
 *       200:
 *         description: User with given name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
const getUser = async (ctx) => {
  const name = ctx.params.user;
  ctx.body = await userService.getUser(name);
};
getUser.validationScheme = {
  params: {
    user: Joi.string().alphanum().required(),
  },
};

/**
 * @swagger
 * /api/users/{user}/champions:
 *   get:
 *     description: Only authenticated users can look up all the champions of a user.
 *     tags:
 *     - Users
 *     security:
 *       - bearerAuth: []
 *     summary: Get the all the champions from a user
 *     parameters:
 *     - $ref: "#/components/parameters/userParam"
 *     responses:
 *       200:
 *         description: All champions from user with given name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserChampionList"
 */
const getUserChampions = async (ctx) => {
  const username = ctx.params.user;
  ctx.body = await userService.getUserChampions(username);
};
getUserChampions.validationScheme = {
  params: {
    user: Joi.string().alphanum().required(),
  },
};

/**
 * @swagger
 * /api/users/{user}/champions/{champname}:
 *   get:
 *     description: Only authenticated users can look up a champions of a user.
 *     tags:
 *     - Users
 *     security:
 *       - bearerAuth: []
 *     summary: Get the champion from user
 *     parameters:
 *     - $ref: "#/components/parameters/userParam"
 *     - $ref: "#/components/parameters/champParam"
 *     responses:
 *       200:
 *         description: The champion with given name from a user which is also given.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Champion"
 */
const getUserChampion = async (ctx) => {
  const username = ctx.params.user;
  const champname = ctx.params.champname;
  ctx.body = await userService.getUserChampion(username, champname);
};
getUserChampion.validationScheme = {
  params: {
    user: Joi.string().alphanum().required(),
    champname: Joi.string().alphanum().required(),
  },
};
//DELETE request

/**
 * @swagger
 * /api/users:
 *   delete:
 *     description: Only admins can delete all users here.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     summary: Delete all existing users
 *     responses:
 *       200:
 *         description: Count of deleted rows and 204 status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessItems"
 */
const deleteAllUsers = async (ctx) => {
  ctx.body = await userService.eraseAllUsers();
};
// const deleteUserById = async (ctx) => {
//   const id = ctx.params.id;
//   ctx.body = await userService.eraseById(id);
// };

/**
 * @swagger
 * /api/users/{user}:
 *   delete:
 *     description: Only authenticated users can delete an account.
 *     parameters:
 *     - $ref: "#/components/parameters/userParam"
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     summary: Delete user with given name
 *     responses:
 *       200:
 *         description: Count of deleted rows and 204 status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessItems"
 */
const deleteUser = async (ctx) => {
  const name = ctx.params.user;
  ctx.body = await userService.eraseUser(name);
};
deleteUser.validationScheme = {
  params: {
    user: Joi.string().alphanum().required(),
  },
};

/**
 * @swagger
 * /api/users/{user}/champions:
 *   delete:
 *     description: Only authenticated users can delete all champions from an user.
 *     parameters:
 *     - $ref: "#/components/parameters/userParam"
 *     tags:
 *       - Users
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
const deleteUserChampions = async (ctx) => {
  const username = ctx.params.user;
  ctx.body = await userService.eraseUserChampions(username);
};
deleteUserChampions.validationScheme = {
  params: {
    user: Joi.string().alphanum().required(),
  },
};
/**
 * @swagger
 * /api/users/{user}/champions/{champname}:
 *   delete:
 *     description: Only authenticated users can delete a champions from an user.
 *     parameters:
 *     - $ref: "#/components/parameters/userParam"
 *     - $ref: "#/components/parameters/champParam"
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a champions with given name from given user
 *     responses:
 *       200:
 *         description: Count of deleted rows and 204 status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessItems"
 */
const deleteUserChampion = async (ctx) => {
  const username = ctx.params.user;
  const champname = ctx.params.champname;
  ctx.body = await userService.eraseUserChampion(username, champname);
};
deleteUserChampion.validationScheme = {
  params: {
    user: Joi.string().alphanum().required(),
    champname: Joi.string().alphanum().required(),
  },
};
//POST request
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Create a new account
 *     description: Everyone can register for free.
 *     tags:
 *      - Users
 *     requestBody:
 *       $ref: "#/components/requestBodies/User"
 *     responses:
 *       200:
 *         description: The created champion for given user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccesRegisterLogin"
 */
const createUser = async (ctx) => {
  ctx.body = await userService.makeUser(ctx.request.body);
};
const complexityOptions = {
  min: 5,
  max: 100,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 5,
};
createUser.validationScheme = {
  body: {
    name: Joi.string().alphanum().required(),
    email: Joi.string().email().required(),
    password: passwordComplexity(complexityOptions, "password"),
  },
};
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login on your account
 *     description: Only people who have a account can login.
 *     tags:
 *      - Users
 *     requestBody:
 *       $ref: "#/components/requestBodies/UserLogin"
 *     responses:
 *       200:
 *         description: The login information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccesRegisterLogin"
 */
const loginUser = async (ctx) => {
  const { email, password } = ctx.request.body;
  const session = await userService.login(email, password);
  ctx.body = session;
};
loginUser.validationScheme = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
};
/**
 * @swagger
 * /api/users/{user}/champions:
 *   post:
 *     parameters:
 *     - $ref: "#/components/parameters/userParam"
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new champion for given user
 *     description: Only admins can make champions for users without there premission here.
 *     tags:
 *      - Users
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
const createUserChampion = async (ctx) => {
  const nieuweChampion = ctx.request.body;
  nieuweChampion.user = ctx.params.user;
  ctx.body = await userService.makeUserChampion(nieuweChampion);
};
createUserChampion.validationScheme = {
  params: {
    user: Joi.string().alphanum().required(),
  },
  body: {
    name: Joi.string().alphanum().required(),
    disc: Joi.string()
      .max(255)
      .allow("", null)
      .default("No discription yet :)"),
    type: Joi.string().alphanum().required(),
  },
};
//PUT request
/**
 * @swagger
 * /api/users/{user}/champions/{champname}:
 *   put:
 *     parameters:
 *     - $ref: "#/components/parameters/userParam"
 *     - $ref: "#/components/parameters/champParam"
 *     security:
 *       - bearerAuth: []
 *     summary: Change champion information
 *     description: Only authenticated users can change champion information
 *     tags:
 *      - Users
 *     requestBody:
 *       $ref: "#/components/requestBodies/ChampionEdit"
 *     responses:
 *       200:
 *         description: The rows that are edited and status 204
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessItems"
 */
const updateUserChampion = async (ctx) => {
  const nieuweChampion = ctx.request.body;
  nieuweChampion.user = ctx.params.user;
  nieuweChampion.name = ctx.params.champname;
  ctx.body = await userService.changeUserChampion(nieuweChampion);
};
updateUserChampion.validationScheme = {
  params: {
    user: Joi.string().alphanum().required(),
    champname: Joi.string().alphanum().required(),
  },
  body: {
    disc: Joi.string().max(255).allow("", null).required(),
    type: Joi.string().alphanum().required(),
  },
};

const requireAdmin = makeRequireRole(Roles.ADMIN);
module.exports = (app) => {
  const router = new Router({
    prefix: "/users",
  });

  //===GET================================================================
  router.get("/", getAllUsers);
  // router.get("/id-:id", getUserById);
  router.get(
    "/:user",
    requireAuthentication,
    validate(getUser.validationScheme),
    getUser
  );
  router.get(
    "/:user/champions",
    requireAuthentication,
    validate(getUserChampions.validationScheme),
    getUserChampions
  );
  router.get(
    "/:user/champions/:champname",
    requireAuthentication,
    validate(getUserChampion.validationScheme),
    getUserChampion
  );
  //===DELETE=============================================================
  router.delete("/", requireAuthentication, requireAdmin, deleteAllUsers);
  // router.delete("/id-:id", deleteUserById);
  router.delete(
    "/:user",
    requireAuthentication,
    validate(deleteUser.validationScheme),
    deleteUser
  );
  router.delete(
    "/:user/champions",
    requireAuthentication,
    validate(deleteUserChampions.validationScheme),
    deleteUserChampions
  );
  router.delete(
    "/:user/champions/:champname",
    requireAuthentication,
    validate(deleteUserChampion.validationScheme),
    deleteUserChampion
  );
  //===POST===============================================================
  router.post("/register", validate(createUser.validationScheme), createUser);
  router.post("/login", validate(loginUser.validationScheme), loginUser);
  router.post(
    "/:user/champions",
    requireAuthentication,
    validate(createUserChampion.validationScheme),
    createUserChampion
  );
  //==PUT=================================================================
  router.put(
    "/:user/champions/:champname",
    requireAuthentication,
    validate(updateUserChampion.validationScheme),
    updateUserChampion
  );
  app.use(router.routes()).use(router.allowedMethods());
};
