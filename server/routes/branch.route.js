import express from 'express';
import db from "./../utils/db.js";

const router = express.Router();

router.get("/list", async (req, res) => {
  const branchList = await db.select('*').from('branch');
  
  res.json({
    code: "success",
    message: "Branch list retrieved successfully",
    branchList: branchList
  })
})

export default router;
