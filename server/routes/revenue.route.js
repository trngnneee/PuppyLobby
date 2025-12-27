import express from 'express';
import db from '../utils/db.js';
const router = express.Router();


// Input in this revenue 
// start date
// end date 
// branch (all or specific 1)
// if branch is specific 1, doctor id (all or specific 1)


router.get("/summary", async(req, res) => {
    const {startDate, endDate, interval} = req.query;
    console.log("Received revenue summary request with params:", {startDate, endDate, interval});
    try {
        const revenueSumamary = await db.raw (
            `select * from get_revenue_all_branches(?, ?, ?)`
        ,
        [startDate, endDate, interval])
        res.json (
            {
                message: "Successfully fetched revenue summary",
                data: revenueSumamary.rows[0].get_revenue_all_branches
            }
        )
    }
    catch (error){
        console.error("Error fetching revenue summary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})


router.get("/summary/branch", async (req, res) => {
    const {startDate, endDate, branch_id, interval} = req.query;
    console.log("Received branch revenue summary request with params:", {startDate, endDate, branch_id, interval});
    try{
        const branchRevenueSummary = await db.raw (
            `select * from get_revenue_single_branch(?, ?, ?, ?)`
        ,
        [branch_id, startDate, endDate, interval])
        res.json (
            {
                message: "Successfully fetched branch revenue summary",
                data: branchRevenueSummary.rows[0].get_revenue_single_branch
            }
        )
    }
    catch(error){
        console.error("Error fetching branch revenue summary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/summary/branch/doctor", async (req, res) => {
    const {startDate, endDate, branch_id, doctor_id, interval} = req.query;
    console.log("Received doctor revenue summary request with params:", {startDate, endDate, branch_id, doctor_id, interval});
    try{
        const doctorRevenueSummary = await db.raw (
            `select * from get_revenue_doctor_branch(?, ?, ?, ?, ?)`
        ,
        [branch_id, doctor_id, startDate, endDate, interval])
        res.json (
            {
                message: "Successfully fetched doctor revenue summary",
                data: doctorRevenueSummary.rows[0].get_revenue_doctor_branch
            }
        )
    }
    catch(error){
        console.error("Error fetching doctor revenue summary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})



export default router;