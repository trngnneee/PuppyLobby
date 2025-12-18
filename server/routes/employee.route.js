import express from 'express';
import db from "./../utils/db.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/auth/signin', async (req, res) => {
  const { username, email, password, rememberLogin } = req.body;

  const role_id = await db.select('role_id').from('role').where({ role_name: 'employee' }).first();

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
  if (existAccount.password !== req.body.password) {
    return res.json({
      code: "error",
      message: "Incorrect password",
    })
  }

  const employeeToken = jwt.sign(
    { account_id: existAccount.account_id, username: existAccount.username, email: existAccount.email },
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

router.post('/create', async (req, res) => {
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

router.get("/list", async (req, res) => {
  const query = db.select('*').from('employee');

  if (req.query.keyword) {
    const keyword = req.query.keyword?.trim();
    query.whereRaw(
      "fts @@ plainto_tsquery('english', remove_accents(?) || ':*')",
      [keyword]
    )
  }
  const pageSize = 10;
  const countResult = await db('employee').count('* as count').first();
  const totalPages = Math.ceil(Number(countResult.count) / pageSize);
  if (req.query.page) {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * pageSize;
    query.limit(pageSize).offset(offset);
  }
  const rawEmployees = await query;

  const employeeList = [];
  for (const emp of rawEmployees) {
    const managerDetail = await db.select('employee_name').from('employee').where({ employee_id: emp.manager_id }).first();
    const workingDetail = await db.select('branch_name').from('employeehistory').join('branch', 'employeehistory.branch_id', 'branch.branch_id').where({ employee_id: emp.employee_id }).orderBy('start_date', 'desc').first();
    employeeList.push({
      employee_id: emp.employee_id,
      employee_name: emp.employee_name,
      date_of_birth: emp.date_of_birth,
      gender: emp.gender,
      manager_id: emp.manager_id,
      manager_name: managerDetail ? managerDetail.employee_name : null,
      working_branch: workingDetail ? workingDetail.branch_name : null,
    });
  }

  res.json({
    code: "success",
    message: "Employee list retrieved successfully",
    employeeList: employeeList,
    totalPages: totalPages,
  })
})

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  await db('employee').where({ employee_id: id }).del();

  res.json({
    code: "success",
    message: "Employee deleted successfully",
  })
})

router.get('/detail/:id', async (req, res) => {
  const { id } = req.params;
  const existEmployee = await db.select('*').from('employee').where({ employee_id: id }).first();
  const existVeterinarian = await db.select('*').from('veterinarian').where({ employee_id: id }).first();
  if (existVeterinarian) {
    existEmployee.degree = existVeterinarian.degree;
    existEmployee.specialization = existVeterinarian.specialization;
  }

  if (!existEmployee) {
    return res.json({
      code: "error",
      message: "Employee not found",
    })
  }

  res.json({
    code: "success",
    message: "Employee detail retrieved successfully",
    employeeDetail: existEmployee,
  })
})

router.post('/update/:id', async (req, res) => {
  const { id } = req.params;

  await db('employee').where({ employee_id: id }).update({
    employee_name: req.body.fullname,
    date_of_birth: req.body.date_of_birth,
    gender: req.body.gender,
    manager_id: req.body.managerID === "manager" ? null : req.body.managerID,
  });

  if (req.body.type === "veterinarian") {
    const existVeterinarian = await db.select('*').from('veterinarian').where({ employee_id: id }).first();
    if (existVeterinarian) {
      await db('veterinarian').where({ employee_id: id }).update({
        degree: req.body.degree,
        specialization: req.body.specialization,
      });
    } else {
      await db('veterinarian').insert({
        employee_id: id,
        degree: req.body.degree,
        specialization: req.body.specialization,
      });
    }
  }
  else {
    const existVeterinarian = await db.select('*').from('veterinarian').where({ employee_id: id }).first();
    if (existVeterinarian) {
      await db('veterinarian').where({ employee_id: id }).del();
    }
  }

  res.json({
    code: "success",
    message: "Employee updated successfully",
  })
})

router.post('/assign', async (req, res) => {
  const { branch_id, employee_id, position, start_date, end_date, salary } = req.body;

  await db.raw(`
    SELECT assignEmployeeToBranch(?, ?, ?, ?, ?, ?) AS result
  `, [branch_id, employee_id, position, start_date, end_date, salary]);

  res.json({
    code: "success",
    message: "Employee assigned successfully",
  })
})

router.get('/list/:branch_id', async (req, res) => {
  const { branch_id } = req.params;

  const result = await db.raw(
    `
    SELECT employee.employee_id, employee.employee_name
    FROM employeehistory
    JOIN employee ON employeehistory.employee_id = employee.employee_id
    JOIN veterinarian ON employee.employee_id = veterinarian.employee_id
    WHERE branch_id = ? AND end_date IS NULL AND veterinarian.employee_id IS NOT NULL
    `,
    [branch_id]
  );

  const employeeList = result.rows.map(emp => ({
    employee_id: emp.employee_id,
    employee_name: emp.employee_name,
  }));

  res.json({
    code: "success",
    message: "Employee list for branch retrieved successfully",
    employeeList: employeeList,
  })
})

router.post('/history', async (req, res) => {
  const { email } = req.body;

  const result = await db.raw(
    `
      select *
      from employeehistory
      join branch on employeehistory.branch_id = branch.branch_id
      where employee_id = (
        select employee_id
        from employee
        join account on employee.account_id = account.account_id
        where account.email = ?
      )
    `,
    [email]
  );

  if (result.rows.length === 0) {
    return res.json({
      code: "error",
      message: "No history found for the provided email",
    })
  }

  res.json({
    code: "success",
    message: "Employee history achieved successfully",
    history: result.rows,
  })
})

export default router;