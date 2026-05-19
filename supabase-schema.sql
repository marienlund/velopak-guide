-- ============================================
-- Velopak Guide - Supabase Database Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'courier' check (role in ('admin', 'courier')),
  created_at timestamptz not null default now()
);

-- Addresses
create table public.addresses (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null,
  street_address text not null,
  city text not null default 'København',
  zip text not null,
  notes text,
  google_maps_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Address Photos
create table public.address_photos (
  id uuid primary key default uuid_generate_v4(),
  address_id uuid references public.addresses(id) on delete cascade not null,
  storage_path text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_addresses_company on public.addresses using gin (to_tsvector('danish', company_name));
create index idx_addresses_street on public.addresses using gin (to_tsvector('danish', street_address));
create index idx_addresses_zip on public.addresses(zip);
create index idx_address_photos_address on public.address_photos(address_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_address_update
  before update on public.addresses
  for each row execute procedure public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'courier');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.address_photos enable row level security;

-- Profiles: users can read all profiles, update own
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Addresses: all authenticated can read, only admins can insert/update/delete
create policy "Addresses are viewable by authenticated users"
  on public.addresses for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert addresses"
  on public.addresses for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update addresses"
  on public.addresses for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete addresses"
  on public.addresses for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Address Photos: same pattern as addresses
create policy "Photos are viewable by authenticated users"
  on public.address_photos for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert photos"
  on public.address_photos for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update photos"
  on public.address_photos for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete photos"
  on public.address_photos for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- STORAGE
-- ============================================

-- Create bucket for address photos
insert into storage.buckets (id, name, public)
values ('address-photos', 'address-photos', true);

-- Storage policies
create policy "Authenticated users can view photos"
  on storage.objects for select
  using (bucket_id = 'address-photos' and auth.role() = 'authenticated');

create policy "Admins can upload photos"
  on storage.objects for insert
  with check (
    bucket_id = 'address-photos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete photos"
  on storage.objects for delete
  using (
    bucket_id = 'address-photos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
