import express from 'express';
import db from "./../utils/db.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/auth/signin', async (req, res) => {
  const { username, email, password, rememberLogin } = req.body;

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

  const existAccount = await db.select('*').from('account').where({ username, email, password }).first();
  if (existAccount.password !== password) {
    return res.json({
      code: "error",
      message: "Incorrect password",
    })
  }

  const employeeToken = jwt.sign(
    { id: existAccount.id, username: existAccount.username, email: existAccount.email },
    process.env.JWT_SECRET,
    { expiresIn: rememberLogin ? '7d' : '1d' }
  )

  res.cookie('employeeToken', employeeToken, {
    maxAge: rememberLogin ? 7 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });

  res.json({
    code: "success",
    message: "Sign-in successful",
  })
});

router.get('/auth/verify', (req, res) => {
  const token = req.cookies.employeeToken;
  if (!token) {
    return res.json({
      code: "error",
      message: "No token provided",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username, email } = decoded;
    const existUser = db('account').where({ id, username, email }).first();
    return res.json({
      code: "success",
      message: "Token is valid",
      userInfo: {
        id: existUser.id,
        username: existUser.username,
        email: existUser.email,
      },
    });
  } catch (err) {
    return res.json({
      code: "error",
      message: "Invalid token",
    });
  }
})

router.get('/auth/signout', (req, res) => {
  res.clearCookie('employeeToken');
  res.json({
    code: "success",
    message: "Sign-out successful",
  })
})

router.get('/manager/list', async (req, res) => {
  const rawManagers = await db('employee').where({ manager_id: null });
  const managerList = rawManagers.map(manager => ({
    employee_id: manager.employee_id,
    employee_name: manager.employee_name,
  }));
  res.json({
    code: "success",
    message: "Manager list retrieved successfully",
    managerList: managerList,
  })
})

router.post('/manage/create', async (req, res) => {
  const result = await db.raw(`
  SELECT addEmployee(
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  ) AS result
`, [
    req.body.username,
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.date_of_birth,
    req.body.gender,
    req.body.managerID,
    req.body.type,
    req.body.degree,
    req.body.specialization
  ]);

  res.json(result.rows[0].result);
})

export default router;