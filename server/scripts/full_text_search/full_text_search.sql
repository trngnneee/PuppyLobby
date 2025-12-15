CREATE OR REPLACE FUNCTION remove_accents(text)
RETURNS text AS $$
SELECT translate(
    lower($1),
    'àáạảãâầấậẩẫăằắặẳẵđèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ',
    'aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy'
);
$$ LANGUAGE SQL IMMUTABLE;

-- fts cho employee 
alter table
  employee
add column
  fts tsvector generated always as (to_tsvector('english', remove_accents(employee_name))) stored;
  
create index employee_fts on employee using gin (fts);

-- fts cho vaccine
alter table
  vaccine
add column
  fts tsvector generated always as (to_tsvector('english', remove_accents(vaccine_name))) stored;
  
create index vaccine_fts on vaccine using gin (fts);

-- fts cho vaccine package
alter table
  vaccinationpackage
add column
  fts tsvector generated always as (to_tsvector('english', remove_accents(package_name) || ' ' || remove_accents(description))) stored;
  
create index package_fts on vaccinationpackage using gin (fts);

-- fts cho pet
alter table
  pet
add column
  fts tsvector generated always as (to_tsvector('english', remove_accents(pet_name) || ' ' || remove_accents(breed))) stored;
  
create index pet_fts on pet using gin (fts);



