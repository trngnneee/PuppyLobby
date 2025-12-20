

-- Create invoice
create or replace function create_invoice(
  p_customer_id uuid,
  p_employee_id uuid default null,
  p_payment_method text default null,
  p_status text default 'pending',
  p_total_price numeric default null
)
returns jsonb
language plpgsql
as $$
declare
  v_id uuid;
begin
  insert into invoice (
    created_at,
    payment_method,
    total_price,
    status,
    employee_id,
    customer_id
  ) values (
    now(),
    p_payment_method,
    p_total_price,
    p_status,
    p_employee_id,
    p_customer_id
  ) returning invoice_id into v_id;

  return jsonb_build_object('code','success','invoice_id', v_id);

exception when others then
  return jsonb_build_object('code','error','message', sqlerrm);
end;
$$;


-- Update invoice (partial update using COALESCE)
create or replace function update_invoice(
  p_invoice_id uuid,
  p_payment_method text default null,
  p_status text default null,
  p_employee_id uuid default null,
  p_customer_id uuid default null
)
returns jsonb
language plpgsql
as $$
begin
  update invoice set
    payment_method = coalesce(p_payment_method, payment_method),
    status = coalesce(p_status, status),
    employee_id = coalesce(p_employee_id, employee_id),
    customer_id = coalesce(p_customer_id, customer_id)
  where invoice_id = p_invoice_id;

  if not found then
    return jsonb_build_object('code','not_found','message','Invoice not found');
  end if;

  return jsonb_build_object('code','success','message','Invoice updated successfully');

exception when others then
  return jsonb_build_object('code','error','message', sqlerrm);
end;
$$;


-- Delete invoice: remove invoiceproduct rows and detach service bookings, then remove invoice
create or replace function delete_invoice(
  p_invoice_id uuid
)
returns jsonb
language plpgsql
as $$
begin
  if not exists(select 1 from invoice where invoice_id = p_invoice_id) then
    return jsonb_build_object('code','not_found','message','Invoice not found');
  end if;

  delete from invoiceproduct where invoice_id = p_invoice_id;
  update servicebooking set invoice_id = null where invoice_id = p_invoice_id;
  delete from invoice where invoice_id = p_invoice_id;

  return jsonb_build_object('code','success','message','Invoice deleted successfully');

exception when others then
  return jsonb_build_object('code','error','message', sqlerrm);
end;
$$;


-- Add product to invoice (inserts or increments quantity), updates product stock and invoice total
create or replace function add_invoice_product(
  p_customer_id uuid,
  p_product_id uuid,
  p_quantity numeric
)
returns jsonb
language plpgsql
as $$
declare
  v_invoice_id uuid;
  v_stock numeric;
  v_price numeric;
  v_exists_qty numeric;
  v_result jsonb;
begin
  if p_quantity is null or p_quantity <= 0 then
    return jsonb_build_object('code','error','message','Quantity must be greater than 0');
  end if;

  -- Tìm invoice pending của customer
  select invoice_id
  into v_invoice_id
  from invoice
  where customer_id = p_customer_id
    and status = 'pending'
  order by created_at desc
  limit 1;

  -- Nếu chưa có → tạo mới 
  if v_invoice_id is null then
  select create_invoice(
    p_customer_id,
    null,
    null,
    'pending',
    0
  ) into v_result;

  if v_result->>'code' <> 'success' then
    return v_result;
  end if;

  v_invoice_id := (v_result->>'invoice_id')::uuid;
  end if;


  -- Kiểm tra product
  select stock, price
  into v_stock, v_price
  from product
  where product_id = p_product_id
  for update;

  if not found then
    return jsonb_build_object('code','not_found','message','Product not found');
  end if;

  if v_stock < p_quantity then
    return jsonb_build_object('code','error','message','Insufficient stock');
  end if;

  -- Check product đã tồn tại trong invoice chưa
  select quantity
  into v_exists_qty
  from invoiceproduct
  where invoice_id = v_invoice_id
    and product_id = p_product_id;

  if v_exists_qty is null then
    insert into invoiceproduct (invoice_id, product_id, quantity)
    values (v_invoice_id, p_product_id, p_quantity);
  else
    update invoiceproduct
    set quantity = quantity + p_quantity
    where invoice_id = v_invoice_id
      and product_id = p_product_id;
  end if;

  
  update product
  set stock = stock - p_quantity
  where product_id = p_product_id;

  -- Update total
  update invoice
  set total_price = (
    select coalesce(sum(ip.quantity * pr.price), 0)
    from invoiceproduct ip
    join product pr on ip.product_id = pr.product_id
    where ip.invoice_id = v_invoice_id
  )
  where invoice_id = v_invoice_id;

  return jsonb_build_object(
    'code','success',
    'invoice_id', v_invoice_id,
    'message','Product added to invoice'
  );

exception when others then
  return jsonb_build_object('code','error','message', sqlerrm);
end;
$$;


-- Update invoice product quantity (set exact quantity). If new quantity <= 0 then row is removed.
create or replace function update_invoice_product(
  p_invoice_id uuid,
  p_product_id uuid,
  p_new_quantity numeric
)
returns jsonb
language plpgsql
as $$
declare
  v_old_qty numeric;
  v_stock numeric;
  v_delta numeric;
begin
  if not exists(select 1 from invoice where invoice_id = p_invoice_id) then
    return jsonb_build_object('code','not_found','message','Invoice not found');
  end if;

  select quantity into v_old_qty from invoiceproduct where invoice_id = p_invoice_id and product_id = p_product_id for update;
  if not found then
    return jsonb_build_object('code','not_found','message','InvoiceProduct not found');
  end if;

  if p_new_quantity is null then
    return jsonb_build_object('code','error','message','New quantity required');
  end if;

  v_delta := p_new_quantity - v_old_qty;

  select stock into v_stock from product where product_id = p_product_id for update;
  if v_delta > 0 and v_stock < v_delta then
    return jsonb_build_object('code','error','message','Insufficient stock for the requested increase');
  end if;

  if p_new_quantity <= 0 then
    -- remove row and restock
    delete from invoiceproduct where invoice_id = p_invoice_id and product_id = p_product_id;
    update product set stock = stock + v_old_qty where product_id = p_product_id;
  else
    update invoiceproduct set quantity = p_new_quantity where invoice_id = p_invoice_id and product_id = p_product_id;
    if v_delta > 0 then
      update product set stock = stock - v_delta where product_id = p_product_id;
    elsif v_delta < 0 then
      update product set stock = stock + abs(v_delta) where product_id = p_product_id;
    end if;
  end if;

  -- Recalculate invoice total
  update invoice set total_price = (
    select (
      coalesce((select sum(ip.quantity * pr.price) from invoiceproduct ip join product pr on ip.product_id = pr.product_id where ip.invoice_id = p_invoice_id),0)
      + coalesce((select sum(sb.price) from servicebooking sb where sb.invoice_id = p_invoice_id),0)
    )
  ) where invoice_id = p_invoice_id;

  return jsonb_build_object('code','success','message','InvoiceProduct updated successfully');

exception when others then
  return jsonb_build_object('code','error','message', sqlerrm);
end;
$$;


-- Remove product from invoice (restocks product and recalculates invoice total)
create or replace function remove_invoice_product(
  p_invoice_id uuid,
  p_product_id uuid
)
returns jsonb
language plpgsql
as $$
declare
  v_qty numeric;
begin
  select quantity into v_qty from invoiceproduct where invoice_id = p_invoice_id and product_id = p_product_id for update;
  if not found then
    return jsonb_build_object('code','not_found','message','InvoiceProduct not found');
  end if;

  delete from invoiceproduct where invoice_id = p_invoice_id and product_id = p_product_id;
  update product set stock = stock + v_qty where product_id = p_product_id;
  -- Recalculate invoice total
  update invoice set total_price = (
    select (
      coalesce((select sum(ip.quantity * pr.price) from invoiceproduct ip join product pr on ip.product_id = pr.product_id where ip.invoice_id = p_invoice_id),0)
      + coalesce((select sum(sb.price) from servicebooking sb where sb.invoice_id = p_invoice_id),0)
    )
  ) where invoice_id = p_invoice_id;

  return jsonb_build_object('code','success','message','InvoiceProduct removed successfully');

exception when others then
  return jsonb_build_object('code','error','message', sqlerrm);
end;
$$;


-- Hàm tính tổng tiền product trong invoice pending của customer
create or replace function get_product_total(
  p_customer_id uuid
)
returns numeric
language plpgsql
as $$
declare
  v_invoice_id uuid;
  v_total numeric;
begin
  -- Tìm invoice pending
  select invoice_id
  into v_invoice_id
  from invoice
  where customer_id = p_customer_id
    and status = 'pending'
  order by created_at desc
  limit 1;

  -- Chưa có invoice → tổng = 0
  if v_invoice_id is null then
    return 0;
  end if;

  -- Tính tổng tiền product
  select coalesce(sum(ip.quantity * p.price), 0)
  into v_total
  from invoiceproduct ip
  join product p on ip.product_id = p.product_id
  where ip.invoice_id = v_invoice_id;

  return v_total;
end;
$$;
