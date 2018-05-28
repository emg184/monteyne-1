exports.up = function(knex, Promise) {
  return knex.schema.table("images", function(table) {
    table.text("associations");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("images", function(table) {
    table.dropColumn("associations");
  });
};
