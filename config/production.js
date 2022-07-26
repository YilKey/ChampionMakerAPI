module.exports = {
  log: {
    level: "info",
    disabled: false,
  },
  cors: {
    origins: ["http://localhost:3000",
             "https://kerem-championmakerfront.herokuapp.com"],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: "mysql2",
    host: "localhost",
    port: 3306,
    name: "championmaker",
  },
  url: {
    path: "http://localhost:",
    port: "9000",
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      // secret comes via env
      expirationInterval: 60 * 60 * 1000,
      issuer: "championmaker.be",
      audience: "championmaker.be",
    },
  },
};
