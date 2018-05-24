exports.up = function(knex, Promise) {
  return knex.schema.table("products", function(table) {
    table.string("sku");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("products", function(table) {
    table.dropColumn("sku");
  });
};
