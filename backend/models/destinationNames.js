const db = require('./db.js');
const jsonData = require('../hotelresources/destinations.json');
const tableName = "destinations";


async function sync(){
    try{
        db.pool.query(
        `CREATE TABLE IF NOT EXISTS ${tableName}(
            destination_name VARCHAR(255)
        )`
    )
    } catch(error){
        console.error("database connection failed," + error);
        throw error;
    }
}

async function insertFromJSON(){
    for(let i = 0; i < jsonData.length; i++){
        destinationName = jsonData[i].term;
        try{
            db.pool.query(`
                BEGIN
                    IF NOT EXISTS (SELECT* FROM ${tableName})
                    BEGIN
                        INSERT INTO ${tableName} (destination_name) 
                        VALUES (?) `,
                        [destinationName]);
        } catch(error){
            console.error("Database connection failed" + error);
            throw error;
        }
    }
    console.log("Done");
}


module.exports ={sync, insertFromJSON};