



create or replace function get_list_branch_in_service ()
returns jsonb
as
$$
declare 
    result jsonb;
begin
    select jsonb_agg(
        jsonb_build_object(
            'service_id', s.service_id,
            'service_name', s.service_name,
            'service_base_price', s.service_base_price,
            'branches', (
                select coalesce(jsonb_agg(
                    jsonb_build_object(
                        'branch_id', b.branch_id,
                        'branch_name', b.branch_name,
                        'location', b.location,
                        'phone_number', b.phone_number,
                        'open_time', b.open_time,
                        'close_time', b.close_time
                    )
                ), '[]'::jsonb)
                from branch b
                join branchservice bs on b.branch_id = bs.branch_id
                where bs.service_id = s.service_id 
            )
        )
    )
    from service s
    into result;

    return coalesce(result, '[]'::jsonb);
end;
$$ language plpgsql stable;