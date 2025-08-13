var express = require('express');
var router = express.Router();
const pool = require('../models/db.js');

router.get('/', (req, res) => {
    res.send('Hello from our server!');
})

router.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS current_time');
    res.json({ success: true, time: rows[0].current_time });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
