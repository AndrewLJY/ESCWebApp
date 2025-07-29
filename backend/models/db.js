const mysql = require("mysql2");
let pool = mysql
  .createPool({
    host: "localhost",
    user: "escHotelT5",
    database: "hotelbookingapp",
    password: "12345",
    connectionLimit: 10,
    keepAliveInitialDelay: 10000, // 0 by default.
    enableKeepAlive: true, // false by default.
  })
  .promise();

async function cleanup() {
  await pool.end();
}

async function verifyConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 AS connection_test");
    return rows[0].connection_test === 1;
  } catch (error) {
    console.error("Database connection verification failed:", error);
    return false;
  }
}

module.exports = { pool, cleanup, verifyConnection };
