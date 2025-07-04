const mysql = require('mysql2')
let pool = mysql
  .createPool({
    host: "localhost",
    user: "escHotelT5",
    database: "hotelbookingapp",
    password: "12345",
    connectionLimit: 10,
  })
  .promise();
async function cleanup() {
    await pool.end();
}
module.exports = {pool, cleanup};