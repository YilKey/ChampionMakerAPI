const { getKnex, tables } = require("../data");
const logger = require("../logger");
const log = logger;

//HULP methodes
const isValidType = async (type) => {
  const existingTypes = [];
  let types = await findAllTypes({ limit: 100, offset: 0 });
  types.forEach((element, index) => {
    existingTypes[index] = element.typeName.toLowerCase();
  });
  if (existingTypes.includes(type.toLowerCase())) {
    return true;
  } else {
    return false;
  }
};

//GET request:
const findAllTypes = async ({ limit, offset }) => {
  return getKnex()(tables.type)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy("typeName", "ASC");
};
// const findTypeById = async (id) => {
//   return getKnex()(tables.type).select().where("typeID", "=", id).first();
// };
const findType = async (name) => {
  const type = await getKnex()(tables.type)
    .select()
    .where("typeName", "=", name)
    .first();
  if (type) {
    return type;
  } else {
    return {
      info: `Type with name: ${name} could not be found`,
      status: 404,
    };
  }
};
//DELETE request:
const deleteAllTypes = async () => {
  const isDeleted = await getKnex()(tables.type).del();
  if (isDeleted > 0) {
    log.info("Deleted all types");
    return { rows: isDeleted, status: 204 };
  } else {
    log.error("Could not delete all types, there are none");
    return { rows: isDeleted, status: 404 };
  }
};
// const deleteById = async (id) => {
//   return getKnex()(tables.type).del().where("typeID", "=", id);
// };
const deleteType = async (name) => {
  const isDeleted = await getKnex()(tables.type)
    .del()
    .where("typeName", "=", name);
  if (isDeleted > 0) {
    log.info(`Deleted type: ${name}`);
    return { rows: isDeleted, status: 204 };
  } else {
    log.error(`Could not delete type: ${name}`);
    return { rows: isDeleted, status: 404 };
  }
};
//POST request
const createType = async ({ typename, typediscription }) => {
  if (await isValidType(typename))
    return { info: `The type: ${typename} must be unique`, status: 400 };
  const typeID = await getKnex()(tables.type).insert({
    typeName: typename,
    typeDiscription: typediscription,
  });
  log.info(`Created new type: ${typename}`);
  return { id: typeID[0], status: 204 };
};

module.exports = {
  //HULP
  isValidType,
  //GET
  findAllTypes,
  // findById,
  findType,
  //DELETE
  deleteAllTypes,
  // deleteById,
  deleteType,
  //POST
  createType,
};
