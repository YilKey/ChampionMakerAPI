module.exports = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ChampionMaker API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Koa and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "ChampionMakerAPI",
        email: "kerem.yilmaz@student.hogent.be",
      },
    },
    servers: [
      {
        url: "https://kerem-championmaker.herokuapp.com/",
      },
    ],
  },
  apis: ["./src/rest/*.js"],
};
