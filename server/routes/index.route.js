import express from 'express';
import employeeRouter from './employee.route.js';
import branchRouter from './branch.route.js';

const router = express.Router();

router.use("/employee", employeeRouter);

router.use("/branch", branchRouter);

export default router;