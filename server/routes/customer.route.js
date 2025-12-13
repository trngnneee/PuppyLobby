import express from 'express';
import db from "./../utils/db.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/auth/signup', async (req, res) => {
  const { fullname, username, email, phone, citizen_id, password } = req.body;

  const result = await db.raw(
    `SELECT createCustomerAccount(?, ?, ?, ?, ?, ?) AS result`,
    [fullname, username, email, phone, citizen_id, password]
  )

  if (result.rows[0].code === 'error') {
    return res.json({
      code: "error",
      message: result.rows[0].message
    })
  }

  res.json({
    code: "success",
    message: "Customer signed up successfully"
  })
})

router.post('/auth/signin', async (req, res) => {
  const { username, email, password, rememberLogin } = req.body;

  const role_id = await db.select('role_id').from('role').where({ role_name: 'customer' }).first();

  const existUsername = await db.raw(
    `SELECT checkUsernameExists(?) AS exists`,
    [username]
  );
  if (!existUsername.rows[0].exists) {
    return res.json({
      code: "error",
      message: "Username does not exist",
    })
  }

  const existEmail = await db.raw(
    `SELECT checkEmailExists(?) AS exists`,
    [email]
  );
  if (!existEmail.rows[0].exists) {
    return res.json({
      code: "error",
      message: "Email does not exist",
    })
  }

  const existAccount = await db.select('*').from('account').where({ username, email, role_id: role_id.role_id }).first();
  if (!existAccount) 
  {
    return res.json({
      code: "error",
      message: "Account does not exist",
    })
  }
  if (existAccount.password !== password) {
    return res.json({
      code: "error",
      message: "Incorrect password",
    })
  }

  const customerToken = jwt.sign(
    { account_id: existAccount.account_id, username: existAccount.username, email: existAccount.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.cookie('customerToken', customerToken, {
    maxAge: rememberLogin ? 7 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });

  res.json({
    code: "success",
    message: "Customer signed in successfully"
  })
})

export default router;