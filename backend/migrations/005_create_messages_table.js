exports.up = function(knex) {
  return knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('sender_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('receiver_id').references('id').inTable('users').onDelete('CASCADE');
    table.text('content').notNullable();
    table.enum('type', ['text', 'image', 'file', 'system']).defaultTo('text');
    table.jsonb('metadata').defaultTo('{}');
    table.boolean('is_read').defaultTo(false);
    table.timestamp('read_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['sender_id']);
    table.index(['receiver_id']);
    table.index(['created_at']);
    table.index(['is_read']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('messages');
};
