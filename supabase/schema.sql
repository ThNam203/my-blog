-- Run this in the Supabase SQL editor

-- Profiles: one per auth user, stores display name
create table public.profiles (
  id            uuid        primary key references auth.users(id) on delete cascade,
  display_name  text        not null,
  created_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup, pulling display_name from user_metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Comments: 2-level threading (parent_id = null → top-level, parent_id = top-level id → reply)
create table public.comments (
  id          uuid        primary key default gen_random_uuid(),
  post_slug   text        not null,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  parent_id   uuid        references public.comments(id) on delete cascade,
  body        text        not null check (char_length(body) between 1 and 2000),
  created_at  timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "comments are viewable by everyone"
  on public.comments for select using (true);

create policy "authenticated users can insert comments"
  on public.comments for insert with check (auth.uid() = user_id);

-- Users can delete only their own comments (admin deletion is handled server-side via service role)
create policy "users can delete own comments"
  on public.comments for delete using (auth.uid() = user_id);

-- Index for fast per-post queries
create index comments_post_slug_idx on public.comments(post_slug);
create index comments_parent_id_idx on public.comments(parent_id);
