CREATE OR REPLACE FUNCTION update_invoice_total_price()
RETURNS TRIGGER AS $$
DECLARE
    v_invoice_id INT;
BEGIN
    v_invoice_id := COALESCE(NEW.invoice_id, OLD.invoice_id);
    update invoice set total_price = (
        select (
        coalesce((select sum(ip.quantity * pr.price) from invoiceproduct ip join product pr on ip.product_id = pr.product_id where ip.invoice_id = v_invoice_id),0)
        + coalesce((select sum(sb.price) from servicebooking sb where sb.invoice_id = v_invoice_id),0)
        )
    ) where invoice_id = v_invoice_id;



    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_update_invoice_total_price
AFTER INSERT OR UPDATE OR DELETE ON ServiceBooking  
FOR EACH ROW
EXECUTE FUNCTION update_invoice_total_price();

