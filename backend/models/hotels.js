const db = require("./db.js");
const jsonData = require("../hotelresources/destinations.json");
const { json } = require("express");
const tableName = "hotels";

async function sync() {
  try {
    db.pool.query(
      `CREATE TABLE IF NOT EXISTS ${tableName}(
            id INTEGER AUTO_INCREMENT PRIMARY KEY,
            hotel_name VARCHAR(255)
        )`
    );
  } catch (error) {
    console.error("database connection failed," + error);
    throw error;
  }
}

goneThru = [];

async function insertFromJSON() {
  for (let i = 0; i < jsonData.length; i++) {
    if (goneThru.includes(jsonData[i].uid)) {
      continue;
    }

    if (jsonData[i].uid === null || jsonData[i].uid === undefined) {
      continue;
    }

    goneThru.push(jsonData[i].uid);
    console.log(goneThru);

    try {
      const response = await fetch(
        `https://hotelapi.loyalty.dev/api/hotels?destination_id=${jsonData[i].uid}`,
        { method: "GET" }
      );

      const hotels = await response.json(); // Parse the JSON response

      if (!hotels || !hotels.length) {
        console.log(`No hotels found for destination ${jsonData[i].uid}`);
        continue;
      }

      for (let j = 0; j < hotels.length; j++) {
        try {
          await db.pool.query(
            `INSERT INTO ${tableName} (hotel_name) VALUES (?)`,
            [hotels[j].name]
          );
        } catch (error) {
          console.error("Database query failed: " + error);
          throw error;
        }
      }
    } catch (error) {
      console.error(
        "Error processing destination " + jsonData[i].uid + ": " + error
      );
      // Continue with next item instead of throwing if you want to proceed
      // throw error; // Uncomment if you want to stop on errors
    }
  }
  console.log("Done");
}

module.exports = { sync, insertFromJSON };
