// controllers/tripsDestinations.js

import pool from "../config/database.js"; // Import your database connection

const createTripDestination = async (req, res) => {
  try {
    const { trip_id, destination_id } = req.body; // Extract data from request body

    const results = await pool.query(
      `INSERT INTO trips_destinations (trip_id, destination_id)
       VALUES ($1, $2) RETURNING *`,
      [trip_id, destination_id],
    );

    res.status(201).json(results.rows[0]); // Return the created trip destination
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const destination_id = parseInt(req.params.destination_id); // Get destination_id from request parameters
    const results = await pool.query(
      `SELECT * FROM trips_destinations WHERE destination_id = $1`,
      [destination_id],
    );

    res.status(200).json(results.rows); // Return all trips for the specific destination
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getAllDestinations = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id); // Get trip_id from request parameters
    const results = await pool.query(
      `SELECT * FROM trips_destinations WHERE trip_id = $1`,
      [trip_id],
    );

    if (results.rows.length === 0) {
      return []; // Return an empty array if no destinations were found
    }

    const destinationIds = results.rows.map((row) => row.destination_id);

    const destinations = await pool.query(
      `SELECT * FROM destinations WHERE id = ANY($1::int[])`,
      [destinationIds],
    );

    return res.status(200).json(destinations.rows); // Return all destinations for the specific trip
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getTripsDestinations = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM trips_destinations"); // Retrieve all trip-destination associations
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  createTripDestination,
  getAllTrips,
  getAllDestinations,
  getTripsDestinations,
};
