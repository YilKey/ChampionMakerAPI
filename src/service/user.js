const { hashPassword, verifyPassword } = require("../authentication/password");
const userRepository = require("../repository/user");
const Roles = require("../authentication/roles");
const { generateJWT, verifyJWT } = require("../authentication/jwt");
const logger = require("../logger");
const log = logger;

//HULPMethodes
const makeExposedUser = ({ id, userName, email, roles }) => ({
  id,
  name: userName,
  email,
  roles,
});
const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token,
  };
};

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw new Error("You need to be signed in");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Invalid authentication token");
  }

  const authToken = authHeader.substr(7);
  try {
    const { roles, userID } = await verifyJWT(authToken);

    return {
      userID,
      roles,
      authToken,
    };
  } catch (error) {
    log.error(error.message, { error });
    throw new Error(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw new Error("You are not allowed to view this part of the application");
  }
};

const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    // DO NOT expose we don't know the user
    throw new Error("The given email and password do not match");
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw new Error("The given email and password do not match");
  }

  return await makeLoginData(user);
};

//GET request:
const getAllUsers = async (limit = 50, offset = 0) => {
  const data = await userRepository.findAllUsers({ limit, offset });
  return { data, limit, offset };
};
// const getById = async (id) => {
//   const data = await userRepository.findById(id);
//   return { data: data, count: data.length };
// };
const getUser = async (name) => {
  const data = await userRepository.findUser(name);
  return data;
};
const getUserChampions = async (username) => {
  const data = await userRepository.findUserChampions(username);
  return data;
};
const getUserChampion = async (username, champname) => {
  const data = await userRepository.findUserChampion(username, champname);
  return data;
};
//DELETE request:
const eraseAllUsers = async () => {
  const data = await userRepository.deleteAllUsers();
  return data;
};
// const eraseById = async (id) => {
//   const data = await userRepository.deleteById(id);
//   return { data: data };
// };
const eraseUser = async (name) => {
  const data = await userRepository.deleteUser(name);
  return data;
};
const eraseUserChampions = async (username) => {
  const data = await userRepository.deleteUserChampions(username);
  return data;
};
const eraseUserChampion = async (username, champname) => {
  const data = await userRepository.deleteUserChampion(username, champname);
  return data;
};
//POST requests
const makeUser = async (user) => {
  user.password = await hashPassword(user.password);
  user.roles = [Roles.USER];
  log.debug("name: " + user.name + " : " + user.email + " : " + user.password);
  const data = await userRepository.createUser(user);
  let loginData = await makeLoginData(data);
  loginData.status = 201;
  return loginData;
};
const makeUserChampion = async (champion) => {
  const data = await userRepository.createUserChampion(champion);
  return data;
};
//PUT request
const changeUserChampion = async (champion) => {
  const data = await userRepository.updateUserChampion(champion);
  return data;
};

module.exports = {
  checkAndParseSession,
  checkRole,
  login,
  //GET
  getAllUsers,
  // getById,
  getUser,
  getUserChampions,
  getUserChampion,
  //DELETE
  eraseAllUsers,
  // eraseById,
  eraseUser,
  eraseUserChampions,
  eraseUserChampion,
  //POST (user)
  makeUser,
  makeUserChampion,
  //PUT (champion)
  changeUserChampion,
};
