import express from "express";
import db from "./../utils/db.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  const result = await db.raw(
    `SELECT add_vaccine(?, ?, ?, ?, ?, ?)`,
    [
      req.body.vaccine_name,
      req.body.price,
      req.body.manufacture_date,
      req.body.entry_date,
      req.body.expiry_date,
      req.body.quantity,
    ]
  );

  if (result.rows[0].add_vaccine.status == "error") {
    return res.json({
      code: "error",
      message: result.rows[0].add_vaccine.message,
    });
  }
  
  res.json({
    code: "success",
    message: "Vaccine created successfully",
  })
})

router.get("/list", async (req, res) => {

  const pageSize = 10;
  const countQuery = await db.raw(`
    SELECT COUNT(*) as count FROM vaccine
    ${req.query.keyword ? `WHERE fts @@ plainto_tsquery('english', remove_accents('${req.query.keyword.trim()}') || ':*')` : ''}
  `);
  
  const totalCount = parseInt(countQuery.rows[0].count);
  const totalPages = Math.ceil(totalCount / pageSize);

  const query = db.select("*").from("vaccine");
  if (req.query.keyword){
    const keyword = req.query.keyword?.trim();
    query.whereRaw(
      "fts @@ plainto_tsquery('english', remove_accents(?) || ':*')",
      [keyword]
    )
  }
  if (req.query.page) {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * pageSize;
    query.limit(pageSize).offset(offset);
  }

  const vaccineList = await query;

  res.json({
    code: "success",
    message: "Vaccine list fetched successfully",
    vaccineList: vaccineList,
    totalPages: totalPages,
  })
})

router.delete("/delete/:vaccine_id", async (req, res) => {
  const { vaccine_id } = req.params;

  await db("vaccine").where({ vaccine_id }).del();
  
  res.json({
    code: "success",
    message: "Vaccine deleted successfully",
  })
})

router.get("/detail/:vaccine_id", async (req, res) => {
  const { vaccine_id } = req.params;

  const vaccineDetail = await db("vaccine").where({ vaccine_id }).first();

  res.json({
    code: "success",
    message: "Vaccine detail fetched successfully",
    vaccineDetail: vaccineDetail
  })
})

router.post("/update/:vaccine_id", async (req, res) => {
  const { vaccine_id } = req.params;

  await db("vaccine").where({ vaccine_id }).update({
    vaccine_name:  req.body.vaccine_name,
    price:  req.body.price,
    manufacture_date:  req.body.manufacture_date,
    entry_date:  req.body.entry_date,
    expiry_date:  req.body.expiry_date,
    quantity:  req.body.quantity,
  });

  res.json({
    code: "success",
    message: "Vaccine updated successfully",
  })
})

export default router;