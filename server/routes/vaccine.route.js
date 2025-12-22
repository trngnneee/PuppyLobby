import express from "express";
import db from "./../utils/db.js";
import { parse } from "dotenv";

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
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const searchKeyword = req.query.keyword ? req.query.keyword.trim() : null;

  const query = await db.raw(`
      select  * from get_vaccine_list(?, ?, ?)
    `, [searchKeyword, page, pageSize]);


  const vaccineList = await query.rows;
  const totalCount = vaccineList.length > 0 ? parseInt(vaccineList[0].total_count) : 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  console.log(vaccineList);
  res.json({
    code: "success",
    message: "Vaccine list fetched successfully",
    vaccineList: vaccineList,
    totalCount: totalCount,
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