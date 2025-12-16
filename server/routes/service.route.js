import express from 'express';
import db from './../utils/db.js';
import * as authMiddleware from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/list", async (req, res) => {
  const serviceList = await db.select('*').from('service');

  for (const service of serviceList) {
    const branchList = await db('branchservice').where({ service_id: service.service_id });
    const branchDetail = await db.select('branch_id', 'branch_name').from('branch').whereIn('branch_id', branchList.map(b => b.branch_id));
    service.branches = branchDetail;
  }

  res.json({
    code: "success",
    message: "Service list fetched successfully",
    serviceList: serviceList
  })
})

router.get("/detail/:id", async (req, res) => {
  const { id } = req.params;

  const serviceDetail = await db.select('*').from('service').where({ service_id: id }).first();

  if (!serviceDetail) {
    return res.json({
      code: "not_found",
      message: "Service not found",
    })
  }

  const branchList = await db.select('*').from('branchservice').where({ service_id: id });

  res.json({
    code: "success",
    message: "Service detail fetched successfully",
    serviceDetail: serviceDetail,
    branchList: branchList
  })
})

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { price, branches } = req.body;

  await db('service').where({ service_id: id }).update({
    service_base_price: price,
  });

  await db('branchservice').where({ service_id: id }).del();

  for (const branch_id of branches) {
    await db('branchservice').insert({
      service_id: id,
      branch_id: branch_id,
    });
  };

  res.json({
    code: "success",
    message: "Service updated successfully",
  })
})

router.post('/medical-exam/book', authMiddleware.verifyToken, async (req, res) => {
  const result = await db.raw(
    `SELECT create_service_booking(?, ?, ?, ?, ?, ?);`,
    [
      req.body.service_id,
      req.body.date,
      req.body.branch_id,
      req.body.employee_id,
      req.body.pet_id,
      req.account.customer_id
    ]
  );

  const data = result.rows[0].create_service_booking;
  if (data.code == "error") {
    return res.json({
      code: "error",
      message: data.message,
    });
  }

  res.json({
    code: "success",
    message: "Service booked successfully",
  })
})

router.get('/medical-exam/list/:employee_id', async (req, res) => {
  const { employee_id } = req.params;

  const result = await db.raw(
    `
    select servicebooking.booking_id, servicebooking.date, servicebooking.status, pet.pet_name, branch.branch_name
    from servicebooking 
    join service on servicebooking.service_id = service.service_id
    join pet on servicebooking.pet_id = pet.pet_id
    join branch on servicebooking.branch_id = branch.branch_id
    where service.service_name = 'Medical Examination' and servicebooking.employee_id = ?
    `,
    [employee_id]
  )
  const medicalExamList = result?.rows;
  
  res.json({
    code: "success",
    message: "Medical exam list fetched successfully",
    medicalExamList: medicalExamList
  })
});

router.get('/medical-exam/detail/:booking_id', async (req, res) => {
  const { booking_id } = req.params;

  const result = await db.raw(
    `
      select medicalexamination.*, pet.pet_name, servicebooking.date, servicebooking.status, servicebooking.price
      from servicebooking
      join medicalexamination on servicebooking.booking_id = medicalexamination.booking_id
      join pet on servicebooking.pet_id = pet.pet_id
      where servicebooking.booking_id = ?
    `,
    [booking_id]
  );

  const medicalExamDetail = result?.rows[0];

  if (!medicalExamDetail) {
    return res.json({
      code: "not_found",
      message: "Medical exam detail not found",
    })
  }
  
  res.json({
    code: "success",
    message: "Medical exam detail fetched successfully",
    medicalExamDetail: medicalExamDetail
  })
})

router.post('/medical-exam/update/:booking_id', async (req, res) => {
  const { booking_id } = req.params;
  const { symptom, diagnosis, prescription, price, next_appointment, status } = req.body;

  await db('medicalexamination').where({ booking_id: booking_id }).update({
    symptom: symptom,
    diagnosis: diagnosis,
    prescription: prescription,
    next_appointment: next_appointment,
  });

  await db('servicebooking').where({ booking_id: booking_id }).update({
    price: price,
    status: status,
  });

  res.json({
    code: "success",
    message: "Medical exam updated successfully",
  })
})

router.post('/vaccine-single/book', authMiddleware.verifyToken, async (req, res) => {
  const result = await db.raw(
    `SELECT create_vaccine_single(?, ?, ?, ?, ?, ?, ?);`,
    [
      req.body.service_id,
      req.body.date,
      req.body.branch_id,
      req.body.employee_id,
      req.body.pet_id,
      req.account.customer_id,
      req.body.vaccine_id
    ]
  );

  const data = result.rows[0].create_vaccine_single;
  if (data.code == "error") {
    return res.json({
      code: "error",
      message: data.message,
    });
  }

  res.json({
    code: "success",
    message: "Service booked successfully",
  })
})

router.get('/vaccine-single/list/:employee_id', async (req, res) => {
  const { employee_id } = req.params;
  const result = await db.raw(
    `
    select servicebooking.booking_id, servicebooking.date, servicebooking.status, branch.branch_name, pet.pet_name, vaccine.vaccine_name
    from servicebooking
    join service on servicebooking.service_id = service.service_id
    join branch on servicebooking.branch_id = branch.branch_id
    join pet on servicebooking.pet_id = pet.pet_id
    join vaccinationsingleservice on servicebooking.booking_id = vaccinationsingleservice.booking_id
    join vaccine on vaccinationsingleservice.vaccine_id = vaccine.vaccine_id
    where service.service_name = 'Vaccine Single Service' and servicebooking.employee_id = ?
    `,
    [employee_id]
  )
  const vaccineSingleList = result?.rows;
  res.json({
    code: "success",
    message: "Vaccine single list fetched successfully",
    vaccineSingleList: vaccineSingleList
  })
});

router.get('/vaccine-single/detail/:booking_id', async (req, res) => {
  const { booking_id } = req.params;

  const result = await db.raw(
    `
      select vaccinationsingleservice.*, pet.pet_name, servicebooking.date, servicebooking.status, servicebooking.price
      from servicebooking
      join vaccinationsingleservice on servicebooking.booking_id = vaccinationsingleservice.booking_id
      join pet on servicebooking.pet_id = pet.pet_id
      where servicebooking.booking_id = ?
    `,
    [booking_id]
  );

  const vaccineSingleDetail = result?.rows[0];

  if (!vaccineSingleDetail) {
    return res.json({
      code: "not_found",
      message: "Vaccine single detail not found",
    })
  }
  
  res.json({
    code: "success",
    message: "Vaccine single detail fetched successfully",
    vaccineSingleDetail: vaccineSingleDetail
  })
})

router.post('/vaccine-single/update/:booking_id', async (req, res) => {
  const { booking_id } = req.params;
  const { dosage, price, status } = req.body;

  await db('vaccinationsingleservice').where({ booking_id: booking_id }).update({
    dosage: dosage,
  });

  await db('servicebooking').where({ booking_id: booking_id }).update({
    price: price,
    status: status,
  });

  res.json({
    code: "success",
    message: "Vaccine single updated successfully",
  })
})

router.post('/vaccine-package/book', authMiddleware.verifyToken, async (req, res) => {
  const result = await db.raw(
    `SELECT create_vaccine_package(?, ?, ?, ?, ?, ?, ?);`,
    [
      req.body.service_id,
      req.body.date,
      req.body.branch_id,
      req.body.employee_id,
      req.body.pet_id,
      req.account.customer_id,
      req.body.package_id
    ]
  );

  const data = result.rows[0].create_vaccine_package;
  if (data.code == "error") {
    return res.json({
      code: "error",
      message: data.message,
    });
  }

  res.json({
    code: "success",
    message: "Service booked successfully",
  })
})

export default router;