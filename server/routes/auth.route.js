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

      const existEmployee = await db('account').join('employee', 'account.account_id', 'employee.account_id').where({ 'account.account_id': account_id, 'account.username': username, 'account.email': email, 'account.role_id': employee_role_id.role_id }).first();
      if (existEmployee) {
        const is_manager = await db.raw(
          `SELECT checkManager(?) AS is_manager`,
          [account_id]
        );
        const is_veterinarian = await db.raw(
          `SELECT checkVeterinarian(?) AS is_veterinarian`,
          [account_id]
        );
        return res.json({
          code: "success",
          message: "Token is valid",
          userInfo: {
            id: existEmployee.account_id,
            employee_id: existEmployee.employee_id,
            username: existEmployee.username,
            email: existEmployee.email,
            is_manager: is_manager.rows[0].is_manager,
            is_veterinarian: is_veterinarian.rows[0].is_veterinarian,
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

        const existCustomer = await db('account')
          .join(
            'customeraccount',
            'account.account_id',
            'customeraccount.account_id'
          )
          .join(
            'customer',
            'customeraccount.customer_id',
            'customer.customer_id'
          )
          .where({
            'account.account_id': account_id,
            'account.username': username,
            'account.email': email,
            'account.role_id': customer_role_id.role_id,
          })
          .first();

        if (existCustomer) {
          return res.json({
            code: "success",
            message: "Token is valid",
            userInfo: {
              id: existCustomer.account_id,
              customer_id: existCustomer.customer_id,
              username: existCustomer.username,
              email: existCustomer.email,
              customer_name: existCustomer.customer_name,
              phone_number: existCustomer.phone_number,
              cccd: existCustomer.cccd,
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