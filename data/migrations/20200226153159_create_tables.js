
exports.up = function(knex) {
  return knex.schema
  .createTable('users', tbl => {
    tbl.increments();
    tbl.string('username');
    tbl.string('password');
    tbl.string('department');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
