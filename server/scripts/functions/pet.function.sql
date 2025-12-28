








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


