-- Xóa account khi xóa Employee
CREATE OR REPLACE FUNCTION delete_account_when_employee_deleted()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM Account WHERE account_id = OLD.account_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_delete_account
AFTER DELETE ON Employee
FOR EACH ROW
EXECUTE FUNCTION delete_account_when_employee_deleted();