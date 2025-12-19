import express from "express"
import multer from "multer"
import { storage } from "../middleware/cloudinary.middleware.js"
import db from "./../utils/db.js"

const router = express.Router()

const upload = multer({ storage: storage })

router.post("/create", upload.array('files', 5), async (req, res) => {
  console.log ("Files:", req.files);
  const product_info = {

    type: req.body.type,
    product_name: req.body.product_name,
    price: Number(req.body.price),
    manufacture_date: req.body.manufacture_date,
    entry_date: req.body.entry_date,
    expiry_date: req.body.expiry_date,
    stock: Number(req.body.stock),
    images: req.files.map(file => file.path)
  }

  const extra_info = {};
  if (product_info.type === 'medicine') {
    extra_info.species = req.body.species;
    extra_info.dosage_use = req.body.dosage_use;
    extra_info.side_effect = req.body.side_effect;
  }
  else if (product_info.type === 'food') {
    extra_info.species = req.body.species;
    extra_info.weight = Number(req.body.weight);
    extra_info.nutrition_description = req.body.nutrition_description;
  }
  else if (product_info.type === 'accessory') {
    extra_info.size = req.body.size;
    extra_info.color = req.body.color;
    extra_info.material = req.body.material;
  }
  const result = await db.raw(`
    SELECT * FROM create_product(?, ?)
  `, [product_info, extra_info]);

  if (result.rows[0].create_product.code === 'error') {
    return res.json({
      code: "error",
      message: result.rows[0].create_product.message,
    });
  }
  res.json({
    code: "success",
    message: "Product created successfully",
  });
})

router.get("/product_types", async (req, res) => {
  const type = req.query.type;
  const search = req.query.search || "";
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

  const result = await db.raw(`
    
    SELECT * FROM get_product_type_list(?, ?, ?, ?)
  `, [type, search, page, pageSize]);
  
  const product = result.rows;
  res.json({
    code: "success",  
    message: "Product types fetched successfully",
    productList: product,
    totalCount : product.length > 0 ? product[0].total_count : 0,
    totalPages: Math.ceil((product.length > 0 ? product[0].total_count : 0) / pageSize)
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
  const result = await db.raw(`
    SELECT * FROM get_product_detail(?)
  `, [productId]);
  const productDetail = result.rows[0].get_product_detail;
  const resultAll = {
    ...productDetail.product_info,
    ...productDetail.extra_info
  }
  res.json({
    code: "success",
    message: "Product detail fetched successfully",
    productDetail: resultAll
  })
})

router.post("/update/:productId", upload.array('files', 5), async (req, res) => {
  const { productId } = req.params;

  let product_info = {
    type : req.body.type,
    product_name: req.body.product_name,
    price: Number(req.body.price),
    manufacture_date: req.body.manufacture_date,
    entry_date: req.body.entry_date,
    expiry_date: req.body.expiry_date,
    stock: Number(req.body.stock),
    images: []  // Will be set later
  }
  console.log ("Product info: ", product_info);

  const newImageUrls = req.files.map(file => file.path);
  
  const keptImageUrls = JSON.parse( req.body.existingFiles || '[]');

  const allImageUrls = [...keptImageUrls, ...newImageUrls];
  product_info.images = allImageUrls;

  const extra_info = {};
  if (product_info.type === 'medicine') {
    extra_info.species = req.body.species;
    extra_info.dosage_use = req.body.dosage_use;
    extra_info.side_effect = req.body.side_effect;
  }
  else if (product_info.type === 'food') {
    extra_info.species = req.body.species;
    extra_info.weight = Number(req.body.weight);
    extra_info.nutrition_description = req.body.nutrition_description;
  }
  else if (product_info.type === 'accessory') {
    extra_info.size = req.body.size;
    extra_info.color = req.body.color;
    extra_info.material = req.body.material;
  }
  const t = await db.transaction();

  const result = await t.raw(`
    SELECT * FROM update_product(?, ?, ?)
  `, [productId, product_info, extra_info]);
  if (result.rows[0].update_product.code === 'error') {
    await t.rollback();
    return res.json({
      code: "error",
      message: result.rows[0].update_product.message,
    });
  }
  await t.commit();

  res.json({
    code: "success",
    message: "Product updated successfully"
  });

});

export default router