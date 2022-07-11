const Router = require("@koa/router");
const installUserRouter = require("./_user");
const installTypesRouter = require("./_type");
const installChampionRouter = require("./_champion");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   security:
 *      - bearerAuth: []
 *   parameters:
 *     limitParam:
 *       in: query
 *       name: limit
 *       description: Maximum amount of items to return
 *       required: false
 *       schema:
 *         type: integer
 *         default: 50
 *     offsetParam:
 *       in: query
 *       name: offset
 *       description: Number of items to skip
 *       required: false
 *       schema:
 *         type: integer
 *         default: 0
 *     champParam:
 *       in: path
 *       name: champname
 *       description: The name of a champion
 *       required: true
 *       schema:
 *         type: string
 *     userParam:
 *       in: path
 *       name: user
 *       description: The name of a user
 *       required: true
 *       schema:
 *         type: string
 *     typeParam:
 *       in: path
 *       name: name
 *       description: The name of a type, must be an existing type
 *       required: true
 *       schema:
 *         type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Type:
 *       required:
 *         - typeID
 *         - typeName
 *         - typeDiscription
 *       properties:
 *         typeID:
 *           type: integer
 *           format: auto_increment
 *           example: 1
 *         typeName:
 *           type: "string"
 *           example: "Mage"
 *         typeDiscription:
 *           type: "string"
 *           example: "Someone who uses magic in combat"
 *     ListResponse:
 *       required:
 *         - limit
 *         - offset
 *       properties:
 *         limit:
 *           type: integer
 *           description: Limit actually used
 *           example: 10
 *         offset:
 *           type: integer
 *           description: Offset actually used
 *           example: 1
 *     User:
 *       required:
 *         - userID
 *         - userName
 *         - email
 *       properties:
 *         userID:
 *           type: integer
 *           format: auto_increment
 *           example: 1
 *         userName:
 *           type: "string"
 *           example: "Kerem"
 *         email:
 *           type: "string"
 *           format: email
 *           example: "kerem.yilmaz@test.be"
 *     UserEmailRoles:
 *       required:
 *         - email
 *         - roles
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: kerem.test@ex.be
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             example: user, admin
 *     Champion:
 *       required:
 *         - championID
 *         - championName
 *         - championDiscription
 *         - championType
 *         - championRating
 *         - fromUser
 *       properties:
 *         championID:
 *           type: integer
 *           format: auto_increment
 *           example: 1
 *         championName:
 *           type: "string"
 *           example: "Leblanc"
 *         championDiscription:
 *           type: "string"
 *           example: "She is a mage from League of Legends"
 *         championType:
 *           $ref: "#/components/schemas/Type"
 *           example: "Mage"
 *         championRating:
 *           type: "string"
 *           example: 100
 *         fromUser:
 *           $ref: "#/components/schemas/User"
 *     ChampionList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Champion"
 *     UserChampionList:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Champion"
 *     TypeList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Type"
 *     UserList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *     SuccessItems:
 *       required:
 *         - rows
 *         - status
 *       properties:
 *         rows:
 *           type: integer
 *           example: 1
 *         status:
 *           type: integer
 *           example: 204
 *     SuccessCreatedItem:
 *       required:
 *         - id
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         status:
 *           type: integer
 *           example: 204
 *     SuccesRegisterLogin:
 *       required:
 *         - user
 *         - token
 *         - status
 *       properties:
 *         user:
 *           $ref: "#/components/schemas/UserEmailRoles"
 *         token:
 *           type: string
 *           format: beared token
 *           example: "eyJyb2xlcyI6WyJhZG1pbiIsInVzZXIiXSwiaWF0IjoxNjQwMDk3M ..."
 *         status:
 *           type: integer
 *           example: 204
 *
 *
 *   requestBodies:
 *     Champion:
 *       description: The Champion info to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Rengar"
 *               disc:
 *                 type: string
 *                 example: "He is a lion who can ambush you from a bush"
 *               type:
 *                 type: string
 *                 example: "Assasin"
 *     ChampionEdit:
 *       description: The Champion info to edit
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disc:
 *                 type: string
 *                 example: "New discription"
 *               type:
 *                 type: string
 *                 example: "Broer"
 *     Type:
 *       description: The type info to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Healer"
 *               disc:
 *                 type: string
 *                 example: "This is a type discription"
 *     User:
 *       description: The user info to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Test User"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "test.mail@test.be"
 *               password:
 *                 type: string
 *                 example: "Aa1?b"
 *     UserLogin:
 *       description: The user info to login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "test.mail@test.be"
 *               password:
 *                 type: string
 *                 example: "Aa1?b"
 */

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/api",
  });

  installUserRouter(router);
  installTypesRouter(router);
  installChampionRouter(router);
  app.use(router.routes()).use(router.allowedMethods());
};
