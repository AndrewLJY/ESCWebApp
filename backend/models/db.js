const mysql = require("mysql2");

let sslOptions = null;
if (process.env.DB_CA_CERT && fs.existsSync(process.env.DB_CA_CERT)) {
  sslOptions = { ca: fs.readFileSync(process.env.DB_CA_CERT) };
} else if (process.env.NODE_ENV === "production") {
  // If in production and no CA file, force unverified SSL (not ideal but avoids connection failure)
  sslOptions = { rejectUnauthorized: false };
}

let pool = mysql
  .createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "escHotelT5",
    database: process.env.DB_NAME || "hotelbookingapp",
    password: process.env.DB_PASSWORD || "12345",
    connectionLimit: 10,
    keepAliveInitialDelay: 10000, // 0 by default.
    enableKeepAlive: true, // false by default.
    ssl: sslOptions, // <-- add SSL here
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

(async () => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS "current_time"');
    console.log('DB connection successful. Current time:', rows[0].current_time);
  } catch (err) {
    console.error('DB connection failed:', err.message);
  }
})();

module.exports = { pool, cleanup, verifyConnection };
