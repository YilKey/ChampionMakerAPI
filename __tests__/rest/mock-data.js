const data = {
  champions: [
    {
      championID: 1,
      championName: "LeBlanc",
      championDiscription: "Ze is burst heavy champion die in bla bla woont",
      championType: "Zus",
      fromUser: "Kerem",
      championRating: 0,
    },
    {
      championID: 2,
      championName: "Anivia",
      championDiscription: "Ze is sustain heavy champion die in bla bla woont",
      championType: "Moeder",
      fromUser: "Efe",
      championRating: 15,
    },
    {
      championID: 3,
      championName: "Ryze",
      championDiscription: "Hij is sustain champion die in bla bla woont",
      championType: "Broer",
      fromUser: "Berfin",
      championRating: -1,
    },
    {
      championID: 4,
      championName: "test",
      championDiscription: "Hij is sustain champion die in bla bla woont",
      championType: "Broer",
      fromUser: "Berfin",
      championRating: 1654,
    },
    {
      championID: 5,
      championName: "Robin",
      championDiscription: "Hij is sustain champion die in bla bla woont",
      championType: "Vriend",
      fromUser: "Kerem",
      championRating: 1000,
    },
  ],
  types: [
    { typeID: 1, typeName: "Broer", typeDiscription: "Dit is mijn broer" },
    { typeID: 2, typeName: "Zus", typeDiscription: "Dit is een zus" },
    { typeID: 3, typeName: "Moeder", typeDiscription: "Dit is mijn moeder" },
    { typeID: 4, typeName: "Vader", typeDiscription: "Dit is mijn vader" },
    { typeID: 5, typeName: "Vriend", typeDiscription: "Dit is mijn vriend" },
  ],
  users: [
    {
      userID: 1,
      userName: "Kerem",
      email: "kerem.yilmaz@test.be",
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$tiqoyJp3jfbl9h+D6K1EHA$zFEW46uODemm6CzkEW5ncNSnIamxamUMI0KHVUDpYGA",
      roles: JSON.stringify(["admin", "user"]),
    },
    {
      userID: 2,
      userName: "Efe",
      email: "efe.yilmaz@test.be",
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$kyecINE4ea7nfWYLNGhVJg$CMlMApEx4f2bRlgY1HbmKOm6sYiooT2R3Kaqqi2dk6c",
      roles: JSON.stringify(["user"]),
    },
    {
      userID: 3,
      userName: "Sultan",
      email: "sultan.yilmaz@test.be",
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$mswboMQfCplU0Ka4tltS9A$3kA/l3p5TAQbxUH2TYj5fju2ADUs69PGYCkoXvEKDPw",
      roles: JSON.stringify(["user"]),
    },
    {
      userID: 4,
      userName: "Berfin",
      email: "berfin.yilmaz@test.be",
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$uFKcSm+9s5vustdmGhih+g$0eiHF4uuigKPctnI4FJzQst7kdNQL/G5TckpYd40iEs",
      roles: JSON.stringify(["user"]),
    },
    {
      userID: 5,
      userName: "Zehra",
      email: "Zehra.yilmaz@test.be",
      password_hash:
        "$argon2id$v=19$m=131072,t=6,p=1$kyecINE4ea7nfWYLNGhVJg$CMlMApEx4f2bRlgY1HbmKOm6sYiooT2R3Kaqqi2dk6c",
      roles: JSON.stringify(["user"]),
    },
  ],
};

const deleteData = {
  champions: ["LeBlanc", "Anivia", "Ryze", "test", "Robin"],
  users: ["Kerem", "Efe", "Berfin", "Sultan", "Zehra"],
  types: ["broer", "zus", "moeder", "vader", "vriend"],
};

module.exports = {
  data,
  deleteData,
};
