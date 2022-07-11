const { withServer, login } = require("../supertest.setup");
const { data, deleteData } = require("./mock-data");

describe("champion", () => {
  let request;
  let knex;
  let loginHeader;

  withServer(({ request: r, knex: k }) => {
    request = r;
    knex = k;
  });

  beforeAll(async () => {
    loginHeader = await login(request);
  });

  const url = "/api/champions";

  describe("GET /api/champions", () => {
    test("should 200 and return all champions", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(50); //default
      expect(response.body.offset).toBe(0); //default
    });

    test("should 200 and paginate the list of champions", async () => {
      const response = await request.get(`${url}?limit=2&offset=1`);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data[0]).toStrictEqual({
        championID: 1,
        championName: "LeBlanc",
        championDiscription: "Ze is burst heavy champion die in bla bla woont",
        championType: "Zus",
        fromUser: "Kerem",
        championRating: 0,
      });
      expect(response.body.data[1]).toStrictEqual({
        championID: 5,
        championName: "Robin",
        championDiscription: "Hij is sustain champion die in bla bla woont",
        championType: "Vriend",
        fromUser: "Kerem",
        championRating: 1000,
      });
    });
  });

  describe("GET /api/champions/name-:name", () => {
    it("should 200 and return the requested champion with given name", async () => {
      const championName = data.champions[0].championName;
      const response = await request.get(`${url}/name-${championName}`);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        championID: 1,
        championName: "LeBlanc",
        championDiscription: "Ze is burst heavy champion die in bla bla woont",
        championRating: 0,
        type: {
          typeID: 2,
          typeName: "Zus",
          typeDiscription: "Dit is een zus",
        },
        user: {
          userID: 1,
          userName: "Kerem",
        },
      });
    });
  });

  describe("POST /api/champions/user-:user", () => {
    it("should 200 and return the id of newly created champion en status 201", async () => {
      const userName = "kerem";
      const response = await request.post(`${url}/user-${userName}`).send({
        name: "unieke naam",
        disc: "een beschrijving",
        type: "Zus",
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(201);
      expect(response.body.id).toBeTruthy();
    });
  });
});
