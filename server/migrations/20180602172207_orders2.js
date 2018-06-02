exports.up = function(knex, Promise) {
  return knex.schema.table("orders", function(table) {
    table.float("total");
    table.dropColumn("description")
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("orders", function(table) {
    table.dropColumn("total");
    table.string("description");
  });
};
