const { escape } = require("mysql2");
const db = require("./db.js");
const bookingTable = require("../models/booking.js");
const bookmarkTable = require("../models/bookmark.js");
var tableName;
if (process.env.NODE_ENV !== "test") {
  tableName = "user";
} else {
  tableName = "user_test_table";
}
const bcrypt = require("bcrypt");

class User {
  constructor(id = null, email, password) {
    this.email = email;
    this.password = password;
    this.id = id;
  }

  static newUser(id, email, password) {
    // in JS, only one constructor is allowed
    // we need a factory method
    return new User(id, email, password);
  }
}

async function sync() {
  try {
    // for simplicity, we assume staff names are uniqe (in the absence of NRIC or personal email)
    db.pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255),
            password VARCHAR(255)
        )
        `);
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
  }
}

async function findByEmail(email) {
  try {
    const [rows, fieldDefs] = await db.pool.query(
      `
            SELECT ${tableName}.id, ${tableName}.email, ${tableName}.password FROM ${tableName}
            WHERE ${tableName}.email = ?`,
      [email]
    );
    let list = [];
    for (let row of rows) {
      let user = new User(row.id, row.email, row.password);
      list.push(user);
    }

    if (list.length == 0) {
      return;
    }
    return list;
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
  }
}

async function findUserID(email) {
  let user = await findByEmail(email);

  if (user) {
    
    return user[0].id;
  } else {
    return -1;
  }
}

async function insertOne(user) {
  try {
    const exists = await findByEmail(user.email);

    if (exists.length == 0) {
      const [rows, fieldDefs] = await db.pool.query(
        `
            INSERT INTO ${tableName} (email, password) VALUES (?,?)
            `,
        [user.email, user.password]
      );
    } else {
      return "entry already exists.";
    }
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
  }
}

async function all() {
  try {
    const [rows, fieldDefs] = await db.pool.query(`
            SELECT ${tableName}.id, ${tableName}.email, ${tableName}.password FROM ${tableName}
        `);
    var list = [];
    for (let row of rows) {
      let user = new User(row.email, row.password);
      list.push(user);
    }
    return list;
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
  }
}

async function login(email, password) {
  try {
    const users = await findByEmail(email);
    if (users.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = users[0];
    /* check password entered by user with encrypted password */
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, message: "Incorrect password" };
    } else {
      return { success: true, message: "Login successful", user };
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function removeUser(email) {
  try {
    const users = await findByEmail(email);
    if (users.length === 0) {
      return -1;
    } else {
      let userID = await findUserID(email);
      if (!userID) {
        
        return -1;
      }
      //remove all bookings
      await bookingTable.removeBooking(userID);

      //now, remove user
      await db.pool.query(`DELETE FROM ${tableName} WHERE email  = ?`, [email]);
      return 0;
    }
  } catch (error) {
    
  }
}

module.exports = {
  User,
  sync,
  insertOne,
  all,
  login,
  tableName,
  findByEmail,
  findUserID,
  removeUser,
};
