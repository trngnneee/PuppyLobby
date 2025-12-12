import express from "express"
import multer from "multer"
import { storage } from "../middleware/cloudinary.middleware.js"
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
    const page = parseInt(String(req.query.page)) || 1;
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
    const page = parseInt(String(req.query.page)) || 1;
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
    const page = parseInt(String(req.query.page)) || 1;
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

router.get("/detail/:productId", async (req, res) => {
  const { productId } = req.params;
  const productDetail = await db.select("*").from("product").where("product.product_id", productId).first();
  const images = await db.select("image_url").from("productimage").where("product_id", productId);
  productDetail.images = images.map(img => img.image_url);
  if (productDetail.type === "medicine") {
    const medicineDetail = await db.select("*").from("medicine").where("medicine.product_id", productId).first();
    Object.assign(productDetail, medicineDetail);
  }
  if (productDetail.type === "food") {
    const foodDetail = await db.select("*").from("food").where("food.product_id", productId).first();
    Object.assign(productDetail, foodDetail);
  }
  if (productDetail.type === "accessory") {
    const accessoryDetail = await db.select("*").from("accessory").where("accessory.product_id", productId).first();
    Object.assign(productDetail, accessoryDetail);
  }
  res.json({
    code: "success",
    message: "Medicine detail fetched successfully",
    productDetail: productDetail
  })
})

router.post("/update/:productId", upload.array('files', 5), async (req, res) => {
  const { productId } = req.params;
  const {
    type,
    product_name,
    price,
    manufacture_date,
    entry_date,
    expiry_date,
    stock,
    existingFiles
  } = req.body;

  const t = await db.transaction();

  const newImageUrls = req.files.map(file => file.path);
  
  const keptImageUrls = JSON.parse(existingFiles || '[]');

  await t('productimage')
    .where('product_id', productId)
    .whereNotIn('image_url', keptImageUrls)
    .del();

  if (newImageUrls.length > 0) {
    const insertImages = newImageUrls.map(url => ({
      product_id: productId,
      image_url: url
    }));
    await t('productimage').insert(insertImages);
  }

  await t('product')
    .where('product_id', productId)
    .update({
      product_name,
      price: Number(price),
      manufacture_date,
      entry_date,
      expiry_date,
      stock: Number(stock)
    });

  if (type === 'medicine') {
    const { species, dosage_use, side_effect } = req.body;
    await t('medicine')
      .where('product_id', productId)
      .update({ species, dosage_use, side_effect });
  } else if (type === 'food') {
    const { species, weight, nutrition_description } = req.body;
    await t('food')
      .where('product_id', productId)
      .update({ species, weight, nutrition_description });
  } else if (type === 'accessory') {
    const { size, color, material } = req.body;
    await t('accessory')
      .where('product_id', productId)
      .update({ size, color, material });
  }

  await t.commit();

  res.json({
    code: "success",
    message: "Product updated successfully"
  });
});

export default router