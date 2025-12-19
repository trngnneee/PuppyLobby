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
  // const query = db('vaccinationpackage').select('*');
  // const pageSize = 3;
  // const countResult = await db('vaccinationpackage').count('* as count').first();
  // const totalPages = Math.ceil(Number(countResult.count) / pageSize);
  // if (req.query.page) {
  //   const page = parseInt(req.query.page) || 1;
  //   const offset = (page - 1) * pageSize;
  //   query.limit(pageSize).offset(offset);
  // }

  // if (req.query.keyword) {
  //   const keyword = req.query.keyword?.trim();
  //   query.whereRaw(
  //     "fts @@ plainto_tsquery('english', remove_accents(?) || ':*')",
  //     [keyword]
  //   )
  // }

  // const vaccinePackageList = await query;

  // for (const vp of vaccinePackageList) {
  //   const schedule = await db('vaccinationschedule')
  //     .select(
  //       'vaccinationschedule.vaccine_id',
  //       'vaccine.vaccine_name',
  //       'vaccinationschedule.dosage',
  //       'vaccinationschedule.scheduled_week'
  //     )
  //     .join(
  //       'vaccine',
  //       'vaccinationschedule.vaccine_id',
  //       'vaccine.vaccine_id'
  //     )
  //     .where('vaccinationschedule.package_id', vp.package_id);

  //   vp.schedule = schedule;
  // }
  const keyword = req.query.keyword ? req.query.keyword.trim() : '';
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 3;

  const result = await db.raw(
    `SELECT * FROM get_list_vaccine_in_package(?, ?, ?)`,
    [keyword, page, pageSize]
  );
  const vaccinePackageList = result.rows;
  console.log ('vaccinePackageList:', vaccinePackageList);
  const totalCount = vaccinePackageList.length > 0 ? vaccinePackageList[0].total_count : 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  res.json({
    code: "success",
    message: "Vaccine package list fetched successfully",
    vaccinePackageList : vaccinePackageList,
    totalPages : totalPages,
    totalCount : totalCount
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

router.get("/detail/:id", async (req, res) => {
  const { id } = req.params;

  const vaccinePackageDetail = await db('vaccinationpackage')
    .where('package_id', id)
    .first();

  const schedule = await db('vaccinationschedule')
    .select(
      'vaccinationschedule.vaccine_id',
      'vaccinationschedule.dosage',
      'vaccinationschedule.scheduled_week'
    )
    .join(
      'vaccine',
      'vaccinationschedule.vaccine_id',
      'vaccine.vaccine_id'
    )
    .where('vaccinationschedule.package_id', id);

  vaccinePackageDetail.schedule = schedule;

  res.json({
    code: "success",
    message: "Vaccine package detail fetched successfully",
    vaccinePackageDetail
  })
})

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;

  const existingPackage = await db('vaccinationpackage')
    .where('package_id', id)
    .first();

  if (!existingPackage) {
    return res.json({
      code: "error",
      message: "Vaccine package not found",
    })
  }

  // Delete non-existing schedule entries
  await db('vaccinationschedule')
    .where('package_id', id)
    .whereNotIn('vaccine_id', req.body.schedule.map(s => s.vaccine_id))
    .del();

  // Insert new or update existing schedule entries
  for (const scheduleEntry of req.body.schedule) {
    const existingEntry = await db('vaccinationschedule')
      .where('package_id', id)
      .where('vaccine_id', scheduleEntry.vaccine_id)
      .first();
    if (existingEntry) {
      await db('vaccinationschedule')
        .where('package_id', id)
        .where('vaccine_id', scheduleEntry.vaccine_id)
        .update({
          dosage: scheduleEntry.dosage,
          scheduled_week: scheduleEntry.scheduled_week,
        });
    } else {
      await db('vaccinationschedule')
        .insert({
          package_id: id,
          vaccine_id: scheduleEntry.vaccine_id,
          dosage: scheduleEntry.dosage,
          scheduled_week: scheduleEntry.scheduled_week,
        });
    }
  }
       
  // Update vaccine package details
  await db('vaccinationpackage')
    .where('package_id', id)
    .update({
      package_name: req.body.package_name,
      duration: req.body.duration,
      description: req.body.description,
      discount_rate: req.body.discount_rate,
      total_original_price: req.body.total_original_price,
    });

  res.json({
    code: "success",
    message: "Update vaccine package successfully",
  })
})

export default router;