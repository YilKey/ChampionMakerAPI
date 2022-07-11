const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.user, (table) => {
      table.increments("userID");
      table.string("userName", 45).notNullable(); //column string userName not null unique
      table.string("email").notNullable();
      table.string("password_hash").notNullable();
      table.jsonb("roles").notNullable();

      table.unique("userName", "idx_users_userName_unique");
      table.unique("email", "idx_users_email_unique");
    });
  },
  down: (knex) => {
    return knex.schema.dropIfExists(tables.user);
  },
};
