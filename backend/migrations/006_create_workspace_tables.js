exports.up = function(knex) {
  return Promise.all([
    // Projects table
    knex.schema.createTable('projects', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('name').notNullable();
      table.text('description');
      table.enum('status', ['planning', 'in-progress', 'completed', 'on-hold']).defaultTo('planning');
      table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
      table.date('start_date');
      table.date('due_date');
      table.jsonb('tags').defaultTo('[]');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index(['user_id']);
      table.index(['status']);
      table.index(['priority']);
    }),

    // Milestones table
    knex.schema.createTable('milestones', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
      table.string('title').notNullable();
      table.text('description');
      table.enum('status', ['pending', 'in-progress', 'completed']).defaultTo('pending');
      table.date('target_date');
      table.date('completed_date');
      table.integer('progress').defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index(['project_id']);
      table.index(['status']);
      table.index(['target_date']);
    }),

    // Tasks table
    knex.schema.createTable('tasks', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
      table.uuid('milestone_id').references('id').inTable('milestones').onDelete('SET NULL');
      table.string('title').notNullable();
      table.text('description');
      table.enum('status', ['todo', 'in-progress', 'review', 'done']).defaultTo('todo');
      table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
      table.uuid('assignee_id').references('id').inTable('users').onDelete('SET NULL');
      table.date('due_date');
      table.jsonb('tags').defaultTo('[]');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index(['project_id']);
      table.index(['milestone_id']);
      table.index(['assignee_id']);
      table.index(['status']);
      table.index(['priority']);
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('tasks'),
    knex.schema.dropTable('milestones'),
    knex.schema.dropTable('projects')
  ]);
};
