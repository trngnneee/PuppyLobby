CREATE OR REPLACE FUNCTION update_loyalty_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    new_score numeric;
    new_level uuid;
BEGIN
    -- Tính tổng total_price của 12 tháng gần nhất cho customer
    SELECT COALESCE(SUM(total_price),0)
    INTO new_score
    FROM Invoice
    WHERE customer_id = NEW.customer_id
      AND created_at >= (CURRENT_DATE - INTERVAL '12 months');

    -- Xác định level_id mới theo target_threshold
    SELECT level_id
    INTO new_level
    FROM MembershipLevel
    WHERE target_threshold <= new_score
    ORDER BY target_threshold DESC
    LIMIT 1;

    -- Cập nhật CustomerAccount
    UPDATE CustomerAccount
    SET loyalty_score = new_score,
        level_id = new_level
    WHERE customer_id = NEW.customer_id;

    RETURN NEW;
END;
$$;


CREATE TRIGGER trg_update_loyalty
AFTER INSERT OR UPDATE OF total_price, created_at
ON Invoice
FOR EACH ROW
EXECUTE FUNCTION update_loyalty_score();