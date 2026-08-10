-- This seed creates institution shells only. All rows are explicitly demo data.
with source as (
  insert into public.data_sources (
    title, url, publisher, academic_year, checked_at, notes, verification
  ) values (
    'CreditMap competition demo dataset',
    '/about#methodology',
    'CreditMap',
    'Illustrative only',
    current_date,
    'Fictional records used to demonstrate the product workflow.',
    'demo'
  ) returning id
)
insert into public.universities (slug, name, short_name, city, state_code, verification, source_id)
select values.slug, values.name, values.short_name, values.city, 'FL', 'demo', source.id
from source
cross join (values
  ('university-of-florida', 'University of Florida', 'UF', 'Gainesville'),
  ('florida-international-university', 'Florida International University', 'FIU', 'Miami'),
  ('florida-state-university', 'Florida State University', 'FSU', 'Tallahassee'),
  ('university-of-central-florida', 'University of Central Florida', 'UCF', 'Orlando'),
  ('university-of-south-florida', 'University of South Florida', 'USF', 'Tampa')
) as values(slug, name, short_name, city)
on conflict (slug) do nothing;
