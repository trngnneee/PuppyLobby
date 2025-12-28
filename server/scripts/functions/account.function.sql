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



