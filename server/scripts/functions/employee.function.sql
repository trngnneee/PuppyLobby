



-------------------- Add employee --------------------
CREATE OR REPLACE FUNCTION addEmployee(
  p_username TEXT,
  p_email TEXT,
  p_password TEXT,
  p_fullname TEXT,
  p_date_of_birth DATE,
  p_gender gender_enum,
  p_manager_id TEXT,
  p_type TEXT,
  p_degree TEXT,
  p_specialization TEXT
)
RETURNS JSON AS $$
DECLARE
  v_exist_username INT;
  v_exist_email INT;
  v_role_id UUID;
  v_account_id UUID;
  v_employee_id UUID;
BEGIN
  -- Check username exists
  IF checkUsernameExists(p_username) THEN
    RETURN json_build_object('code', 'error', 'message', 'Username already exists');
  END IF;

  -- Check email exists
  IF checkEmailExists(p_email) THEN
    RETURN json_build_object('code', 'error', 'message', 'Email already exists');
  END IF;

  IF v_exist_email > 0 THEN
    RETURN json_build_object('code', 'error', 'message', 'Email already exists');
  END IF;

  -- Get employee role_id
  SELECT role_id INTO v_role_id
  FROM role
  WHERE role_name = 'employee';

  -- Insert account
  INSERT INTO account(username, email, password, role_id)
  VALUES(p_username, p_email, p_password, v_role_id)
  RETURNING account_id INTO v_account_id;

  -- Insert employee
  INSERT INTO employee(employee_name, date_of_birth, gender, manager_id, account_id)
  VALUES(p_fullname, p_date_of_birth, p_gender, NULLIF(p_manager_id, '')::UUID, v_account_id)
  RETURNING employee_id INTO v_employee_id;

  -- Insert veterinarian if needed
  IF p_type = 'veterinarian' THEN
    INSERT INTO veterinarian(employee_id, degree, specialization)
    VALUES (v_employee_id, p_degree, p_specialization);
  END IF;

  RETURN json_build_object('code', 'success', 'message', 'Created employee successfully');
END;
$$ LANGUAGE plpgsql;



-------------------- Assign Employee to work --------------------
CREATE OR REPLACE FUNCTION assignEmployeeToBranch(
  p_branch_id UUID,
  p_employee_id UUID,
  p_position TEXT,
  p_start_date DATE,
  p_end_date DATE,
  p_salary NUMERIC
)
RETURNS JSON AS $$
DECLARE
  v_conflict_count INT;
BEGIN
  SELECT COUNT(*)
  INTO v_conflict_count
  FROM employeehistory
  WHERE employee_id = p_employee_id
    AND branch_id = p_branch_id
    AND (
         p_start_date <= end_date
         AND p_end_date >= start_date
    );

  IF v_conflict_count > 0 THEN
    RETURN json_build_object(
      'code', 'error',
      'message', 'Employee already assigned to this branch in the selected date range'
    );
  END IF;

  -- update end-date để đóng lịch làm việc này
  UPDATE employeehistory
  SET end_date = p_start_date - INTERVAL '1 day'
  WHERE employee_id = p_employee_id
    AND end_date IS NULL;

  INSERT INTO employeehistory (
    employee_id, branch_id, position,
    start_date, end_date, salary
  )
  VALUES (
    p_employee_id, p_branch_id, p_position,
    p_start_date, p_end_date, p_salary
  );

  RETURN json_build_object(
    'code', 'success',
    'message', 'Employee assigned successfully'
  );
END;
$$ LANGUAGE plpgsql;



-------------------- Check if an employee is an manager --------------------
CREATE OR REPLACE FUNCTION checkManager(
  p_account_id uuid
)
RETURNS BOOLEAN AS $$
DECLARE
  is_manager BOOLEAN;
BEGIN
  SELECT (e.manager_id IS NULL)
  INTO is_manager
  FROM account a
  JOIN employee e ON e.account_id = a.account_id
  WHERE a.account_id = p_account_id
  LIMIT 1;

  RETURN COALESCE(is_manager, FALSE);
END;
$$ LANGUAGE plpgsql;

-------------------- Check if an employee is an veterinarian --------------------
CREATE OR REPLACE FUNCTION checkVeterinarian(
  p_account_id uuid
)
RETURNS BOOLEAN AS $$
DECLARE
  is_veterinarian BOOLEAN;
BEGIN
  SELECT 1
  INTO is_veterinarian
  FROM account a
  JOIN employee e ON e.account_id = a.account_id
  JOIN veterinarian v ON v.employee_id = e.employee_id
  WHERE a.account_id = p_account_id
  LIMIT 1;

  RETURN COALESCE(is_veterinarian, FALSE);
END;
$$ LANGUAGE plpgsql;






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


CREATE OR REPLACE FUNCTION get_employee_branch_history_list(
    p_branch_id UUID,
    p_page INT DEFAULT 1,
    p_page_size INT DEFAULT 9,
    p_keyword TEXT DEFAULT NULL
)
RETURNS TABLE (
    employee_id UUID,
    employee_name TEXT,
    date_of_birth DATE,
    gender GENDER_ENUM,
    degree TEXT,
    specialization TEXT,
    is_current_employee BOOLEAN,
    total_count BIGINT
)
LANGUAGE PLPGSQL
STABLE
AS $$
DECLARE 
    offset_value INT := (p_page - 1) * p_page_size;
BEGIN
    RETURN QUERY
    WITH filtered_emp AS (
        -- Bước 1: Lọc employees theo keyword và branch
        SELECT DISTINCT e.employee_id
        FROM employee e
        INNER JOIN employeehistory eh ON e.employee_id = eh.employee_id
        WHERE eh.branch_id = p_branch_id
          AND (
            p_keyword IS NULL 
            OR p_keyword = ''
            OR e.fts @@ plainto_tsquery('english', remove_accents(p_keyword) || ':*')
          )
    ),
    employee_data AS (
        -- Bước 2: Lấy thông tin chi tiết của employees (DISTINCT)
        SELECT 
            e.employee_id,
            e.employee_name,
            e.date_of_birth,
            e.gender,
            v.degree,
            v.specialization,
            CASE 
                WHEN MAX(eh.end_date) IS NULL THEN TRUE
                ELSE FALSE
            END AS is_current_employee
        FROM filtered_emp fe
        INNER JOIN employee e ON e.employee_id = fe.employee_id
        LEFT JOIN veterinarian v ON e.employee_id = v.employee_id
        LEFT JOIN employeehistory eh ON e.employee_id = eh.employee_id 
            AND eh.branch_id = p_branch_id
        GROUP BY e.employee_id, e.employee_name, e.date_of_birth, e.gender, 
                 v.degree, v.specialization
    )
    SELECT 
        ed.employee_id,
        ed.employee_name,
        ed.date_of_birth,
        ed.gender,
        ed.degree,
        ed.specialization,
        ed.is_current_employee,
        (SELECT COUNT(*) FROM employee_data) AS total_count
    FROM employee_data ed
    ORDER BY ed.employee_id
    LIMIT p_page_size
    OFFSET offset_value;
END;
$$;