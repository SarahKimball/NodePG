const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /companies
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT code, name FROM companies');
    return res.json({ companies: result.rows });
  } catch (err) {
    return next(err);
  }
});

// GET /companies/:code
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const companyResult = await db.query(
      'SELECT code, name, description FROM companies WHERE code = $1',
      [code]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const invoiceResult = await db.query(
      'SELECT id FROM invoices WHERE comp_code = $1',
      [code]
    );

    const company = companyResult.rows[0];
    company.invoices = invoiceResult.rows.map((row) => row.id);

    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

// POST /companies
router.post('/', async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const result = await db.query(
      'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description',
      [code, name, description]
    );
    return res.status(
