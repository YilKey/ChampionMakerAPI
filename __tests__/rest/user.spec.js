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

  const url = "/api/users";

  describe("GET /api/users", () => {
    it("should 200 and return all users", async () => {
      const response = await request
        .get(url)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(50); //default
      expect(response.body.offset).toBe(0); //default
    });

    it("should 200 and paginate the list of users", async () => {
      const response = await request
        .get(`${url}?limit=2&offset=1`)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data[0]).toStrictEqual({
        userID: 2,
        userName: "Efe",
        email: "efe.yilmaz@test.be",
        roles: ["user"],
      });
      expect(response.body.data[1]).toStrictEqual({
        userID: 1,
        userName: "Kerem",
        email: "kerem.yilmaz@test.be",
        roles: ["admin", "user"],
      });
    });
  });
  describe("GET /api/users/:name", () => {
    it("should 200 and return user with given name", async () => {
      const userName = "kerem";
      const response = await request
        .get(`${url}/${userName}`)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        userID: 1,
        userName: "Kerem",
        email: "kerem.yilmaz@test.be",
        roles: ["admin", "user"],
      });
    });

    it("should 200 and give status 404 with info", async () => {
      const nonExistingUser = "ikBestaNiet";
      const response = await request
        .get(`${url}/${nonExistingUser}`)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(404);
      expect(response.body.info).toBe(
        `User with name: ${nonExistingUser} could not be found`
      );
    });
  });
  describe("GET /api/users/:name/champions", () => {
    it("should 200 and return all champions from given username", async () => {
      const userName = "kerem";
      const response = await request
        .get(`${url}/${userName}/champions`)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([
        {
          championID: 1,
          championName: "LeBlanc",
          championDiscription:
            "Ze is burst heavy champion die in bla bla woont",
          championRating: 0,
          championType: "Zus",
          fromUser: "Kerem",
        },
        {
          championID: 5,
          championName: "Robin",
          championDiscription: "Hij is sustain champion die in bla bla woont",
          championRating: 1000,
          championType: "Vriend",
          fromUser: "Kerem",
        },
      ]);
    });
  });
  describe("GET /api/users/:name/champions/:champname", () => {
    it("should return 200 and given champion from given user", async () => {
      const userName = "kerem";
      const champName = "LeBlanc";
      const response = await request
        .get(`${url}/${userName}/champions/${champName}`)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        championID: 1,
        championName: "LeBlanc",
        championDiscription: "Ze is burst heavy champion die in bla bla woont",
        championType: "Zus",
        fromUser: "Kerem",
        championRating: 0,
      });
    });
    it("should 200 and give status 404 with info", async () => {
      const username = "magbestaanofniet";
      const NEChampion = "dezechampionbestaatniet";
      const response = await request
        .get(`${url}/${username}/champions/${NEChampion}`)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(404);
      expect(response.body.info).toBe(
        `user: ${username} does not have a champion called: ${NEChampion}`
      );
    });
  });

  describe("DELETE /api/users", () => {
    it("should 200 and return count of deleted rows and status 204", async () => {
      const response = await request
        .delete(url)
        .set("Authorization", loginHeaderAdmin);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(204);
      expect(response.body.rows).toBeTruthy();
    });
  });
  describe("DELETE /api/users/:name", () => {
    //voeg en verwijder
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.type).insert(data.types);
      await knex(tables.champion).insert(data.champions);
    });

    afterAll(async () => {
      await knex(tables.champion)
        .whereIn("championName", deleteData.champions)
        .delete();
      await knex(tables.user).whereIn("userName", deleteData.users).delete();
      await knex(tables.type).whereIn("typeName", deleteData.types).delete();
    });
    it("should 200 and return count of deleted rows and status 204", async () => {
      const user = "kerem";
      const response = await request
        .delete(`${url}/${user}`)
        .set("Authorization", loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(204);
      expect(response.body.rows).toBeTruthy();
    });
  });
  describe("DELETE /api/users/:name/champions", () => {
    //voeg en verwijder
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.type).insert(data.types);
      await knex(tables.champion).insert(data.champions);
    });

    afterAll(async () => {
      await knex(tables.champion)
        .whereIn("championName", deleteData.champions)
        .delete();
      await knex(tables.user).whereIn("userName", deleteData.users).delete();
      await knex(tables.type).whereIn("typeName", deleteData.types).delete();
    });
    it("should 200 and return count of deleted rows and status 204", async () => {
      const user = data.users[0].userName; // heeft champions
      const response = await request
        .delete(`${url}/${user}/champions`)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(204);
      expect(response.body.rows).toBeTruthy();
    });

    it("should 200 and return rows 0 and status 404 because user doesn't have any champions", async () => {
      const user = data.users[4].userName; // heeft geen champions
      const response = await request
        .delete(`${url}/${user}/champions`)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(404);
      expect(response.body.rows).toBe(0);
    });
  });
  describe("DELETE /api/users/:name/champions/:champname", () => {
    //voeg en verwijder
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.type).insert(data.types);
      await knex(tables.champion).insert(data.champions);
    });
    it("should 200 and return count of deleted rows and status 204", async () => {
      const user = data.users[0].userName; //heeft champion en bestaat
      const response = await request
        .delete(`${url}/${user}/champions`)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(204);
      expect(response.body.rows).toBeTruthy();
    });

    it("should 200 and return rows 0 and status 404 because user has no such champion", async () => {
      const user = data.users[4].userName; // heeft geen champions
      const champName = "bestaatnietchampion";
      const response = await request
        .delete(`${url}/${user}/champions/${champName}`)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(404);
      expect(response.body.rows).toBe(0);
    });
  });

  describe("POST /api/users/:name/champions/:champname", () => {
    it("should 200 and return id of newly made champion and status 201", async () => {
      const champion = {
        name: "nieuwe champion",
        disc: "een beschrijving",
        type: "Broer",
      };
      const username = "kerem";
      const response = await request
        .post(`${url}/${username}/champions`)
        .send(champion)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(201);
      expect(response.body.id).toBeTruthy();
    });

    it("should 200 and return status 400, error with message and all valid types", async () => {
      const champion = {
        name: "nieuwechampion",
        disc: "een beschrijving",
        type: "typedatnietbestaat",
      };
      const username = data.users[0].userName;
      const response = await request
        .post(`${url}/${username}/champions`)
        .send(champion)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(400);
      expect(response.body.error).toBe(
        "The type of your champion must be valid"
      );
      expect(response.body.validTypes).toStrictEqual([
        "broer",
        "moeder",
        "vader",
        "vriend",
        "zus",
      ]);
    });

    it("should 200 and return status 400, error with message", async () => {
      const champion = {
        name: "", //naam mag niet leeg zijn !!!
        disc: "een beschrijving",
        type: "Broer",
      };
      const username = data.users[0].userName;
      const response = await request
        .post(`${url}/${username}/champions`)
        .send(champion)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(400);
      expect(response.body.error).toBe(
        "The champion name must be unique and can't be empty"
      );
    });
  });

  describe("PUT /api/users/:name/champions/:champname", () => {
    it("should 200 and return id of newly made champion and status 201", async () => {
      const champion = {
        name: "leblanc",
        disc: "een beschrijving",
        type: "Broer",
      };
      const username = "kerem";
      const response = await request
        .post(`${url}/${username}/champions`)
        .send(champion)
        .set("Authorization", loginHeaderUser);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(201);
      expect(response.body.id).toBeTruthy();
    });
  });
});
