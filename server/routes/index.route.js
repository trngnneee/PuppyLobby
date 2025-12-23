import express from 'express';
import employeeRouter from './employee.route.js';
import branchRouter from './branch.route.js';
import productRouter from './product.route.js';
import vaccineRouter from './vaccine.route.js';
import serviceRouter from './service.route.js';
import vaccinePackageRouter from './vaccine-package.route.js';
import customerRouter from './customer.route.js';
import authRouter from './auth.route.js';
import petRouter from './pet.route.js';
import cartRouter from './cart.route.js';
import invoiceRouter from './invoice.route.js';

const router = express.Router();

router.use("/auth", authRouter);

router.use("/employee", employeeRouter);

router.use("/branch", branchRouter);

router.use("/product", productRouter);

router.use("/vaccine", vaccineRouter);

router.use("/service", serviceRouter);

router.use("/vaccine-package", vaccinePackageRouter);

router.use("/customer", customerRouter);

router.use('/pet', petRouter);

router.use('/cart', cartRouter);

router.use('/invoice', invoiceRouter);

export default router;