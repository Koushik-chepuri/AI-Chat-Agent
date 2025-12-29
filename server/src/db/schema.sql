create extension if not exists pgcrypto;

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null
    references conversations(id)
    on delete cascade,
  role text not null check (role in ('user', 'ai')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_messages_conversation_created_at
on messages (conversation_id, created_at);
