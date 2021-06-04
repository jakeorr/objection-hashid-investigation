exports.up = async function(knex) {
  await knex.schema.createTable('persons', table => {
    table.increments();
    table.string('name').notNullable();
  });

  await knex.schema.createTable('pets', table => {
    table.increments();
    table.string('name').notNullable();
    table.integer('person_id').notNullable();

    table.foreign('person_id').references('persons.id').onDelete('CASCADE');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('pets');
  await knex.schema.dropTable('persons');
};
