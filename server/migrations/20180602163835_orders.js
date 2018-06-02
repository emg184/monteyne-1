exports.up = function(knex, Promise) {
  return  knex.schema.createTable("orders", function (table) {
    table.increments("order_number");
    table.string("products");
    table.string("shipping_info");
    table.string("email");
    table.string("name");
    table.text("description");
    table.timestamp('order_date').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("orders");
};
