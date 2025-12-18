






-- Function: get_employee_list(text, integer, integer) (already have )
create or replace function get_employee_list (
    p_keyword text default null,
    p_page int default 1,
    p_page_size int default 10
) 
returns table (
    employee_id uuid,
    employee_name text,
    date_of_birth date,
    gender gender_enum,
    manager_id uuid,
    manager_name text,
    working_branch text,
    total_count bigint
)
as $$
    declare 
        offset_value int := (p_page - 1) * p_page_size;
    begin
        RETURN QUERY
        WITH filtered_emp AS (
            -- Step 1: Filter employees based on the search keyword
            SELECT * FROM employee
            WHERE (p_keyword IS NULL OR p_keyword = '')
            OR fts @@ plainto_tsquery('english', remove_accents(p_keyword) || ':*')
        ),
        total_stat AS (
            -- Step 2: Get the total count of filtered employees
            SELECT count(*) as full_count FROM filtered_emp
        )
        SELECT 
            e.employee_id,
            e.employee_name,
            e.date_of_birth,
            e.gender,
            e.manager_id,
            m.employee_name AS manager_name,
            wh.branch_name AS working_branch,
            ts.full_count
        FROM filtered_emp e
        LEFT JOIN employee m ON e.manager_id = m.employee_id
        LEFT JOIN LATERAL (
            -- Take the most recent branch from EmployeeHistory
            SELECT b.branch_name 
            FROM employeehistory eh
            JOIN branch b ON eh.branch_id = b.branch_id
            WHERE eh.employee_id = e.employee_id
            ORDER BY eh.start_date DESC
            LIMIT 1
        ) wh ON TRUE
        CROSS JOIN total_stat ts
        ORDER BY e.employee_id
        LIMIT p_page_size
        OFFSET offset_value;

    end

$$ language plpgsql stable;


