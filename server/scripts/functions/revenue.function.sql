








----------------- REVENUE OF ALL BRANCHES -------------------------
CREATE OR REPLACE FUNCTION get_revenue_all_branches(
    p_start_date DATE,
    p_end_date DATE,
    p_interval_days INT DEFAULT 30
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_combined DECIMAL(15,2);
    v_total_product DECIMAL(15,2);
    v_total_consultation DECIMAL(15,2);
    v_timeline_data JSON;
    v_branch_data JSON;
    v_result JSON;
BEGIN
    
    -- Total invoice revenue all branches
    SELECT COALESCE(SUM(i.total_price), 0)
    INTO v_total_combined
    FROM invoice i
    WHERE i.status = 'completed'
      AND i.created_at >= p_start_date::TIMESTAMP
      AND i.created_at < (p_end_date::TIMESTAMP + INTERVAL '1 day');
    
    -- Total product revenue all branches
    SELECT COALESCE(SUM(ip.quantity * p.price), 0)
    INTO v_total_product
    FROM invoiceproduct ip
    INNER JOIN product p ON p.product_id = ip.product_id
    INNER JOIN invoice i ON i.invoice_id = ip.invoice_id
    WHERE i.status = 'completed'
      AND i.created_at >= p_start_date::TIMESTAMP
      AND i.created_at < (p_end_date::TIMESTAMP + INTERVAL '1 day');
    
    -- Consultation revenue = Total invoice - Product revenue
    v_total_consultation := v_total_combined - v_total_product;
    
    -- Time line data based on all branches
    SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
            'period_start', tl.prd_start,
            'period_end', tl.prd_end,
            'consultation_revenue', tl.total_combined - tl.prod_rev,
            'product_revenue', tl.prod_rev,
            'total_revenue', tl.total_combined
        )
        ORDER BY tl.prd_start
    )
    INTO v_timeline_data
    FROM (
        SELECT 
            tp_combined.prd_start,
            tp_combined.prd_end,
            tp_combined.total_combined,
            COALESCE(tp_product.prod_rev, 0) AS prod_rev
        FROM (
            -- Total invoice based on period
            SELECT 
                tp.prd_start,
                tp.prd_end,
                COALESCE(SUM(i.total_price), 0) AS total_combined
            FROM (
                SELECT 
                    (gs::DATE) AS prd_start,
                    ((gs + (p_interval_days || ' days')::INTERVAL)::DATE - INTERVAL '1 day')::DATE AS prd_end
                FROM generate_series(
                    p_start_date::TIMESTAMP,
                    p_end_date::TIMESTAMP,
                    (p_interval_days || ' days')::INTERVAL
                ) AS gs
            ) tp
            LEFT JOIN invoice i ON i.status = 'completed'
                AND DATE(i.created_at) >= tp.prd_start
                AND DATE(i.created_at) <= tp.prd_end
            GROUP BY tp.prd_start, tp.prd_end
        ) tp_combined
        LEFT JOIN (
            -- Product revenue based on period
            SELECT 
                tp.prd_start,
                tp.prd_end,
                COALESCE(SUM(ip.quantity * p.price), 0) AS prod_rev
            FROM (
                SELECT 
                    (gs::DATE) AS prd_start,
                    ((gs + (p_interval_days || ' days')::INTERVAL)::DATE - INTERVAL '1 day')::DATE AS prd_end
                FROM generate_series(
                    p_start_date::TIMESTAMP,
                    p_end_date::TIMESTAMP,
                    (p_interval_days || ' days')::INTERVAL
                ) AS gs
            ) tp
            LEFT JOIN invoice i ON i.status = 'completed'
                AND DATE(i.created_at) >= tp.prd_start
                AND DATE(i.created_at) <= tp.prd_end
            LEFT JOIN invoiceproduct ip ON ip.invoice_id = i.invoice_id
            LEFT JOIN product p ON p.product_id = ip.product_id
            GROUP BY tp.prd_start, tp.prd_end
        ) tp_product ON tp_combined.prd_start = tp_product.prd_start 
            AND tp_combined.prd_end = tp_product.prd_end
    ) tl;
    
    -- Branch data (only consultation revenue)
    SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
            'branch_id', br_data.branch_id,
            'branch_name', br_data.branch_name,
            'branch_consultation_revenue', br_data.consultation_revenue,
            'consultation_count', br_data.consultation_count
        )
        ORDER BY br_data.branch_id
    )
    INTO v_branch_data
    FROM (
        SELECT 
            br.branch_id,
            br.branch_name,
            COALESCE(consultation_data.consultation_total, 0) AS consultation_revenue,
            COALESCE(cons_data.consultation_count, 0) AS consultation_count
        FROM branch br
        LEFT JOIN (
            -- Invoice total per branch
            SELECT 
                branch_id,
                COUNT(DISTINCT booking_id) AS consultation_count
            FROM servicebooking sb
            WHERE EXISTS (
                SELECT 1 FROM invoice i2 
                WHERE i2.invoice_id = sb.invoice_id
                    AND i2.status = 'completed'
                    AND i2.created_at >= p_start_date::TIMESTAMP
                    AND i2.created_at < (p_end_date::TIMESTAMP + INTERVAL '1 day')
            )
            GROUP BY branch_id
        ) cons_data ON cons_data.branch_id = br.branch_id
        LEFT JOIN (
            -- Consultation invoice per branch
            SELECT 
                sb.branch_id,
                COALESCE(SUM(sb.price), 0) AS consultation_total
            FROM servicebooking sb
            INNER JOIN invoice i on i.invoice_id = sb.invoice_id
            WHERE i.status = 'completed' AND sb.status = 'completed'
                AND i.created_at >= p_start_date::TIMESTAMP
                AND i.created_at < (p_end_date::TIMESTAMP + INTERVAL '1 day')
            GROUP BY sb.branch_id
        ) consultation_data ON consultation_data.branch_id = br.branch_id
    ) br_data;
    
    -- Final JSON result
    v_result := JSON_BUILD_OBJECT(
        'total_revenue', JSON_BUILD_OBJECT(
            'consultation_revenue', v_total_consultation,
            'product_revenue', v_total_product,
            'total_revenue', v_total_combined
        ),
        'total_revenue_timeline', COALESCE(v_timeline_data, '[]'::JSON),
        'branch_data', COALESCE(v_branch_data, '[]'::JSON)
    );
    
    RETURN v_result;
    
END;
$$;



------------------- GET SINGLE BRANCH ----------------------
CREATE OR REPLACE FUNCTION get_revenue_single_branch(
    p_branch_id UUID,
    p_start_date DATE,
    p_end_date DATE,
    p_interval_days INT DEFAULT 30
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_consultation DECIMAL(15,2);
    v_total_consultation_count INT;
    v_timeline_data JSON;
    v_result JSON;
BEGIN
    
    -- GET TOTAL CONSULTATION REVENUE OF BRANCH
    SELECT COALESCE(SUM(sb.price), 0)
    INTO v_total_consultation
    FROM servicebooking sb
    INNER JOIN invoice i ON i.invoice_id = sb.invoice_id
    WHERE sb.branch_id = p_branch_id
      AND i.status = 'completed'
      AND sb.status = 'completed'
      AND i.created_at >= p_start_date::TIMESTAMP
      AND i.created_at < (p_end_date::TIMESTAMP + INTERVAL '1 day');
    
    -- GET TOTAL CONSULTATION COUNT OF BRANCH
    SELECT COALESCE(COUNT(DISTINCT sb.booking_id), 0)
    INTO v_total_consultation_count
    FROM servicebooking sb
    INNER JOIN invoice i ON i.invoice_id = sb.invoice_id
    WHERE sb.branch_id = p_branch_id
      AND i.status = 'completed'
      AND sb.status = 'completed'
      AND i.created_at >= p_start_date::TIMESTAMP
      AND i.created_at < (p_end_date::TIMESTAMP + INTERVAL '1 day');
    
    -- GET TIMELINE DATA OF BRANCH
    SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
            'period_start', tl.prd_start,
            'period_end', tl.prd_end,
            'consultation_revenue', tl.consultation_rev,
            'consultation_count', tl.consultation_cnt
        )
        ORDER BY tl.prd_start
    )
    INTO v_timeline_data
    FROM (
        SELECT 
            tp.prd_start,
            tp.prd_end,
            COALESCE(SUM(sb.price), 0) AS consultation_rev,
            COALESCE(COUNT(DISTINCT sb.booking_id), 0) AS consultation_cnt
        FROM (
            SELECT 
                (gs::DATE) AS prd_start,
                ((gs + (p_interval_days || ' days')::INTERVAL)::DATE - INTERVAL '1 day')::DATE AS prd_end
            FROM generate_series(
                p_start_date::TIMESTAMP,
                p_end_date::TIMESTAMP,
                (p_interval_days || ' days')::INTERVAL
            ) AS gs
        ) tp
        LEFT JOIN invoice i ON i.status = 'completed'
            AND DATE(i.created_at) >= tp.prd_start
            AND DATE(i.created_at) <= tp.prd_end
        LEFT JOIN servicebooking sb ON sb.invoice_id = i.invoice_id
            AND sb.branch_id = p_branch_id
            AND sb.status = 'completed'
        GROUP BY tp.prd_start, tp.prd_end
    ) tl;
    
    -- FINAL RESULT
    v_result := JSON_BUILD_OBJECT(
        'total_consultation_revenue', v_total_consultation,
        'total_consultation_count', v_total_consultation_count,
        'timeline_data', COALESCE(v_timeline_data, '[]'::JSON)
    );
    
    RETURN v_result;
    
END;
$$;

-- test 
select * from get_revenue_single_branch(
    'c26300f2-703c-4022-82c0-b68dc260aa4f',
    '2025-12-20',
    '2025-12-30',
    1
);



-------------------- GET DOCTOR REVENUE IN BRANCH ----------------------

CREATE OR REPLACE FUNCTION get_revenue_doctor_branch(
    p_branch_id UUID,
    p_employee_id UUID,
    p_start_date DATE,
    p_end_date DATE,
    p_interval_days INT DEFAULT 30
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_consultation DECIMAL(15,2);
    v_total_consultation_count INT;
    v_timeline_data JSON;
    v_result JSON;
BEGIN
    
    -- GET total consultation revenue of doctor
    SELECT COALESCE(SUM(sb.price), 0)
    INTO v_total_consultation
    FROM servicebooking sb
    INNER JOIN invoice i ON i.invoice_id = sb.invoice_id
    INNER JOIN veterinarian v ON v.employee_id = sb.employee_id
    WHERE sb.branch_id = p_branch_id
      AND sb.employee_id = p_employee_id
      AND i.status = 'completed'
      AND sb.status = 'completed'
      AND i.created_at >= p_start_date::TIMESTAMP
      AND i.created_at < (p_end_date::TIMESTAMP + INTERVAL '1 day');
    
    -- GET total consultation count of doctor
    SELECT COALESCE(COUNT(DISTINCT sb.booking_id), 0)
    INTO v_total_consultation_count
    FROM servicebooking sb
    INNER JOIN invoice i ON i.invoice_id = sb.invoice_id
    INNER JOIN veterinarian v ON v.employee_id = sb.employee_id
    WHERE sb.branch_id = p_branch_id
      AND sb.employee_id = p_employee_id
      AND i.status = 'completed'
      AND sb.status = 'completed'
      AND i.created_at >= p_start_date::TIMESTAMP
      AND i.created_at < (p_end_date::TIMESTAMP + INTERVAL '1 day');
    
    -- GET timeline data of doctor
    SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
            'period_start', tl.prd_start,
            'period_end', tl.prd_end,
            'consultation_revenue', tl.consultation_rev,
            'consultation_count', tl.consultation_cnt
        )
        ORDER BY tl.prd_start
    )
    INTO v_timeline_data
    FROM (
        SELECT 
            tp.prd_start,
            tp.prd_end,
            COALESCE(SUM(sb.price), 0) AS consultation_rev,
            COALESCE(COUNT(DISTINCT sb.booking_id), 0) AS consultation_cnt
        FROM (
            SELECT 
                (gs::DATE) AS prd_start,
                ((gs + (p_interval_days || ' days')::INTERVAL)::DATE - INTERVAL '1 day')::DATE AS prd_end
            FROM generate_series(
                p_start_date::TIMESTAMP,
                p_end_date::TIMESTAMP,
                (p_interval_days || ' days')::INTERVAL
            ) AS gs
        ) tp
        LEFT JOIN invoice i ON i.status = 'completed'
            AND DATE(i.created_at) >= tp.prd_start
            AND DATE(i.created_at) <= tp.prd_end
        LEFT JOIN servicebooking sb ON sb.invoice_id = i.invoice_id
            AND sb.branch_id = p_branch_id
            AND sb.employee_id = p_employee_id
            AND sb.status = 'completed'
        LEFT JOIN veterinarian v ON v.employee_id = sb.employee_id
        GROUP BY tp.prd_start, tp.prd_end
    ) tl;
    
    -- FINAL RESULT
    v_result := JSON_BUILD_OBJECT(
        'total_consultation_revenue', v_total_consultation,
        'total_consultation_count', v_total_consultation_count,
        'timeline_data', COALESCE(v_timeline_data, '[]'::JSON)
    );
    
    RETURN v_result;
    
END;
$$;

-- test 
select * from get_revenue_doctor_branch(
    'c26300f2-703c-4022-82c0-b68dc260aa4f',
    '65822fa7-1c92-4ff6-a838-a36f65020bd4',
    '2025-12-20',
    '2025-12-30',
    1
);