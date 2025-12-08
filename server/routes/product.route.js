import express from "express"
import multer from "multer"
import { storage } from "./../middleware/cloudinary.middleware.js"
import db from "./../utils/db.js"

const router = express.Router()

const upload = multer({ storage: storage })

router.post("/create", upload.array('files', 5), async (req, res) => {
  await db.raw(`
  SELECT createProduct(
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?,
    ?, ?, ?,
    ?
  )
`, [
    req.body.type,
    req.body.product_name,
    parseFloat(req.body.price),
    req.body.manufacture_date,
    req.body.entry_date,
    req.body.expiry_date,
    parseInt(req.body.stock),

    // Medicine
    req.body.species || null,
    req.body.dosage_use || null,
    req.body.side_effect || null,

    // Food
    req.body.weight || null,
    req.body.nutrition_description || null,

    // Accessory
    req.body.size || null,
    req.body.color || null,
    req.body.material || null,

    req.files.map(file => file.path) || null
  ])

  res.json({
    code: "success",
    message: "Product created successfully",
  });
})

router.get("/medicine/list", async (req, res) => {
  const query = db.select("*").from("product").where("type", "medicine").join("medicine", "product.product_id", "medicine.product_id");
  const pageSize = 5;
  const countResult = await db('product').where("type", "medicine").count('* as count').first();
  const totalPages = Math.ceil(Number(countResult.count) / pageSize);
  if (req.query.page) {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * pageSize;
    query.limit(pageSize).offset(offset);
  }

  const productList = await query;

  for (const product of productList) {
    const images = await db.select("image_url").from("productimage").where("product_id", product.product_id);
    product.images = images.map(img => img.image_url);
  }

  res.json({
    code: "success",
    message: "Medicine list fetched successfully",
    productList: productList,
    totalPages: totalPages,
  })
})

router.get("/food/list", async (req, res) => {
  const query = db.select("*").from("product").where("type", "food").join("food", "product.product_id", "food.product_id");
  const pageSize = 5;
  const countResult = await db('product').where("type", "food").count('* as count').first();
  const totalPages = Math.ceil(Number(countResult.count) / pageSize);
  if (req.query.page) {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * pageSize;
    query.limit(pageSize).offset(offset);
  }

  const productList = await query;

  for (const product of productList) {
    const images = await db.select("image_url").from("productimage").where("product_id", product.product_id);
    product.images = images.map(img => img.image_url);
  }

  res.json({
    code: "success",
    message: "Food list fetched successfully",
    productList: productList,
    totalPages: totalPages
  })
})

router.get("/accessory/list", async (req, res) => {
  const query = db.select("*").from("product").where("type", "accessory").join("accessory", "product.product_id", "accessory.product_id");
  const pageSize = 5;
  const countResult = await db('product').where("type", "accessory").count('* as count').first();
  const totalPages = Math.ceil(Number(countResult.count) / pageSize);
  if (req.query.page) {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * pageSize;
    query.limit(pageSize).offset(offset);
  }

  const productList = await query;

  for (const product of productList) {
    const images = await db.select("image_url").from("productimage").where("product_id", product.product_id);
    product.images = images.map(img => img.image_url);
  }

  res.json({
    code: "success",
    message: "Accessory list fetched successfully",
    productList: productList,
    totalPages: totalPages
  })
})

router.delete("/delete/:productId", async (req, res) => {
  const { productId } = req.params;

  await db('product').where({ product_id: productId }).del();
  res.json({
    code: "success",
    message: "Product deleted successfully",
  })
})

export default router