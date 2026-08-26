-- ============================================================
-- CANCEL REGISTRATION
-- ============================================================

create or replace function public.cancel_registration(
  p_registration_id uuid
)
returns public.registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_registration public.registrations;
  v_parent_id uuid;
begin

  -- ----------------------------------------------------------
  -- 1. Nájdeme registráciu + overíme, že patrí aktuálnemu
  --    rodičovi
  -- ----------------------------------------------------------

  select r.*
  into v_registration
  from public.registrations r
  join public.children c
    on c.id = r.child_id
  where r.id = p_registration_id
    and c.parent_id = auth.uid()
  for update of r;

  if v_registration.id is null then
    raise exception 'Registration not found';
  end if;


  -- ----------------------------------------------------------
  -- 2. Registrácia už bola zrušená
  -- ----------------------------------------------------------

  if v_registration.status = 'cancelled' then
    raise exception 'Registration is already cancelled';
  end if;


  -- ----------------------------------------------------------
  -- 3. Completed registráciu už rodič nemôže zrušiť
  -- ----------------------------------------------------------

  if v_registration.status = 'completed' then
    raise exception 'Completed registration cannot be cancelled';
  end if;


  -- ----------------------------------------------------------
  -- 4. Zamkneme course term
  -- ----------------------------------------------------------

  perform 1
  from public.course_terms
  where id = v_registration.course_term_id
  for update;


  -- ----------------------------------------------------------
  -- 5. Zrušíme registráciu
  -- ----------------------------------------------------------

  update public.registrations
  set
    status = 'cancelled',
    updated_at = now()
  where id = p_registration_id
  returning *
  into v_registration;


  -- ----------------------------------------------------------
  -- 6. Ak bol termín full, skontrolujeme jeho kapacitu
  -- ----------------------------------------------------------

  update public.course_terms ct
  set status = 'available'
  where ct.id = v_registration.course_term_id
    and ct.status = 'full'
    and (
      select count(*)
      from public.registrations r
      where r.course_term_id = ct.id
        and r.status in ('pending', 'confirmed')
    ) < ct.capacity;


  return v_registration;

end;
$$;


-- ============================================================
-- SECURITY
-- ============================================================

revoke execute
on function public.cancel_registration(uuid)
from public;


grant execute
on function public.cancel_registration(uuid)
to authenticated;