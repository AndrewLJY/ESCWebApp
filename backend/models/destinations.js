const db = require('./db.js');
const jsonData = require('../hotelresources/destinations.json');
const tableName = "destinations";


async function sync(){
    try{
        db.pool.query(
        `CREATE TABLE IF NOT EXISTS ${tableName}(
            destination_name VARCHAR(255),
            uid VARCHAR(64),
            lat DECIMAL(8,6),
            lng DECIMAL(9,6),
            type VARCHAR(255)
        )`
    )
    } catch(error){
        console.error("database connection failed," + error);
        throw error;
    }
}

async function insertFromJSON(){
    for(let i = 0; i < jsonData.length; i++){
        try{
            db.pool.query(`
            INSERT INTO ${tableName} (destination_name, uid, lat, lng, type) VALUES (?,?,?,?,?) `,[jsonData[i].term, jsonData[i].uid, jsonData[i].lat, jsonData[i].lng, jsonData[i].type]);
        } catch(error){
            console.error("Database connection failed" + error);
            throw error;
        }
    }
    console.log("Done");
}

module.exports ={sync, insertFromJSON};