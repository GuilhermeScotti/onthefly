import pool from "../config/database.js";

// Insert a new trip-user association
const createTripUser = async (req, res) => {
  try {
    const { trip_id, user_id } = req.body;

    const results = await pool.query(
      `INSERT INTO trips_users (trip_id, user_id)
        VALUES ($1, $2) 
        RETURNING *`,
      [trip_id, user_id],
    );

    res.status(201).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Retrieve all trip-user associations
const getTripUsers = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM trips_users ORDER BY trip_id ASC, user_id ASC",
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Retrieve all users associated with a specific trip
const getUsersForTrip = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id);
    const results = await pool.query(
      `SELECT u.* FROM users u
      JOIN trips_users tu ON u.id = tu.user_id
      WHERE tu.trip_id = $1`,
      [trip_id],
    );

    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Delete a trip-user association
const deleteTripUser = async (req, res) => {
  const { trip_id, user_id } = req.params;

  try {
    const results = await pool.query(
      `DELETE FROM trips_users
      WHERE trip_id = $1 AND user_id = $2
      RETURNING *`,
      [trip_id, user_id],
    );

    if (results.rows.length > 0) {
      res
        .status(200)
        .json({ message: "Trip-user association deleted successfully" });
    } else {
      res.status(404).json({ message: "Trip-user association not found" });
    }
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  createTripUser,
  getTripUsers,
  getUsersForTrip,
  deleteTripUser,
};
