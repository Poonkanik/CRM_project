const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// GET /api/agents - List all agents with search, filter, pagination
router.get('/', authMiddleware, async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let query = 'SELECT * FROM agents WHERE 1=1';
  let countQuery = 'SELECT COUNT(*) as total FROM agents WHERE 1=1';
  const params = [];
  const countParams = [];

  if (search) {
    const searchClause = ' AND (name LIKE ? OR company_name LIKE ? OR email LIKE ?)';
    query += searchClause;
    countQuery += searchClause;
    const searchVal = `%${search}%`;
    params.push(searchVal, searchVal, searchVal);
    countParams.push(searchVal, searchVal, searchVal);
  }

  if (status) {
    query += ' AND status = ?';
    countQuery += ' AND status = ?';
    params.push(status);
    countParams.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  try {
    const [agents] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: agents,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch agents.' });
  }
});

// GET /api/agents/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [agents] = await pool.query('SELECT * FROM agents WHERE id = ?', [req.params.id]);
    if (agents.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent not found.' });
    }
    res.json({ success: true, data: agents[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch agent.' });
  }
});

// POST /api/agents
router.post('/', authMiddleware, async (req, res) => {
  const { name, company_name, email, phone, properties, inspections, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM agents WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Agent with this email already exists.' });
    }

    const [result] = await pool.query(
      'INSERT INTO agents (name, company_name, email, phone, properties, inspections, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, company_name || null, email, phone || null, properties || 0, inspections || 0, status || 'Active']
    );

    const [newAgent] = await pool.query('SELECT * FROM agents WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Agent created successfully.', data: newAgent[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create agent.' });
  }
});

// PUT /api/agents/:id
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, company_name, email, phone, properties, inspections, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM agents WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent not found.' });
    }

    const [emailCheck] = await pool.query('SELECT id FROM agents WHERE email = ? AND id != ?', [email, req.params.id]);
    if (emailCheck.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already used by another agent.' });
    }

    await pool.query(
      'UPDATE agents SET name=?, company_name=?, email=?, phone=?, properties=?, inspections=?, status=? WHERE id=?',
      [name, company_name || null, email, phone || null, properties || 0, inspections || 0, status || 'Active', req.params.id]
    );

    const [updated] = await pool.query('SELECT * FROM agents WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Agent updated successfully.', data: updated[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update agent.' });
  }
});

// DELETE /api/agents/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM agents WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent not found.' });
    }

    await pool.query('DELETE FROM agents WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Agent deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete agent.' });
  }
});

module.exports = router;
