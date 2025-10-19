exports.up = function(knex) {
  return knex.schema.createTable('skills', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').unique().notNullable();
    table.string('category').notNullable();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['name']);
    table.index(['category']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('skills');
};
