



select get_product_type_list('medicine', '', 1, 15);


---------------Get list product by type, search, pagination----------------
create or replace function get_product_type_list (
    p_type text,
    p_search text default null,
    p_page int default 1,
    p_page_size int default 10
)
returns table (
    product_info jsonb,
    extra_info jsonb,
    total_count bigint
)
as $$
    declare 
        offset_value int := (p_page - 1) * p_page_size;
    begin
        RETURN QUERY
        WITH filtered_prod AS (
            SELECT * FROM product
            WHERE type = p_type
            AND (
                p_search IS NULL OR p_search = ''
                OR fts @@ plainto_tsquery('english', remove_accents(p_search) || ':*')
            )
        ),
        total_stat AS (
            SELECT count(*) as full_count FROM filtered_prod
        )
        SELECT 
            jsonb_build_object(
                'product_id', p.product_id,
                'product_name', p.product_name,
                'price', p.price,
                'type', p.type,
                'images', p.images,
                'manufacture_date', p.manufacture_date,
                'expiry_date', p.expiry_date,
                'entry_date', p.entry_date,
                'stock', p.stock
            ) AS product_info,
            -- Xử lý lấy thông tin extra dựa trên type
            CASE 
                WHEN p_type = 'medicine' THEN to_jsonb(m.*) - 'product_id' -- Lấy hết cột bảng medicine, trừ ID
                WHEN p_type = 'accessory' THEN to_jsonb(a.*) - 'product_id'
                WHEN p_type = 'food' THEN to_jsonb(f.*) - 'product_id'
                ELSE '{}'::jsonb
            END AS extra_info,
            ts.full_count
        FROM filtered_prod p
        CROSS JOIN total_stat ts

        LEFT JOIN medicine m ON p.product_id = m.product_id AND p_type = 'medicine'
        LEFT JOIN accessory a ON p.product_id = a.product_id AND p_type = 'accessory'
        LEFT JOIN food f ON p.product_id = f.product_id AND p_type = 'food'
        ORDER BY p.product_id
        LIMIT p_page_size OFFSET offset_value;
    end;
$$ language plpgsql stable;



-------------------- Create new product --------------------


create or replace function create_product (
    product_info jsonb,
    extra_info jsonb
)
returns jsonb 
as 
$$
declare 
    new_product_id uuid;
    product_type text;
begin

    -- Insert into product table
    insert into product (
        product_name,
        price,
        manufacture_date,
        entry_date,
        expiry_date,
        stock,
        type,
        images
    ) values (
        product_info ->> 'product_name',
        (product_info ->> 'price')::numeric,
        (product_info ->> 'manufacture_date')::date,
        (product_info ->> 'entry_date')::date,
        (product_info ->> 'expiry_date')::date,
        (product_info ->> 'stock')::int,
        product_info ->> 'type',
        (
        SELECT COALESCE(
            ARRAY_AGG(x)::text[], 
            ARRAY[]::text[]
        )
        FROM jsonb_array_elements_text(product_info -> 'images') AS x
)
    )
    returning product_id into new_product_id;

    product_type := product_info ->> 'type';


    -- Insert into subtype table based on product type

    if product_type = 'medicine' then
        insert into medicine (
            product_id,
            species,
            dosage_use,
            side_effect
        ) values (
            new_product_id,
            extra_info ->> 'species',
            extra_info ->> 'dosage_use',
            extra_info ->> 'side_effect'
        );
    elsif product_type = 'food' then
        insert into food (
            product_id,
            species,
            weight,
            nutrition_description
        ) values (
            new_product_id,
            extra_info ->> 'species',
            (extra_info ->> 'weight')::numeric,
            extra_info ->> 'nutrition_description'
        );
    elsif product_type = 'accessory' then
        insert into accessory (
            product_id,
            size,
            color,
            material
        ) values (
            new_product_id,
            extra_info ->> 'size',
            extra_info ->> 'color',
            extra_info ->> 'material'
        );
    end if;

    -- Return result
    return jsonb_build_object(
        'code', 'success',
        'product_id', new_product_id
    );

    exception when others then
        return jsonb_build_object(
            'code', 'error',
            'message', sqlerrm
        );

end
$$ language plpgsql VOLATILE;


-----------Get product detail by product_id------------
select * from get_product_detail('d425f854-d8bc-460f-97a1-88ba28e1a087')

create or replace function get_product_detail (
    p_product_id uuid
)
returns jsonb
as

$$

declare 
    prod_record record;
    extra_record record;
    result jsonb;

begin

    select * into prod_record from product where product_id = p_product_id;

    if not found then
        return jsonb_build_object(
            'code', 'not_found',
            'message', 'Product not found'
        );
    end if;

    -- Get extra info based on product type
    if prod_record.type = 'medicine' then
        select * into extra_record from medicine where product_id = p_product_id;
    elsif prod_record.type = 'food' then
        select * into extra_record from food where product_id = p_product_id;
    elsif prod_record.type = 'accessory' then
        select * into extra_record from accessory where product_id = p_product_id;
    end if;

    result := jsonb_build_object(
        'product_info', to_jsonb(prod_record) - 'fts',
        'extra_info', to_jsonb(extra_record) - 'product_id'
    );

    return result;


end
$$ language plpgsql stable;



-------------------- Update product --------------------

create or replace function update_product (
    p_product_id uuid,
    product_info jsonb,
    extra_info jsonb
)
returns jsonb
as
$$
begin

    -- Update product table
    update product set
        product_name = product_info ->> 'product_name',
        price = (product_info ->> 'price')::numeric,
        manufacture_date = (product_info ->> 'manufacture_date')::date,
        entry_date = (product_info ->> 'entry_date')::date,
        expiry_date = (product_info ->> 'expiry_date')::date,
        stock = (product_info ->> 'stock')::int,
        images = (
            SELECT COALESCE(
                ARRAY_AGG(x)::text[], 
                ARRAY[]::text[]
            )
            FROM jsonb_array_elements_text(product_info -> 'images') AS x
        )
    where product_id = p_product_id;

    -- Update subtype table based on product type
    if product_info ->> 'type' = 'medicine' then
        update medicine set
            species = extra_info ->> 'species',
            dosage_use = extra_info ->> 'dosage_use',
            side_effect = extra_info ->> 'side_effect'
        where product_id = p_product_id;
    elsif product_info ->> 'type' = 'food' then
        update food set
            species = extra_info ->> 'species',
            weight = (extra_info ->> 'weight')::numeric,
            nutrition_description = extra_info ->> 'nutrition_description'
        where product_id = p_product_id;
    elsif product_info ->> 'type' = 'accessory' then
        update accessory set
            size = extra_info ->> 'size',
            color = extra_info ->> 'color',
            material = extra_info ->> 'material'
        where product_id = p_product_id;
    end if;

    return jsonb_build_object(
        'code', 'success',
        'message', 'Product updated successfully'
    );

    exception when others then
        return jsonb_build_object(
            'code', 'error',
            'message', sqlerrm
        );


end
$$ language plpgsql VOLATILE;