const db = require('./db.js');
const bookingModel = require('./booking.js');
const tableName = 'user';

class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    static newUser(email, password) {
        // in JS, only one constructor is allowed
        // we need a factory method
        return new  User(email, password);
    }
}


async function sync() {
    try { // for simplicity, we assume staff names are uniqe (in the absence of NRIC or personal email)
        db.pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255) UNIQUE
        )
        `);
    } catch (error) {
        console.error("database connection failed. " + error);
        throw error;
    }
}


async function findByEmail(email) {
    try {
        const [rows, fieldDefs] = await db.pool.query(`
            SELECT ${tableName}.id, ${tableName}.email, ${tableName}.password FROM ${tableName}
            WHERE ${tableName}.email = ?`, [email]
        );
        var list = [];
        for (let row of rows) {
            let user = new User(row.id, row.email, row.password);
            list.push(user);
        }
        return list;
    } catch (error) {
        console.error("database connection failed. " + error);
        throw error;
    }
}

async function insertOne(user) {
    try {
        const exists = await findByEmail(User.email);
        if (exists.length == 0) {
            const [rows, fieldDefs] = await db.pool.query(`
            INSERT INTO ${tableName} (email, password) VALUES (?,?)
            `, [user.email, user.password]);
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



module.exports= {User, sync, insertOne, all};