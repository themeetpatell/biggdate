exports.up = function(knex) {
  return knex.schema.createTable('profiles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.string('company').notNullable();
    table.string('company_stage').notNullable();
    table.string('industry').notNullable();
    table.string('location').notNullable();
    table.text('bio').notNullable();
    table.text('vision').notNullable();
    table.jsonb('values').defaultTo('[]');
    table.jsonb('skills').defaultTo('[]');
    table.jsonb('achievements').defaultTo('[]');
    table.jsonb('funding').defaultTo('{}');
    table.integer('team_size').defaultTo(1);
    table.jsonb('looking_for').defaultTo('{}');
    table.string('availability').defaultTo('actively-looking');
    table.string('website');
    table.string('linkedin_url');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['user_id']);
    table.index(['company_stage']);
    table.index(['industry']);
    table.index(['location']);
    table.index(['availability']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('profiles');
};
