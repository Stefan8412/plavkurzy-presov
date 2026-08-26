insert into public.locations (
  name,
  address,
  city,
  description
)
values
(
  'Plaváreň Prešov',
  'Mestská športová hala, Prešov',
  'Prešov',
  'Moderný bazén vhodný pre detské aj dospelé plavecké kurzy.'
),
(
  'Aquapark Delňa',
  'Delňa, Prešov',
  'Prešov',
  'Areál s bazénmi vhodnými na výučbu plávania.'
);

insert into public.trainers (
  first_name,
  last_name,
  bio,
  image_url,
  email,
  phone,
  active
)
values
(
  'Martin',
  'Novák',
  'Certifikovaný tréner plávania so skúsenosťami s výučbou detí aj dospelých.',
  null,
  'martin@example.com',
  '+421 900 000 001',
  true
),
(
  'Petra',
  'Kováčová',
  'Trénerka so zameraním na prvé kroky detí vo vode a zdokonaľovanie plaveckej techniky.',
  null,
  'petra@example.com',
  '+421 900 000 002',
  true
),
(
  'Tomáš',
  'Horváth',
  'Tréner plávania so zameraním na techniku a kondičné plávanie.',
  null,
  'tomas@example.com',
  '+421 900 000 003',
  true
);
insert into public.courses (
  slug,
  title,
  description,
  category,
  level,
  age_min,
  age_max,
  price,
  currency,
  lesson_duration_minutes,
  number_of_lessons,
  features,
  active
)
values
(
  'plavanie-deti-zaciatocnici',
  'Plávanie pre deti – začiatočníci',
  'Kurz určený pre deti, ktoré sa s plávaním ešte len zoznamujú. Deti sa naučia bezpečne pohybovať vo vode, správne dýchať a postupne zvládnu základné plavecké techniky.',
  'children',
  'beginner',
  4,
  8,
  120.00,
  'EUR',
  45,
  10,
  '[
    "Malé skupiny",
    "Individuálny prístup",
    "Certifikovaní tréneri",
    "10 lekcií"
  ]'::jsonb,
  true
),
(
  'plavanie-deti-pokrocili',
  'Plávanie pre deti – pokročilí',
  'Kurz pre deti, ktoré už ovládajú základné plavecké zručnosti a chcú zlepšiť techniku, vytrvalosť a istotu vo vode.',
  'children',
  'intermediate',
  7,
  12,
  135.00,
  'EUR',
  60,
  10,
  '[
    "Zdokonaľovanie techniky",
    "Malé skupiny",
    "Kondičné cvičenia",
    "10 lekcií"
  ]'::jsonb,
  true
),
(
  'plavanie-dospeli-zaciatocnici',
  'Plávanie pre dospelých – začiatočníci',
  'Kurz pre dospelých, ktorí sa chcú naučiť plávať alebo získať väčšiu istotu vo vode.',
  'adults',
  'beginner',
  18,
  null,
  150.00,
  'EUR',
  60,
  10,
  '[
    "Malé skupiny",
    "Individuálny prístup",
    "10 lekcií"
  ]'::jsonb,
  true
);
insert into public.course_terms (
  course_id,
  location_id,
  trainer_id,
  day_of_week,
  start_time,
  end_time,
  start_date,
  end_date,
  capacity,
  status
)
values
(
  (
    select id
    from public.courses
    where slug = 'plavanie-deti-zaciatocnici'
  ),
  (
    select id
    from public.locations
    where name = 'Plaváreň Prešov'
  ),
  (
    select id
    from public.trainers
    where first_name = 'Martin'
      and last_name = 'Novák'
  ),
  1,
  '16:00',
  '16:45',
  '2026-09-07',
  '2026-11-09',
  8,
  'available'
),
(
  (
    select id
    from public.courses
    where slug = 'plavanie-deti-zaciatocnici'
  ),
  (
    select id
    from public.locations
    where name = 'Aquapark Delňa'
  ),
  (
    select id
    from public.trainers
    where first_name = 'Petra'
      and last_name = 'Kováčová'
  ),
  3,
  '16:00',
  '16:45',
  '2026-09-09',
  '2026-11-11',
  8,
  'available'
);
insert into public.course_terms (
  course_id,
  location_id,
  trainer_id,
  day_of_week,
  start_time,
  end_time,
  start_date,
  end_date,
  capacity,
  status
)
values
(
  (
    select id
    from public.courses
    where slug = 'plavanie-deti-pokrocili'
  ),
  (
    select id
    from public.locations
    where name = 'Plaváreň Prešov'
  ),
  (
    select id
    from public.trainers
    where first_name = 'Tomáš'
      and last_name = 'Horváth'
  ),
  2,
  '17:00',
  '18:00',
  '2026-09-08',
  '2026-11-10',
  10,
  'available'
);
insert into public.course_terms (
  course_id,
  location_id,
  trainer_id,
  day_of_week,
  start_time,
  end_time,
  start_date,
  end_date,
  capacity,
  status
)
values
(
  (
    select id
    from public.courses
    where slug = 'plavanie-dospeli-zaciatocnici'
  ),
  (
    select id
    from public.locations
    where name = 'Plaváreň Prešov'
  ),
  (
    select id
    from public.trainers
    where first_name = 'Petra'
      and last_name = 'Kováčová'
  ),
  4,
  '18:00',
  '19:00',
  '2026-09-09',
  '2026-11-11',
  10,
  'available'
);