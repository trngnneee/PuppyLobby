import express from "express"
import db from "./../utils/db.js"
const router = express.Router()

router.get("/", async (req, res) => {
    const search = req.query.search || "";
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    
    
    const invoices = await db.raw(
        `
        SELECT *
        FROM invoice
        JOIN customer on customer.customer_id = invoice.customer_id
        WHERE customer.phone_number = ? 
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
        `,
        [search, pageSize, (page - 1) * pageSize]
    );
    console.log("Invoices: ", invoices.rows);
    if (!invoices) {
        return res.json({
            code: "error",
            message: "No invoices found",
        });
    }

    const totalPages = Math.ceil(invoices.rows.length / pageSize)

    res.json({
        code: "success",
        message: "Invoice list fetched successfully",
        invoices: invoices.rows,
        totalPages: totalPages,
    })

});

export default router;