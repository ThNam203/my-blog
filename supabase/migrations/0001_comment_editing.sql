-- Apply in the Supabase SQL editor after the base schema.sql.
-- Adds the updated_at column for comment editing and grants users UPDATE on their own rows.

alter table public.comments
  add column if not exists updated_at timestamptz;

drop policy if exists "users can update own comments" on public.comments;
create policy "users can update own comments"
  on public.comments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
