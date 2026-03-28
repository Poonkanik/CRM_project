const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// GET /api/dashboard/stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [[clientsResult]] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [[propertiesResult]] = await pool.query('SELECT COUNT(*) as total FROM properties');
    const [[totalInspections]] = await pool.query('SELECT COUNT(*) as total FROM inspections');
    const [[pendingInspections]] = await pool.query("SELECT COUNT(*) as total FROM inspections WHERE status='Pending'");
    const [[closedInspections]] = await pool.query("SELECT COUNT(*) as total FROM inspections WHERE status='Closed' OR status='Completed'");

    res.json({
      success: true,
      data: {
        totalClients: clientsResult.total,
        totalProperties: propertiesResult.total,
        totalInspections: totalInspections.total,
        pendingInspections: pendingInspections.total,
        closedInspections: closedInspections.total,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
});

// GET /api/dashboard/recent-activity
router.get('/recent-activity', authMiddleware, async (req, res) => {
  try {
    const [inspections] = await pool.query(`
      SELECT 
        i.inspection_id,
        p.name as property,
        a.company_name as agent,
        ins.name as inspector,
        i.status,
        i.updated_at
      FROM inspections i
      LEFT JOIN properties p ON i.property_id = p.id
      LEFT JOIN agents a ON i.agent_id = a.id
      LEFT JOIN inspectors ins ON i.inspector_id = ins.id
      ORDER BY i.updated_at DESC
      LIMIT 6
    `);

    res.json({ success: true, data: inspections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch recent activity.' });
  }
});

module.exports = router;
