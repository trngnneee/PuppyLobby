-------------------- Check username exist --------------------
CREATE OR REPLACE FUNCTION checkUsernameExists(p_username TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM account
  WHERE username = p_username;

  RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql;

-------------------- Check email exists --------------------
CREATE OR REPLACE FUNCTION checkEmailExists(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM account
  WHERE email = p_email;

  RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql;

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

-------------------- Create new product --------------------
CREATE OR REPLACE FUNCTION createProduct(
  p_type TEXT,
  p_product_name TEXT,
  p_price NUMERIC,
  p_manufacture_date DATE,
  p_entry_date DATE,
  p_expiry_date DATE,
  p_stock INT,
  
  -- Medicine
  p_species TEXT DEFAULT NULL,
  p_dosage_use TEXT DEFAULT NULL,
  p_side_effect TEXT DEFAULT NULL,

  -- Food
  p_weight NUMERIC DEFAULT NULL,
  p_nutrition_description TEXT DEFAULT NULL,

  -- Accessory
  p_size TEXT DEFAULT NULL,
  p_color TEXT DEFAULT NULL,
  p_material TEXT DEFAULT NULL,

  -- Image list
  p_image_urls TEXT[] DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  new_product_id UUID;
BEGIN
  -------------------------------
  -- 1. Create Product
  -------------------------------
  INSERT INTO product(
    product_name, price, manufacture_date,
    entry_date, expiry_date, stock, type
  )
  VALUES (
    p_product_name, p_price, p_manufacture_date,
    p_entry_date, p_expiry_date, p_stock, p_type
  )
  RETURNING product_id INTO new_product_id;


  -------------------------------
  -- 2. Insert subtype by type
  -------------------------------
  IF p_type = 'medicine' THEN
    INSERT INTO medicine(product_id, species, dosage_use, side_effect)
    VALUES (new_product_id, p_species, p_dosage_use, p_side_effect);

  ELSIF p_type = 'food' THEN
    INSERT INTO food(product_id, species, weight, nutrition_description)
    VALUES (new_product_id, p_species, p_weight, p_nutrition_description);

  ELSIF p_type = 'accessory' THEN
    INSERT INTO accessory(product_id, size, color, material)
    VALUES (new_product_id, p_size, p_color, p_material);

  END IF;


  -------------------------------
  -- 3. Insert images
  -------------------------------
  IF p_image_urls IS NOT NULL THEN
    INSERT INTO productimage(product_id, image_url)
    SELECT new_product_id, unnest(p_image_urls);
  END IF;


  -------------------------------
  -- 4. Return output
  -------------------------------
  RETURN json_build_object(
    'code', 'success',
    'product_id', new_product_id
  );

END;
$$ LANGUAGE plpgsql;

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

-------------------- Create new customer account --------------------
CREATE OR REPLACE FUNCTION createCustomerAccount(
  p_fullname TEXT,
  p_username TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_citizen_id TEXT,
  p_password TEXT
)
RETURNS JSON AS $$
DECLARE
  v_role_id UUID;
  v_account_id UUID;
  v_customer_id UUID;  
  v_level_id UUID;
BEGIN
  -- Check username exists
  IF checkUsernameExists(p_username) THEN
    RETURN json_build_object('code', 'error', 'message', 'Username already exists');
  END IF;

  -- Check email exists
  IF checkEmailExists(p_email) THEN
    RETURN json_build_object('code', 'error', 'message', 'Email already exists');
  END IF;

  -- Get customer role_id
  SELECT role_id INTO v_role_id
  FROM role
  WHERE role_name = 'customer';

  -- Create new customer
  INSERT INTO customer(customer_name, phone_number, cccd)
  VALUES(p_fullname, p_phone, p_citizen_id)
  RETURNING customer_id INTO v_customer_id;

  -- Find new MembershipLevel
  SELECT level_id INTO v_level_id
  FROM membershiplevel
  WHERE level_name = 'Bronze';

  -- Insert account
  INSERT INTO account(username, email, password, role_id)
  VALUES(p_username, p_email, p_password, v_role_id)
  RETURNING account_id INTO v_account_id;

  -- Create new CustomerAccount
  INSERT INTO customeraccount(account_id, loyalty_score, reach_target, customer_id, level_id)
  VALUES(v_account_id, 0, 0, v_customer_id, v_level_id);

  RETURN json_build_object('code', 'success', 'message', 'Created customer account successfully');
END;
$$ LANGUAGE plpgsql;

-------------------- Create new pet --------------------
CREATE OR REPLACE FUNCTION add_pet(
  p_customer_id UUID,
  p_pet_name TEXT,
  p_species TEXT,
  p_breed TEXT,
  p_age INT,
  p_gender TEXT,
  p_health_state TEXT
)
RETURNS JSON AS $$
DECLARE
  v_pet_id UUID;
BEGIN
  -- Validate input
  IF p_pet_name IS NULL OR trim(p_pet_name) = '' THEN
    RETURN json_build_object(
      'code', 'error',
      'message', 'Pet name is required'
    );
  END IF;

  IF p_age IS NOT NULL AND p_age < 0 THEN
    RETURN json_build_object(
      'code', 'error',
      'message', 'Pet age must be >= 0'
    );
  END IF;

  -- Check customer exists
  IF NOT EXISTS (
    SELECT 1 FROM customer WHERE customer_id = p_customer_id
  ) THEN
    RETURN json_build_object(
      'code', 'error',
      'message', 'Customer not found'
    );
  END IF;

  -- Insert pet
  INSERT INTO pet (
    customer_id,
    pet_name,
    species,
    breed,
    age,
    gender,
    health_state
  )
  VALUES (
    p_customer_id,
    p_pet_name,
    p_species,
    p_breed,
    p_age,
    p_gender::gender_enum,
    p_health_state
  )
  RETURNING pet_id INTO v_pet_id;

  RETURN json_build_object(
    'code', 'success',
    'message', 'Create pet successfully',
    'pet_id', v_pet_id
  );
END;
$$ LANGUAGE plpgsql;

-------------------- Create new medical examination booking --------------------
create or replace function create_service_booking(
  p_service_id uuid,
  p_date date,
  p_branch_id uuid,
  p_employee_id uuid,
  p_pet_id uuid,
  p_customer_id uuid
)
returns json as $$
declare
  v_invoice_id uuid;
  v_booking_id uuid;
begin
  -- 1. Get existing pending invoice (if any)
  select invoice_id
  into v_invoice_id
  from invoice
  where customer_id = p_customer_id
    and status != 'completed'
  limit 1;

  -- 2. If not found → create new invoice
  if v_invoice_id is null then
    insert into invoice (
      created_at,
      payment_method,
      total_price,
      status,
      employee_id,
      customer_id
    )
    values (
      null,
      null,
      null,
      'pending',
      null,
      p_customer_id
    )
    returning invoice_id into v_invoice_id;
  end if;

  -- 3. Create service booking
  insert into servicebooking (
    date,
    status,
    price,
    service_id,
    branch_id,
    employee_id,
    pet_id,
    invoice_id
  )
  values (
    p_date,
    'pending',
    0,
    p_service_id,
    p_branch_id,
    p_employee_id,
    p_pet_id,
    v_invoice_id
  )
  returning booking_id into v_booking_id;

  -- 4. Create medicalexamination
  insert into medicalexamination (
    booking_id,
    symptom,
    diagnosis,
    prescription,
    next_appointment
  ) values (
    v_booking_id,
    null,
    null,
    null,
    null
  );
  RETURN json_build_object(
    'code', 'success',
    'message', 'Booking successfully'
  );
end;
$$ LANGUAGE plpgsql;

-------------------- Create new single vaccine booking --------------------
create or replace function create_vaccine_single(
  p_service_id uuid,
  p_date date,
  p_branch_id uuid,
  p_employee_id uuid,
  p_pet_id uuid,
  p_customer_id uuid,
  p_vaccine_id uuid
)
returns json as $$
declare
  v_invoice_id uuid;
  v_booking_id uuid;
begin
  -- 1. Check existing pending invoice
  select invoice_id
  into v_invoice_id
  from invoice
  where customer_id = p_customer_id
    and status != 'completed'
  limit 1;

  -- 2. If not exist → create new invoice
  if v_invoice_id is null then
    insert into invoice (
      created_at,
      payment_method,
      total_price,
      status,
      employee_id,
      customer_id
    )
    values (
      null,
      null,
      null,
      'pending',
      null,
      p_customer_id
    )
    returning invoice_id into v_invoice_id;
  end if;

  -- 3. Create service booking
  insert into servicebooking (
    date,
    status,
    price,
    service_id,
    branch_id,
    employee_id,
    pet_id,
    invoice_id
  )
  values (
    p_date,
    'pending',
    0,
    p_service_id,
    p_branch_id,
    p_employee_id,
    p_pet_id,
    v_invoice_id
  )
  returning booking_id into v_booking_id;

  -- 4. Create vaccine single service
  insert into vaccinationsingleservice (
    booking_id,
    vaccine_id,
    dosage
  )
  values (
    v_booking_id,
    p_vaccine_id,
    null
  );

  return json_build_object(
    'code', 'success',
    'message', 'Vaccine booking successfully'
  );
end;
$$ language plpgsql;
