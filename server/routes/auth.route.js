import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../utils/db.js';

const router = express.Router();

router.get('/verify', async (req, res) => {
  let token = req.cookies.employeeToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { account_id, username, email } = decoded;
      const employee_role_id = await db.select('role_id').from('role').where({ role_name: 'employee' }).first();

      const existEmployee = await db('account').where({ account_id, username, email, role_id: employee_role_id.role_id }).first();
      if (existEmployee) {
        const is_manager = await db.raw(
          `SELECT checkManager(?) AS is_manager`,
          [account_id]
        );
        return res.json({
          code: "success",
          message: "Token is valid",
          userInfo: {
            id: existEmployee.account_id,
            username: existEmployee.username,
            email: existEmployee.email,
            is_manager: is_manager.rows[0].is_manager,
            role: 'employee'
          },
        });
      }
    } catch (err) {
      return res.json({
        code: "error",
        message: "Invalid token",
      });
    }
  }
  else {
    token = req.cookies.customerToken;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { account_id, username, email } = decoded;
        const customer_role_id = await db.select('role_id').from('role').where({ role_name: 'customer' }).first();

        const existCustomer = await db('account').where({ account_id, username, email, role_id: customer_role_id.role_id }).first();
        if (existCustomer) {
          return res.json({
            code: "success",
            message: "Token is valid",
            userInfo: {
              id: existCustomer.account_id,
              username: existCustomer.username,
              email: existCustomer.email,
              role: 'customer'
            },
          });
        }
      } catch (err) {
        return res.json({
          code: "error",
          message: "Invalid token",
        });
      }
    }
  }
})

export default router;