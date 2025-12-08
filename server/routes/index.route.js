import express from 'express';
import employeeRouter from './employee.route.js';

const router = express.Router();

router.use("/employee", employeeRouter);

export default router;