import express from 'express';
import db from './../utils/db.js';

const router = express.Router();

router.get("/list", async (req, res) => {
  const serviceList = await db.select('*').from('service');

  for (const service of serviceList) {
    const branchList = await db('branchservice').where({ service_id: service.service_id });
    const branchDetail = await db.select('branch_name').from('branch').whereIn('branch_id', branchList.map(b => b.branch_id));
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
      code : "not_found",
      message: "Service not found",
    })
  }

  const branchList = await db.select('*').from('branchservice').where({ service_id: id });

  res.json({
    code : "success",
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

export default router;