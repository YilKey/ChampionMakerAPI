const { getKnex, tables } = require("../data");
const {
  findChampionsByUser,
  deleteChampionsByUser,
  createChampion,
  isValidNewChampName,
  isValidType,
} = require("./champion");
//todo dedicated logger
const logger = require("../logger");
const log = logger;

const isValidNewAccount = async (name, email) => {
  let allNames = [];
  let isNew = true;
  allNames = await findAllUsers(1000, 0);
  allNames.forEach((user) => {
    if (name === user.userName || email === user.email) {
      isNew = false;
    }
  });
  return isNew;
};

//GET request:
async function findAllUsers({ limit, offset }) {
  try {
    const users = await getKnex()(tables.user)
      .select("userID", "userName", "email", "roles")
      .limit(limit)
      .offset(offset)
      .orderBy("userName", "ASC");
    if (users) {
      return users;
    } else {
      return { info: "Users could not be found", status: 404 };
    }
  } catch (error) {
    log.error("Something went wrong with the server while finding all users");
    log.error(error);
    return { status: 500 };
  }
}
const findById = async (id) => {
  try {
    const user = await getKnex()(tables.user)
      .select("userID", "userName", "email", "roles")
      .where("userID", "=", id)
      .first();
    return user;
  } catch (error) {
    log.error(
      "Something went wrong with the server while finding a user by id"
    );
    log.error(error);
    return { status: 500 };
  }
};
const findUser = async (name) => {
  try {
    const user = await getKnex()(tables.user)
      .select("userID", "userName", "email", "roles")
      .where("userName", "=", name)
      .first();
    if (user) {
      return user;
    } else {
      return {
        info: `User with name: ${name} could not be found`,
        status: 404,
      };
    }
  } catch (error) {
    log.error("Something went wrong with the server while finding a user");
    log.error(error);
    return { status: 500 };
  }
};
const findUserByEmail = async (email) => {
  return getKnex()(tables.user).where("email", email).first();
};
const findUserChampions = async (name) => {
  return findChampionsByUser(name);
};
const findUserChampion = async (username, champname) => {
  try {
    const champion = await getKnex()(tables.champion)
      .select()
      .whereRaw("fromUser = ? AND championName = ?", [username, champname])
      .first();
    if (champion) {
      return champion;
    } else {
      return {
        info: `user: ${username} does not have a champion called: ${champname}`,
        status: 404,
      };
    }
  } catch (error) {
    log.error(
      "Something went wrong with the server while finding a champion from a user"
    );
    log.error(error);
    return { status: 500 };
  }
};
//DELETE request:
const deleteAllUsers = async () => {
  try {
    const isDeleted = await getKnex()(tables.user).del();
    if (isDeleted > 0) {
      log.info("Deleted all users");
      return { rows: isDeleted, status: 204 };
    } else {
      log.error("No users could be deleted");
      return { rows: isDeleted, status: 404 };
    }
  } catch (error) {
    log.error("Something went wrong in the server while deleting all users");
    log.error(error);
    return { status: 500 };
  }
};
// const deleteById = async (id) => {
//   return getKnex()(tables.user).del().where("userID", "=", id);
// };
const deleteUser = async (name) => {
  try {
    const isDeleted = await getKnex()(tables.user)
      .del()
      .where("userName", "=", name);
    if (isDeleted > 0) {
      log.info("Deleted user");
      return { rows: isDeleted, status: 204 };
    } else {
      log.error(`No user could be deleted, check if this user: ${name} exists`);
      return { rows: isDeleted, status: 404 };
    }
  } catch (error) {
    log.error("Something went wrong in the server while deleting a user");
    log.error(error);
    return { status: 500 };
  }
};

const deleteUserChampions = async (username) => {
  try {
    return deleteChampionsByUser(username);
  } catch (error) {
    log.error("Something went wrong in the server while deleting a user");
    log.error(error);
    return { status: 500 };
  }
};
const deleteUserChampion = async (username, champname) => {
  try {
    const isDeleted = await getKnex()(tables.champion)
      .del()
      .whereRaw("fromUser = ? AND championName = ?", [username, champname]);
    if (isDeleted > 0) {
      log.info("Deleted champion from user");
      return { rows: isDeleted, status: 204 };
    } else {
      log.error("No champion could be deleted");
      return { rows: isDeleted, status: 404 };
    }
  } catch (error) {
    log.error(
      "Something went wrong in the server while deleting a champion from a user"
    );
    log.error(error);
    return { status: 500 };
  }
};
//POST request login
const createUser = async ({ name, email, password, roles }) => {
  try {
    if (isValidNewAccount(name, email)) {
      const user = await getKnex()(tables.user).insert({
        userName: name,
        email: email,
        password_hash: password,
        roles: JSON.stringify(roles),
      });
      return await findById(user[0]);
    } else {
      return { error: "Can't register account", status: 400 };
    }
  } catch (error) {
    log.error("Something went wrong in the server while creating a user");
    log.error(error);
    return { status: 500 };
  }
};
const createUserChampion = async ({ name, disc, type, user }) => {
  try {
    const nieuweChampion = { name, disc, type, user };
    return createChampion(nieuweChampion);
  } catch (error) {
    log.error(
      "Something went wrong in the server while creating a champion for a user"
    );
    log.error(error);
    return { status: 500 };
  }
};

const championIsFromUser = async (user, champname) => {
  const data = await findUserChampion(user, champname);
  if (data.status == 404) {
    return false;
  } else {
    return true;
  }
};
//PUT request
const updateUserChampion = async ({ name, disc, type, user }) => {
  try {
    if (await championIsFromUser(user, name)) {
      if (await isValidType(type)) {
        const isUpdated = await getKnex()(tables.champion)
          .whereRaw("fromUser = ? AND championName = ?", [user, name])
          .update({
            championDiscription: disc == "" ? "no discription yet :)" : disc,
            championType: type,
          });
        if (isUpdated > 0) {
          return { rows: isUpdated, status: 204 };
        } else {
          return { rows: isUpdated, status: 404 };
        }
      } else {
        return {
          error: "The type of your champion must be valid",
          validTypes: ["broer", "moeder", "vader", "vriend", "zus"],
          status: 400,
        };
      }
    } else {
      return {
        error: "The user must have the champion u want to edit",
        status: 404,
      };
    }
  } catch (error) {
    log.error(
      "Something went wrong in the server while updating a champion for a user"
    );
    log.error(error);
    return { status: 500 };
  }
};

module.exports = {
  //GET (user)
  findAllUsers,
  // findById,
  findUser,
  findUserByEmail,
  //GET (champions of user)
  findUserChampions,
  findUserChampion,
  //DELETE (user)
  deleteAllUsers,
  // deleteById,
  deleteUser,
  //DELETE (champions of user)
  deleteUserChampions,
  deleteUserChampion,
  //POST
  createUser,
  createUserChampion,
  //PUT
  updateUserChampion,
};
