








-------------------- Create new vaccine --------------------
CREATE OR REPLACE FUNCTION add_vaccine(
  p_vaccine_name text,
  p_price numeric,
  p_manufacture_date date,
  p_entry_date date,
  p_expiry_date date,
  p_quantity integer
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid;
  v_name_trim text := trim(coalesce(p_vaccine_name, ''));
BEGIN
  -- Validate input
  IF v_name_trim = '' THEN
    RETURN jsonb_build_object('status','error','message','vaccine_name is required');
  END IF;

  IF p_price IS NULL THEN
    RETURN jsonb_build_object('status','error','message','price is required');
  ELSIF p_price < 0 THEN
    RETURN jsonb_build_object('status','error','message','price must be >= 0');
  END IF;

  IF p_quantity IS NULL THEN
    RETURN jsonb_build_object('status','error','message','quantity is required');
  ELSIF p_quantity < 0 THEN
    RETURN jsonb_build_object('status','error','message','quantity must be >= 0');
  END IF;

  IF p_manufacture_date IS NOT NULL AND p_expiry_date IS NOT NULL THEN
    IF p_expiry_date < p_manufacture_date THEN
      RETURN jsonb_build_object('status','error','message','expiry_date must be on or after manufacture_date');
    END IF;
  END IF;

  IF p_entry_date IS NOT NULL THEN
    IF p_manufacture_date IS NOT NULL AND p_entry_date < p_manufacture_date THEN
      RETURN jsonb_build_object('status','error','message','entry_date cannot be before manufacture_date');
    END IF;
    IF p_expiry_date IS NOT NULL AND p_entry_date > p_expiry_date THEN
      RETURN jsonb_build_object('status','error','message','entry_date cannot be after expiry_date');
    END IF;
  END IF;

  -- Insert
  INSERT INTO vaccine (
    vaccine_name, price, manufacture_date, entry_date, expiry_date, quantity
  )
  VALUES (
    v_name_trim, p_price, p_manufacture_date, p_entry_date, p_expiry_date, p_quantity
  )
  RETURNING vaccine_id INTO v_id;

  RETURN jsonb_build_object('status','success','vaccine_id', v_id);
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('status','error','message','unique_violation');
  WHEN others THEN
    RETURN jsonb_build_object('status','error','message', SQLERRM);
END;
$$;




-------------------- Create new vaccine package --------------------
CREATE OR REPLACE FUNCTION add_vaccine_package(
  p_package_name TEXT,
  p_duration INT,
  p_description TEXT,
  p_discount_rate NUMERIC,
  p_total_original_price NUMERIC,
  p_schedule JSON
)
RETURNS JSON AS $$
DECLARE
  v_package_id UUID;
  item JSON;
  v_scheduled_week INT;
  v_dosage INT;
  v_vaccine_id UUID;
BEGIN
  -- 1. Tạo package vaccine
  INSERT INTO VaccinationPackage (
    package_name,
    duration,
    description,
    discount_rate,
    total_original_price
  )
  VALUES
    (p_package_name, p_duration, p_description, p_discount_rate, p_total_original_price)
  RETURNING package_id INTO v_package_id;

  -- 2. Lặp qua từng item trong schedule
  FOR item IN SELECT * FROM json_array_elements(p_schedule)
  LOOP
    v_scheduled_week := (item->>'scheduled_week')::INT;
    v_dosage := (item->>'dosage')::INT;
    v_vaccine_id := (item->>'vaccine_id')::UUID;

    INSERT INTO VaccinationSchedule (
      package_id,
      scheduled_week,
      dosage,
      vaccine_id
    )
    VALUES (
      v_package_id,
      v_scheduled_week,
      v_dosage,
      v_vaccine_id
    );
  END LOOP;

  RETURN json_build_object(
    'code', 'success',
    'message', 'Package vaccine created successfully',
    'package_id', v_package_id
  );
END;
$$ LANGUAGE plpgsql;










------------- --Get vaccine list with pagination and search----------------
create or replace function get_vaccine_list (
    v_search text default '',
    v_page int default 1,
    v_page_size int default 10
)
returns table (
    vaccine_info jsonb,
    total_count bigint
)
as 
$$
declare 
    offset_value int := (v_page - 1) * v_page_size;
begin

    RETURN QUERY
    WITH filtered_vac AS (
        SELECT * FROM vaccine
        WHERE 
            v_search = '' OR v_search IS NULL
            OR fts @@ plainto_tsquery('english', remove_accents(v_search) || ':*')
    ),
    total_stat AS (
        SELECT count(*) as full_count FROM filtered_vac
    )
    SELECT 
        jsonb_build_object(
            'vaccine_id', v.vaccine_id,
            'vaccine_name', v.vaccine_name,
            'price', v.price,
            'manufacture_date', v.manufacture_date,
            'entry_date', v.entry_date,
            'expiry_date', v.expiry_date,
            'quantity', v.quantity
        ) AS vaccine_info,
        ts.full_count
    FROM filtered_vac v
    CROSS JOIN total_stat ts
    ORDER BY v.vaccine_id
    LIMIT v_page_size OFFSET offset_value;

end
$$ language plpgsql stable;


----------- Get list vaccine in paackage -------------
select * from get_list_vaccine_in_package('', 1, 10);

create or replace function get_list_vaccine_in_package (
    p_keyword text default '',
    p_page int default 1,
    p_page_size int default 10
)
returns table (
    vaccine_package_info jsonb,
    total_count bigint
)
as
$$
begin

    return QUERY
    with filtered_vp AS (
        SELECT * FROM vaccinationpackage
        WHERE 
            p_keyword = '' OR p_keyword IS NULL
            OR fts @@ plainto_tsquery('english', remove_accents(p_keyword) || ':*')
    ),
    total_stat AS (
        SELECT count(*) as full_count FROM filtered_vp
    )
    select
        jsonb_build_object(
            'package_id', vp.package_id,
            'package_name', vp.package_name,
            'description', vp.description,
            'duration', vp.duration,
            'discount_rate', vp.discount_rate,
            'total_original_price', vp.total_original_price,
            'schedule', (
                select coalesce(jsonb_agg(
                    jsonb_build_object(
                        'vaccine_id', v.vaccine_id,
                        'vaccine_name', v.vaccine_name,
                        'dosage', vs.dosage,
                        'scheduled_week', vs.scheduled_week
                    )
                ), '[]'::jsonb)
                from vaccine v
                join vaccinationschedule vs on v.vaccine_id = vs.vaccine_id
                where vs.package_id = vp.package_id
            )
        )
     as vaccine_package_info, ts.full_count
    from filtered_vp vp
    cross join total_stat ts
    order by vp.package_id
    limit p_page_size offset (p_page - 1) * p_page_size;

end
$$ language plpgsql stable;