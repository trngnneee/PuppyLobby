CREATE INDEX idx_product_type_product_id
ON product (type, product_id);


CREATE INDEX idx_invoice_status_created_at
ON invoice(status, created_at);


CREATE INDEX idx_servicebooking_invoice_branch
ON servicebooking(invoice_id, branch_id, status);