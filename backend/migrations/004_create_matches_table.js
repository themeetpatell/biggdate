exports.up = function(knex) {
  return knex.schema.createTable('matches', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('matched_user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('status', ['pending', 'accepted', 'rejected', 'expired']).defaultTo('pending');
    table.decimal('match_score', 5, 2);
    table.jsonb('match_reasons').defaultTo('[]');
    table.timestamp('matched_at').defaultTo(knex.fn.now());
    table.timestamp('responded_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['user_id']);
    table.index(['matched_user_id']);
    table.index(['status']);
    table.index(['match_score']);
    table.unique(['user_id', 'matched_user_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('matches');
};
