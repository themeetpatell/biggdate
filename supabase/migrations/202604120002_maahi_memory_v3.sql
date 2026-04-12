-- Maahi v3: extended session memory schema
-- Adds structured emotional intelligence fields to session_memory

alter table session_memory
  add column if not exists stable_traits       text not null default '[]',
  add column if not exists growth_edges        text not null default '[]',
  add column if not exists current_situation   text not null default '',
  add column if not exists recurring_themes    text not null default '[]',
  add column if not exists last_emotional_state text not null default '';
