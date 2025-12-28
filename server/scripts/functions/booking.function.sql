









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
      now(),
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
      now(),
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




-------------------- Create new vaccine package booking --------------------
create or replace function create_vaccine_package(
  p_service_id uuid,
  p_date date,
  p_branch_id uuid,
  p_employee_id uuid,
  p_pet_id uuid,
  p_customer_id uuid,
  p_package_id uuid
)
returns json as $$
declare
  v_invoice_id uuid;
  v_booking_id uuid;
  v_duration integer;
  v_end_date date;
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
      now(),
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

  -- 4. Get package duration (month)
  select duration
  into v_duration
  from vaccinationpackage
  where package_id = p_package_id;

  if v_duration is null then
    raise exception 'Invalid package_id: %', p_package_id;
  end if;

  -- 5. Calculate end_date
  v_end_date := p_date + (v_duration || ' months')::interval;

  -- 6. Create vaccine package service
  insert into vaccinationpackageservice (
    booking_id,
    package_id,
    start_date,
    end_date
  )
  values (
    v_booking_id,
    p_package_id,
    p_date,
    v_end_date
  );

  return json_build_object(
    'code', 'success',
    'message', 'Vaccine package booking successfully'
  );
end;
$$ language plpgsql;





