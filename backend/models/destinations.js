const db = require('./db.js');
const jsonData = require('../hotelresources/destinations.json');
const tableName = "destinations";
var added = false;


async function sync(){
    try{
        db.pool.query(
        `CREATE TABLE IF NOT EXISTS ${tableName}(
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
            destination_name VARCHAR(255),
            uid VARCHAR(64),
            lat DECIMAL(8,6),
            lng DECIMAL(9,6)
        )`
    )
    } catch(error){
        console.error("database connection failed," + error);
        throw error;
    }
}

async function insertFromJSON(){
    if((await checkAdded()).length > 0){
        
        return;
    }
    for(let i = 0; i < jsonData.length; i++){
        try{
            db.pool.query(`
            INSERT INTO ${tableName} (destination_name, uid, lat, lng)
            SELECT ?, ?, ?, ?
            WHERE ? IS NOT NULL`,[
                    jsonData[i].term, jsonData[i].uid, jsonData[i].lat, jsonData[i].lng,
                    jsonData[i].term]);
        } catch(error){
            console.error("Database connection failed" + error);
            throw error;
        }
    }
    
}

async function findAllDestinations(){
    try{
        const [destinationRows, fieldDefs] = await db.pool.query(`
        SELECT ${tableName}.destination_name 
        FROM ${tableName}
        `
        );
        destinationNames = []
        for(let destinationRow of destinationRows){
            destinationNames.push(destinationRow.destination_name);
        }
        return destinationNames;
    } catch(error){
        console.error("database connection failed" + error);
        throw error;
    }
}

async function checkAdded(){
    try {
        const [rows, fieldDefs] = await db.pool.query(`
            SELECT ${tableName}.id, ${tableName}.destination_name, ${tableName}.uid,${tableName}.lat, ${tableName}.lng FROM ${tableName}
            WHERE ${tableName}.destination_name = ?`, ["Rome, Italy"]
        );
        let list = [];
        for (let row of rows) {
            list.push(row);
        }
        return list;
    } catch (error) {
        console.error("database connection failed. " + error);
        throw error;
    }
}

module.exports ={sync, insertFromJSON, findAllDestinations};