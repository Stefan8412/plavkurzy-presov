-- Remove the original unconditional unique constraint
alter table public.registrations
drop constraint registrations_child_id_course_term_id_key;


-- Allow only one active registration per child and term
create unique index registrations_active_child_term_unique
on public.registrations(child_id, course_term_id)
where status in ('pending', 'confirmed');


-- Atomic registration function
create or replace function public.register_child_for_course_term(
  p_child_id uuid,
  p_course_term_id uuid,
  p_note text default null
)
returns public.registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent_id uuid;
  v_capacity integer;
  v_registered_count integer;
  v_registration public.registrations;
begin

  select parent_id
  into v_parent_id
  from public.children
  where id = p_child_id;

  if v_parent_id is null then
    raise exception 'Child not found';
  end if;

  if v_parent_id <> auth.uid() then
    raise exception 'You do not have permission to register this child';
  end if;


  select capacity
  into v_capacity
  from public.course_terms
  where id = p_course_term_id
    and status = 'available'
  for update;

  if v_capacity is null then
    raise exception 'Course term is not available';
  end if;


  if exists (
    select 1
    from public.registrations
    where child_id = p_child_id
      and course_term_id = p_course_term_id
      and status in ('pending', 'confirmed')
  ) then
    raise exception 'Child is already registered for this course term';
  end if;


  select count(*)
  into v_registered_count
  from public.registrations
  where course_term_id = p_course_term_id
    and status in ('pending', 'confirmed');


  if v_registered_count >= v_capacity then

    update public.course_terms
    set status = 'full'
    where id = p_course_term_id;

    raise exception 'Course term is full';
  end if;


  insert into public.registrations (
    child_id,
    course_term_id,
    status,
    note
  )
  values (
    p_child_id,
    p_course_term_id,
    'pending',
    p_note
  )
  returning *
  into v_registration;


  if v_registered_count + 1 >= v_capacity then

    update public.course_terms
    set status = 'full'
    where id = p_course_term_id;

  end if;


  return v_registration;

end;
$$;


revoke execute
on function public.register_child_for_course_term(uuid, uuid, text)
from public;


grant execute
on function public.register_child_for_course_term(uuid, uuid, text)
to authenticated;