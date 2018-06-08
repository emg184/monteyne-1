exports.up = function(knex, Promise) {
  return knex.schema.table("users", function(table) {
    table.boolean("active")
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table) {
    table.dropColumn("active");
  });
};
