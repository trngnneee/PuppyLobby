import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import db from '../utils/db.js';

const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  const { pet_name, species, breed, age, gender, health_state } = req.body;
  const result = await db.raw(
    `SELECT add_pet(?, ?, ?, ?, ?, ?, ?)`,
    [req.account.customer_id, pet_name, species, breed, age, gender, health_state]
  );

  const dbRes = result.rows[0].add_pet;

  if (dbRes.code === "error") {
    return res.json({
      code: "error",
      message: dbRes.message
    })
  };

  res.json({
    code: "success",
    message: "Create pet successfully!"
  })
});

router.get("/list", verifyToken, async (req, res) => {
  const query = db('pet').select('*').where({ customer_id: req.account.customer_id });
  const pageSize = 3;
  const countResult = await db('pet').where({ customer_id: req.account.customer_id }).count('* as count').first();
  const totalPages = Math.ceil(Number(countResult.count) / pageSize);
  if (req.query.page) {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * pageSize;
    query.limit(pageSize).offset(offset);
  }
  if (req.query.keyword)
  {
    const keyword = req.query.keyword?.trim();
    query.whereRaw(
      "fts @@ plainto_tsquery('english', remove_accents(?) || ':*')",
      [keyword]
    )
  }

  const petList = await query;

  res.json({
    code: "success",
    message: "List pets successfully!",
    petList: petList,
    totalPages: totalPages
  })
})

router.delete("/delete/:pet_id", async (req, res) => {
  const { pet_id } = req.params;

  await db('pet').where({ pet_id: pet_id }).del();
  
  res.json({
    code: "success",
    message: "Delete pet successfully!"
  })
})

router.get("/detail/:pet_id", verifyToken, async (req, res) => {
  const { pet_id } = req.params;

  const petDetail = await db('pet').where({ pet_id: pet_id }).first();

  res.json({
    code: "success",
    message: "Get pet detail successfully!",
    petDetail: petDetail
  })
})

router.patch("/update/:pet_id", async (req, res) => {
  const { pet_id } = req.params;
  const { pet_name, species, breed, age, gender, health_state } = req.body;

  await db('pet').where({ pet_id: pet_id }).update({
    pet_name: pet_name,
    species: species,
    breed: breed,
    age: age,
    gender: gender,
    health_state: health_state
  });

  res.json({
    code: "success",
    message: "Update pet successfully!"
  })
})

export default router;