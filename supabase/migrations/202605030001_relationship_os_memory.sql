-- Maahi Relationship OS memory core
-- Adds first-class fields for relationship stage tracking and pattern engine snapshots.

alter table session_memory
  add column if not exists relationship_core   text not null default '{}',
  add column if not exists pattern_engine      text not null default '{}',
  add column if not exists relationship_os     text not null default '{}',
  add column if not exists conversation_count  integer not null default 0;
