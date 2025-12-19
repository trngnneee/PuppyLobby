


select * from get_vaccine_list('', 1, 10);
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