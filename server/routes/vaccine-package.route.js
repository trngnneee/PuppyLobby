import express from "express";
import db from '../utils/db.js';

const router = express.Router();

router.post("/create", async (req, res) => {
  const result = await db.raw(
    `SELECT add_vaccine_package(?, ?, ?, ?, ?, ?) AS response`,
    [
      req.body.package_name,
      req.body.duration,
      req.body.description,
      req.body.discount_rate,
      req.body.total_original_price,
      JSON.stringify(req.body.schedule),
    ]
  );

  const response = result.rows[0].response;

  if (response.code !== 'success') {
    return res.json({
      code: "error",
      message: response.message
    })
  }

  res.json({
    code: "success",
    message: response.message,
  })
})

router.get("/list", async (req, res) => {
  const query = db('vaccinationpackage').select('*');
  const pageSize = 3;
  const countResult = await db('vaccinationpackage').count('* as count').first();
  const totalPages = Math.ceil(Number(countResult.count) / pageSize);
  if (req.query.page) {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * pageSize;
    query.limit(pageSize).offset(offset);
  }

  if (req.query.keyword) {
    const keyword = req.query.keyword?.trim();
    query.whereRaw(
      "fts @@ plainto_tsquery('english', remove_accents(?) || ':*')",
      [keyword]
    )
  }

  const vaccinePackageList = await query;

  for (const vp of vaccinePackageList) {
    const schedule = await db('vaccinationschedule')
      .select(
        'vaccinationschedule.vaccine_id',
        'vaccine.vaccine_name',
        'vaccinationschedule.dosage',
        'vaccinationschedule.scheduled_week'
      )
      .join(
        'vaccine',
        'vaccinationschedule.vaccine_id',
        'vaccine.vaccine_id'
      )
      .where('vaccinationschedule.package_id', vp.package_id);

    vp.schedule = schedule;
  }

  res.json({
    code: "success",
    message: "Vaccine package list fetched successfully",
    vaccinePackageList,
    totalPages
  })
})

router.delete("/delete/:id", async (req, res) => {
  await db('vaccinationpackage')
    .where('package_id', req.params.id)
    .del();

  res.json({
    code: "success",
    message: "Delete vaccine package successfully",
  })
})

export default router;