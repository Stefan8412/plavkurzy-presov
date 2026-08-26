create extension if not exists "pgcrypto";
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  first_name text not null,
  last_name text not null,

  phone text,

  role text not null default 'parent'
    check (role in ('parent', 'trainer', 'admin')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.locations (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  address text,

  city text not null default 'Prešov',

  description text,

  created_at timestamptz not null default now()
);
create table public.trainers (
  id uuid primary key default gen_random_uuid(),

  first_name text not null,
  last_name text not null,

  bio text,

  image_url text,

  email text,
  phone text,

  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.children (
  id uuid primary key default gen_random_uuid(),

  parent_id uuid not null
    references public.profiles(id)
    on delete cascade,

  first_name text not null,
  last_name text not null,

  date_of_birth date not null,

  gender text
    check (gender in ('male', 'female', 'other')),

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.courses (
  id uuid primary key default gen_random_uuid(),

  slug text not null unique,

  title text not null,
  description text not null,

  category text not null
    check (
      category in (
        'children',
        'adults',
        'individual',
        'camp'
      )
    ),

  level text not null
    check (
      level in (
        'beginner',
        'intermediate',
        'advanced'
      )
    ),

  age_min integer,
  age_max integer,

  price numeric(10, 2) not null,
  currency text not null default 'EUR',

  lesson_duration_minutes integer not null,
  number_of_lessons integer not null,

  image_url text,

  features jsonb not null default '[]'::jsonb,

  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (age_min is null or age_min >= 0),
  check (age_max is null or age_max >= age_min),
  check (price >= 0),
  check (lesson_duration_minutes > 0),
  check (number_of_lessons > 0)
);
create table public.course_terms (
  id uuid primary key default gen_random_uuid(),

  course_id uuid not null
    references public.courses(id)
    on delete cascade,

  location_id uuid not null
    references public.locations(id),

  trainer_id uuid
    references public.trainers(id)
    on delete set null,

  day_of_week integer not null
    check (day_of_week between 1 and 7),

  start_time time not null,
  end_time time not null,

  start_date date not null,
  end_date date not null,

  capacity integer not null
    check (capacity > 0),

  status text not null default 'available'
    check (
      status in (
        'available',
        'full',
        'closed'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (end_time > start_time),
  check (end_date >= start_date)
);
create table public.registrations (
  id uuid primary key default gen_random_uuid(),

  child_id uuid not null
    references public.children(id)
    on delete cascade,

  course_term_id uuid not null
    references public.course_terms(id)
    on delete cascade,

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'confirmed',
        'cancelled',
        'completed'
      )
    ),

  note text,

  registered_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  unique (child_id, course_term_id)
);
create index idx_children_parent_id
on public.children(parent_id);

create index idx_course_terms_course_id
on public.course_terms(course_id);

create index idx_course_terms_location_id
on public.course_terms(location_id);

create index idx_course_terms_trainer_id
on public.course_terms(trainer_id);

create index idx_registrations_child_id
on public.registrations(child_id);

create index idx_registrations_course_term_id
on public.registrations(course_term_id);

create index idx_registrations_status
on public.registrations(status);
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at();
create trigger children_updated_at
before update on public.children
for each row
execute function public.update_updated_at();
create trigger trainers_updated_at
before update on public.trainers
for each row
execute function public.update_updated_at();
create trigger courses_updated_at
before update on public.courses
for each row
execute function public.update_updated_at();
create trigger course_terms_updated_at
before update on public.course_terms
for each row
execute function public.update_updated_at();
create trigger registrations_updated_at
before update on public.registrations
for each row
execute function public.update_updated_at();