exports.up = function(knex) {
  return knex.schema.createTable('stakeholders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('email');
    table.string('phone');
    table.string('company');
    table.string('title');
    table.string('linkedin_url');
    table.string('twitter_handle');
    table.enum('type', [
      'advisor',
      'investor',
      'mentor',
      'early-adopter',
      'beta-tester',
      'supporter',
      'team-prospect'
    ]).notNullable();
    table.enum('status', ['active', 'inactive', 'archived']).defaultTo('active');
    table.text('notes');
    table.jsonb('tags').defaultTo('[]');
    table.jsonb('custom_fields').defaultTo('{}');
    table.date('last_contact_date');
    table.date('next_followup_date');
    table.integer('relationship_strength').defaultTo(5).comment('1-10 scale');
    table.boolean('is_favorite').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['user_id']);
    table.index(['type']);
    table.index(['status']);
    table.index(['is_favorite']);
    table.index(['next_followup_date']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('stakeholders');
};

