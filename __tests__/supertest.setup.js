const supertest = require("supertest");
const createServer = require("../src/createServer");
const { getKnex, tables } = require("../src/data");

module.exports.withServer = (setter) => {
  let server;

  beforeAll(async () => {
    server = await createServer();
    setter({
      request: supertest(server.getApp().callback()),
      knex: getKnex(),
    });
  });

  afterAll(async () => {
    await server.stop();
  });
};

module.exports.login = async (supertest) => {
  const response = await supertest.post("/api/users/login").send({
    email: "efe.yilmaz@test.be",
    password: "efe",
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || "unknown error occured");
  }

  return `Bearer ${response.body.token}`;
};

module.exports.loginAdmin = async (supertest) => {
  const response = await supertest.post("/api/users/login").send({
    email: "kerem.yilmaz@test.be",
    password: "kerem",
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || "unknown error occured");
  }

  return `Bearer ${response.body.token}`;
};
