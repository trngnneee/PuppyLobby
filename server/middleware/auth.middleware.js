import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import db from '../utils/db.js';

export const verifyCustomerAuth = async (req, res, next) => {
  const token = req.cookies.customerToken;
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
      req.account = {
        account_id: existCustomer.account_id,
        customer_id: existCustomer.customer_id,
        role: 'customer'
      };
    }
  } catch (err) {
    return res.json({
      code: "error",
      message: "Invalid token",
    });
  }

  next();
}