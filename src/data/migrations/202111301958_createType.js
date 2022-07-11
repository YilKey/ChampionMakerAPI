const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.type, (table) => {
      table.increments("typeID");
      table.string("typeName", 45).notNullable();
      table.string("typeDiscription", 255).notNullable();

      table.unique("typeName", "idx_types_typeName_unique");
    });
  },
  down: (knex) => {
    return knex.schema.dropIfExists(tables.type);
  },
};
