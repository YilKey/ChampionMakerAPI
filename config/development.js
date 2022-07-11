module.exports = {
  log: {
    level: "silly",
    disabled: false,
  },
  cors: {
    origins: ["http://localhost:3000"],
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
      secret:
        "eenSirDatHickimseZalBilmekOmdatBenTweeDilerMengBirlikteDeDillerZijnTurkceEnFilemence",
      expirationInterval: 60 * 60 * 1000,
      issuer: "championmaker.be",
      audience: "championmaker.be",
    },
  },
};
