-- Profile enrichment v2: attraction/chemistry, relationship reality,
-- emotional availability, life logistics, cultural compatibility,
-- love language give/receive, and social links.

alter table profiles
  add column if not exists attraction_preferences text not null default '[]',
  add column if not exists turn_ons               text not null default '[]',
  add column if not exists turn_offs              text not null default '[]',
  add column if not exists relationship_timeline  text,
  add column if not exists dating_stage           text,
  add column if not exists long_distance_open     text,
  add column if not exists emotional_availability text,
  add column if not exists residency_status       text,
  add column if not exists relocation_open        text,
  add column if not exists work_intensity         text,
  add column if not exists family_involvement     text,
  add column if not exists cultural_alignment     text,
  add column if not exists marriage_type          text,
  add column if not exists love_language_give     text not null default '[]',
  add column if not exists love_language_receive  text not null default '[]',
  add column if not exists linkedin_url           text not null default '',
  add column if not exists website_url            text not null default '';
