import pool from "./database.js";
import "./dotenv.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const currentPath = fileURLToPath(import.meta.url);

console.log(dirname(currentPath));

const tripsFile = fs.readFileSync(
  path.join(dirname(currentPath), "../config/data/data.json"),
);

const tripsData = JSON.parse(tripsFile);

async function createTripsTable() {
  const createTripsTableQuery = `
    CREATE TABLE IF NOT EXISTS trips (
      id serial PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description VARCHAR(500) NOT NULL,
      img_url TEXT NOT NULL,
      num_days INTEGER NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      TOTAL_COST MONEY NOT NULL
    );

    DELETE FROM trips;
  `;

  try {
    const res = await pool.query(createTripsTableQuery);
    console.log("trips table created successfully!");
  } catch (error) {
    console.error("trips table creation had an error!", error);
  }
}

async function seedTripsTable() {
  await createTripsTable();

  tripsData.forEach((trip) => {
    const insertQuery = {
      text: "INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    };

    const values = [
      trip.title,
      trip.description,
      trip.img_url,
      trip.num_days,
      trip.start_date,
      trip.end_date,
      trip.total_cost,
    ];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.log("error inserting trip", err);
        return;
      }
      console.log(`trip: ${trip.title} inserted successfully`);
    });
  });
}

async function createDestinationsTable() {
  const createDestinationsTableQuery = `
    CREATE TABLE IF NOT EXISTS destinations (
      id serial PRIMARY KEY NOT NULL,
      destination VARCHAR(100) NOT NULL,
      description VARCHAR(500) NOT NULL,
      city VARCHAR(100) NOT NULL,
      country VARCHAR(100) NOT NULL,
      img_url TEXT NOT NULL,
      flag_img_url TEXT NOT NULL  
    );
  `;

  try {
    const rest = await pool.query(createDestinationsTableQuery);
    console.log("destination table created!");
  } catch (error) {
    console.error("error creating destinations table", error);
  }
}

async function createActivitiesTable() {
  const createActivitiesTableQuery = `
    CREATE TABLE IF NOT EXISTS activities (
      id serial PRIMARY KEY NOT NULL,
      trip_id INTEGER NOT NULL,
      activity VARCHAR(100) NOT NULL,
      num_votes INTEGER DEFAULT 0,
      FOREIGN KEY(trip_id) REFERENCES trips(id)
    );
  `;

  try {
    await pool.query(createActivitiesTableQuery);
    console.log("activities table created");
  } catch (error) {
    console.error("error creating activities table", error);
  }
}

async function createTripsDestinationsTable() {
  const tripDestCreateQuery = `
    CREATE TABLE IF NOT EXISTS trips_destinations (
      trip_id INT NOT NULL,
      destination_id INT NOT NULL,
      PRIMARY KEY (trip_id, destination_id),
      FOREIGN KEY(trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
      FOREIGN KEY(destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
    );
  `;

  try {
    await pool.query(tripDestCreateQuery);
    console.log("trips_destinations table created");
  } catch (error) {
    console.error("error creating trips_destinations table", error);
  }
}

// async function createUsersTable() {
//   const createUsersTableQuery = `
//     CREATE TABLE IF NOT EXISTS users (
//       id serial PRIMARY KEY,
//       githubid INTEGER NOT NULL,
//       username VARCHAR(100) NOT NULL,
//       avatarurl VARCHAR(500) NOT NULL,
//       accesstoken VARCHAR(500) NOT NULL
//     );
//   `;

//   try {
//     await pool.query(createUsersTableQuery);
//     console.log("users table created");
//   } catch (error) {
//     console.error("error creating users table", error);
//   }
// }

async function createTripUsersTable() {
  const tripUsersCreateQuery = `
    CREATE TABLE IF NOT EXISTS trips_users (
      trip_id INT NOT NULL,
      user_id INT NOT NULL,
      PRIMARY KEY (trip_id, user_id),
      FOREIGN KEY(trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE
    );
  `;

  try {
    await pool.query(tripUsersCreateQuery);
    console.log("trip_users table created");
  } catch (error) {
    console.error("error creating trip_users table", error);
  }
}

async function serializeCreateTables() {
  //Stop seeding to test
  // await seedTripsTable();
  await createDestinationsTable();
  await createActivitiesTable();
  await createTripsDestinationsTable();
  // await createUsersTable();
  await createTripUsersTable();
}

serializeCreateTables();
