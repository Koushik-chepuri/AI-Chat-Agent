-- Enable UUID generation
create extension if not exists pgcrypto;

-- Conversations table
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now()
);

-- Messages table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null
    references conversations(id)
    on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz default now()
);

-- Performance index
create index if not exists idx_messages_conversation_created_at
on messages (conversation_id, created_at);
