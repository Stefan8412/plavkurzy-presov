alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.registrations enable row level security;

alter table public.courses enable row level security;
alter table public.course_terms enable row level security;
alter table public.locations enable row level security;
alter table public.trainers enable row level security;

create policy "Public can view active courses"
on public.courses
for select
to anon, authenticated
using (
  active = true
);

create policy "Public can view available course terms"
on public.course_terms
for select
to anon, authenticated
using (
  status in ('available', 'full')
);

create policy "Public can view locations"
on public.locations
for select
to anon, authenticated
using (true);

create policy "Public can view active trainers"
on public.trainers
for select
to anon, authenticated
using (
  active = true
);
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
);

create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if old.role = 'parent' and new.role <> 'parent' then
      raise exception 'Changing role is not allowed';
    end if;
  end if;

  return new;
end;
$$;

create trigger prevent_profile_role_change
before update on public.profiles
for each row
execute function public.prevent_role_change();

create policy "Parents can view their own children"
on public.children
for select
to authenticated
using (
  parent_id = auth.uid()
);

create policy "Parents can create their own children"
on public.children
for insert
to authenticated
with check (
  parent_id = auth.uid()
);
create policy "Parents can update their own children"
on public.children
for update
to authenticated
using (
  parent_id = auth.uid()
)
with check (
  parent_id = auth.uid()
);
create policy "Parents can delete their own children"
on public.children
for delete
to authenticated
using (
  parent_id = auth.uid()
);
create policy "Parents can view their registrations"
on public.registrations
for select
to authenticated
using (
  exists (
    select 1
    from public.children c
    where c.id = registrations.child_id
      and c.parent_id = auth.uid()
  )
);
create policy "Parents can create registrations for their children"
on public.registrations
for insert
to authenticated
with check (
  exists (
    select 1
    from public.children c
    where c.id = child_id
      and c.parent_id = auth.uid()
  )
);
create policy "Parents can update their registrations"
on public.registrations
for update
to authenticated
using (
  exists (
    select 1
    from public.children c
    where c.id = registrations.child_id
      and c.parent_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.children c
    where c.id = registrations.child_id
      and c.parent_id = auth.uid()
  )
);
create policy "Parents can delete their registrations"
on public.registrations
for delete
to authenticated
using (
  exists (
    select 1
    from public.children c
    where c.id = registrations.child_id
      and c.parent_id = auth.uid()
  )
);