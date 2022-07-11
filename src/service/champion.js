const championRepository = require("../repository/champion");

//GET request:
const getAllChampions = async (limit = 50, offset = 0) => {
  const data = await championRepository.findAllChampions({ limit, offset });
  return { data, limit, offset };
};
// const getById = async (id) => {
//   const data = await championRepository.findById(id);
//   return { data: data };
// };
const getChampion = async (name) => {
  const data = await championRepository.findChampion(name);
  return data;
};
const getChampionsByUser = async (user) => {
  const data = await championRepository.findChampionsByUser(user);
  return data;
};
// const getByUserId = async (id) => {
//   const data = await championRepository.findByUser(id);
//   return { data: data, count: data.length };
// };
//DELETE request:
const eraseAllChampions = async () => {
  const data = await championRepository.deleteAllChampions();
  return data;
};
// const eraseById = async (id) => {
//   const data = await championRepository.deleteById(id);
//   return { data: data };
//};
const eraseChampion = async (name) => {
  const data = await championRepository.deleteChampion(name);
  return data;
};
const eraseChampionsByUser = async (user) => {
  const data = await championRepository.deleteChampionsByUser(user);
  return data;
};
//POST
const makeChampion = async (champion) => {
  const data = await championRepository.createChampion(champion);
  if (data.hasOwnProperty("error")) {
    return { error: data.error, status: 400 };
  } else {
    data.status = 201;
    return data;
  }
};
//PUT
const changeRating = async (name) => {
  const data = await championRepository.updateRating(name);
  if (data > 0) return { rows: data, status: 204 };
  return { rows: data, status: 404 };
};

module.exports = {
  //GET
  getAllChampions,
  // getById,
  getChampion,
  getChampionsByUser,
  // getByUserId,
  //DELETE
  eraseAllChampions,
  // eraseById,
  eraseChampion,
  eraseChampionsByUser,
  //POST
  makeChampion,
  //PUT
  changeRating,
};
