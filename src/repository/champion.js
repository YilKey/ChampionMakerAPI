const { Logform } = require("winston");
const { getKnex, tables } = require("../data");
const logger = require("../logger");
const { isValidType } = require("./type");
const log = logger;

const SELECT_COLUMNS = [
  `${tables.champion}.championID`,
  "championName",
  "championDiscription",
  "championRating",
  `${tables.type}.typeID as type_id`,
  `${tables.type}.typeName as type_name`,
  `${tables.type}.typeDiscription as type_disc`,
  `${tables.user}.userID as user_id`,
  `${tables.user}.userName as user_name`,
];
//Hulp methoden
const formatChampion = ({
  type_id,
  type_name,
  type_disc,
  user_id,
  user_name,
  ...rest
}) => ({
  ...rest,
  type: {
    typeID: type_id,
    typeName: type_name,
    typeDiscription: type_disc,
  },
  user: {
    userID: user_id,
    userName: user_name,
  },
});

const isValidNewChampName = async (name) => {
  const existingNames = [];
  let champions = await findAllChampions({ limit: 100, offset: 0 });
  champions.forEach((element, index) => {
    existingNames[index] = element.championName.toLowerCase();
  });
  if (!existingNames.includes(name.toLowerCase()) && name != "") {
    return true;
  } else {
    return false;
  }
};
//GET request:
const findAllChampions = async ({ limit, offset }) => {
  try {
    return getKnex()(tables.champion)
      .select()
      .limit(limit)
      .offset(offset)
      .orderBy("championName", "ASC");
  } catch (error) {
    log.error(
      "Something went wrong with the server while finding all champions"
    );
    log.error(error);
    return { status: 500 };
  }
};
// const findById = async (id) => {
//   const champion = await getKnex()(tables.champion)
//     .join("types", "types.typeName", "=", "champions.championType")
//     .join("users", "users.userName", "=", "champions.fromUser")
//     .where("championID", "=", id)
//     .first(SELECT_COLUMNS);
//   console.log(champion);
//   return champion && formatChampion(champion);
// };
const findChampion = async (name) => {
  try {
    const champion = await getKnex()(tables.champion)
      .join("types", "types.typeName", "=", "champions.championType")
      .join("users", "users.userName", "=", "champions.fromUser")
      .where("championName", "=", name)
      .first(SELECT_COLUMNS);
    return champion && formatChampion(champion);
  } catch (error) {
    log.error("Something went wrong with the server while finding a champion");
    log.error(error);
    return { status: 500 };
  }
};
const findChampionsByUser = async (userName) => {
  try {
    return await getKnex()(tables.champion)
      .select()
      .orderBy("championName", "ASC")
      .where("fromUser", "=", userName);
  } catch (error) {
    log.error(
      "Something went wrong with the server while finding all champions for a user"
    );
    log.error(error);
    return { status: 500 };
  }
};
//DELETE request:
const deleteAllChampions = async () => {
  try {
    const isDeleted = await getKnex()(tables.champion).del();
    if (isDeleted > 0) {
      log.info("Deleted all champions");
      return { rows: isDeleted, status: 204 };
    } else {
      log.error("No champions could be deleted");
      return { rows: isDeleted, status: 404 };
    }
  } catch (error) {
    log.error(
      "Something went wrong in the server while deleting all champions"
    );
    log.error(error);
    return { status: 500 };
  }
};
// const deleteById = async (id) => {
//   return getKnex()(tables.champion).del().where("championID", "=", id);
// };
const deleteChampion = async (name) => {
  try {
    const isDeleted = await getKnex()(tables.champion)
      .del()
      .where("championName", "=", name);
    if (isDeleted > 0) {
      log.info("Deleted a champion");
      return { rows: isDeleted, status: 204 };
    } else {
      log.error("No champion could be deleted");
      return { rows: isDeleted, status: 404 };
    }
  } catch (error) {
    log.error("Something went wrong in the server while deleting a champion");
    log.error(error);
    return { status: 500 };
  }
};
const deleteChampionsByUser = async (username) => {
  //delete alle champions van een user !!!
  try {
    const isDeleted = await getKnex()(tables.champion)
      .del()
      .where("fromUser", "=", username);
    if (isDeleted > 0) {
      log.info(`Deleted all champions for a user: ${username}`);
      return { rows: isDeleted, status: 204 };
    } else {
      log.error("No champions could be deleted");
      return { rows: isDeleted, status: 404 };
    }
  } catch (error) {
    log.error(
      "Something went wrong in the server while deleting all champions from a user"
    );
    log.error(error);
    return { status: 500 };
  }
};

//POST request
const createChampion = async ({ name, disc, type, user }) => {
  try {
    if (!(await isValidNewChampName(name)))
      return {
        error: `The championname: ${name} must be unique or can't be empty`,
        status: 400,
      };
    if (!(await isValidType(type)))
      return {
        error: `The type: ${type} must be valid`,
        validTypes: ["broer", "moeder", "vader", "vriend", "zus"],
        status: 400,
      };

    const id = await getKnex()(tables.champion).insert({
      championName: name,
      championDiscription: disc == "" ? "no discription yet :)" : disc,
      championRating: 0,
      championType: type,
      fromUser: user,
    });
    log.info("A new champion is created succesfully");
    return { id: id[0], status: 201 };
  } catch (error) {
    log.error("Something went wrong in the server while creating a champion");
    log.error(error);
    return { status: 500 };
  }
};
//PUT request todo
const updateRating = async (name) => {
  return getKnex()(tables.champion)
    .increment("championRating")
    .where("championName", name);
};

module.exports = {
  //Hulp methodes
  isValidNewChampName,
  isValidType,
  //GET
  findAllChampions,
  // findById,
  findChampion,
  findChampionsByUser,
  //DELETE
  deleteAllChampions,
  // deleteById,
  deleteChampion,
  deleteChampionsByUser,
  //POST
  createChampion,
  //PUT
  updateRating,
};
