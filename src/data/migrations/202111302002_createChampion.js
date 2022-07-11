const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.champion, (table) => {
      table.increments("championID");
      table.string("championName", 45).notNullable();
      table.string("championDiscription", 1000).notNullable();
      table.integer("championRating").nullable();
      table.string("championType").notNullable();
      table.string("fromUser").notNullable();

      table
        .foreign("championType", "fk_champions_type")
        .references(`${tables.type}.typeName`)
        .onDelete("CASCADE");
      table
        .foreign("fromUser", "fk_champions_user")
        .references(`${tables.user}.userName`)
        .onDelete("CASCADE");
      table.unique("championName", "idx_champions_ChampionName_unique");
    });
  },
  down: (knex) => {
    return knex.schema.dropIfExists(tables.champion);
  },
};
