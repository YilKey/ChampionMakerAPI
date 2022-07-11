const { tables } = require("../../src/data");
const { withServer, login, loginAdmin } = require("../supertest.setup");
const { data, deleteData } = require("./mock-data");

describe.only("users", () => {
  let request;
  let knex;
  let loginHeaderUser;
  let loginHeaderAdmin;

  withServer(({ request: r, knex: k }) => {
    request = r;
    knex = k;
  });

  beforeAll(async () => {
    loginHeaderUser = await login(request);
    loginHeaderAdmin = await loginAdmin(request);
  });

  const url = "/api/types";

  describe("GET /api/types", () => {
    it("should 200 and return all types", async () => {
      const response = await request
        .get(url)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(50); //default
      expect(response.body.offset).toBe(0); //default
    });

    test("should 200 and return 2 types with offest 1", async () => {
      const response = await request
        .get(`${url}?limit=2&offset=1`)
        .set("Authorization", loginHeaderAdmin);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
    });
  });

  describe("GET /api/types/:name", () => {
    it("should 200 and give the client the type he wants", async () => {
      const typename = "broer";
      const response = await request
        .get(`${url}/${typename}`)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.typeID).toBeTruthy();
      expect(response.body.typeName).toBe("Broer");
      expect(response.body.typeDiscription).toBe("Dit is mijn broer");
    });

    it("should 200 and return information bout the typename which does not exist", async () => {
      const typename = "bestaatniet";
      const response = await request
        .get(`${url}/${typename}`)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.info).toBe(
        `Type with name: ${typename} could not be found`
      );
      expect(response.body.status).toBe(404);
    });

    it("should 400 and and return validation information", async () => {
      const typename = -10;
      const response = await request
        .get(`${url}/${typename}`)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.message).toBe(
        "Validation failed, check details for more information"
      );
      expect(response.body.details.params.name[0]).toStrictEqual({
        type: "string.alphanum",
        message: '"name" must only contain alpha-numeric characters',
      });
    });
  });

  describe("POST /api/types", () => {
    it("should 200 and give back the id of the newly made type", async () => {
      const type = {
        typename: "bestaatNiet",
        typediscription: "test discription",
      };
      const response = await request
        .post(url)
        .send(type)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.status).toBe(204);
    });

    it("should 200 and give back the information because new type is not unique", async () => {
      const type = {
        typename: "Broer",
        typediscription: "test discription",
      };
      const response = await request
        .post(url)
        .send(type)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.info).toBe(
        `The type: ${type.typename} must be unique`
      );
      expect(response.body.status).toBe(400);
    });

    it("should 500 and tell the client he needs to be singed in", async () => {
      const type = {
        typename: "bestaatNiet",
        typediscription: "test discription",
      };
      const response = await request.post(url).send(type);
      expect(response.status).toBe(500);
      expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
      expect(response.body.message).toBe("You need to be signed in");
      expect(response.body.details).toBeTruthy();
    });

    it("should 500 and tell the client he is not allowed this part of the application", async () => {
      const type = {
        typename: "bestaatNiet",
        typediscription: "test discription",
      };
      const response = await request
        .post(url)
        .send(type)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(500);
      expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
      expect(response.body.message).toBe(
        "You are not allowed to view this part of the application"
      );
      expect(response.body.details).toBeTruthy();
    });
  });

  describe("DELETE /api/types/:name", () => {
    it("should 200 and return count of deleted rows and status 204", async () => {
      const type = data.types[0];
      const response = await request
        .delete(`${url}/${type.typeName}`)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(204);
      expect(response.body.rows).toBeTruthy();
    });

    it("should 200 and return count zero deleted rows and status 404 because trying to delete non existing type", async () => {
      const type = "bestaatNiet";
      let response = await request
        .delete(`${url}/${type}`)
        .set("Authorization", loginHeaderAdmin);
      response = await request
        .delete(`${url}/${type}`)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.rows).toBe(0);
      expect(response.body.status).toBe(404);
    });

    it("should 500 and tell the client he needs to be singed in", async () => {
      const type = data.types[0];
      const response = await request.delete(`${url}/${type.typeName}`);
      expect(response.status).toBe(500);
      expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
      expect(response.body.message).toBe("You need to be signed in");
      expect(response.body.details).toBeTruthy();
    });

    it("should 500 and tell the client he is not allowed this part of the application", async () => {
      const type = data.types[0];
      const response = await request
        .delete(`${url}/${type.typeName}`)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(500);
      expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
      expect(response.body.message).toBe(
        "You are not allowed to view this part of the application"
      );
      expect(response.body.details).toBeTruthy();
    });
  });

  describe("DELETE /api/types", () => {
    it("should 200 and return count of deleted rows and status 204", async () => {
      const response = await request
        .delete(`${url}`)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(204);
      expect(response.body.rows).toBeTruthy();
    });

    it("should 200 and return count of 0 rows and status 404 cause there are no types to delete", async () => {
      const response = await request
        .delete(`${url}`)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(404);
      expect(response.body.rows).toBe(0);
    });

    it("should 500 and tell the client he needs to be singed in", async () => {
      const response = await request.delete(`${url}`);
      expect(response.status).toBe(500);
      expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
      expect(response.body.message).toBe("You need to be signed in");
      expect(response.body.details).toBeTruthy();
    });

    it("should 500 and tell the client he is not allowed this part of the application", async () => {
      const response = await request
        .delete(`${url}`)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(500);
      expect(response.body.code).toBe("INTERNAL_SERVER_ERROR");
      expect(response.body.message).toBe(
        "You are not allowed to view this part of the application"
      );
      expect(response.body.details).toBeTruthy();
    });
  });
});
