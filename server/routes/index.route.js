import express from 'express';
import employeeRouter from './employee.route.js';
import branchRouter from './branch.route.js';
import productRouter from './product.route.js';
import vaccineRouter from './vaccine.route.js';
import serviceRouter from './service.route.js';
import vaccinePackageRouter from './vaccine-package.route.js';

const router = express.Router();

router.use("/employee", employeeRouter);

router.use("/branch", branchRouter);

router.use("/product", productRouter);

router.use("/vaccine", vaccineRouter);

router.use("/service", serviceRouter);

router.use("/vaccine-package", vaccinePackageRouter);

export default router;