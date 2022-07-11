const typeRepository = require("../repository/type");

//GET request:
const getAllTypes = async (limit = 50, offset = 0) => {
  const data = await typeRepository.findAllTypes({ limit, offset });
  return { data, limit, offset };
};
// const getById = async (id) => {
//   const data = await typeRepository.findById(id);
//   return { data: data, count: data.length };
// };
const getType = async (name) => {
  const data = await typeRepository.findType(name);
  return data;
};
//DELETE request:
const eraseAllTypes = async () => {
  const data = await typeRepository.deleteAllTypes();
  return data;
};
// const eraseById = async (id) => {
//   const data = await typeRepository.deleteById(id);
//   return { data: data };
// };
const eraseType = async (name) => {
  const data = await typeRepository.deleteType(name);
  return data;
};
//POST
const makeType = async (type) => {
  const data = await typeRepository.createType(type);
  return data;
};

module.exports = {
  //GET
  getAllTypes,
  // getById,
  getType,
  //DELETE
  eraseAllTypes,
  // eraseById,
  eraseType,
  //POST
  makeType,
};
