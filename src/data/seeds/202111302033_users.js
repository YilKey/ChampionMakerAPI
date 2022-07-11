const { tables } = require("..");
const Roles = require("../../authentication/roles");

module.exports = {
  seed: async (knex) => {
    await knex(tables.user).delete();

    await knex(tables.user).insert([
      //dit zijn mijn broers en zussen :)
      //alle passwoorden zijn de username in lowercase
      {
        userName: "Kerem",
        email: "kerem.yilmaz@api.be",
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$tiqoyJp3jfbl9h+D6K1EHA$zFEW46uODemm6CzkEW5ncNSnIamxamUMI0KHVUDpYGA",
        roles: JSON.stringify([Roles.ADMIN, Roles.USER]),
      },
      {
        userName: "Efe",
        email: "efe.yilmaz@api.be",
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$kyecINE4ea7nfWYLNGhVJg$CMlMApEx4f2bRlgY1HbmKOm6sYiooT2R3Kaqqi2dk6c",
        roles: JSON.stringify([Roles.USER]),
      },
      {
        userName: "Sultan",
        email: "sultan.yilmaz@api.be",
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$mswboMQfCplU0Ka4tltS9A$3kA/l3p5TAQbxUH2TYj5fju2ADUs69PGYCkoXvEKDPw",
        roles: JSON.stringify([Roles.USER]),
      },
      {
        userName: "Berfin",
        email: "berfin.yilmaz@api.be",
        password_hash:
          "$argon2id$v=19$m=131072,t=6,p=1$uFKcSm+9s5vustdmGhih+g$0eiHF4uuigKPctnI4FJzQst7kdNQL/G5TckpYd40iEs",
        roles: JSON.stringify([Roles.USER]),
      },
    ]);
  },
};
