import pool from "../config/database.js";

// Insert a new activity
const createActivity = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id);
    const { activity } = req.body;

    const results = await pool.query(
      `INSERT INTO activities (trip_id, activity)
        VALUES ($1, $2) 
        RETURNING *`,
      [trip_id, activity],
    );

    res.status(201).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Retrieve all activities
const getActivities = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM activities ORDER BY id ASC",
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Retrieve all activities associated with a specific trip
const getTripActivities = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id);
    const results = await pool.query(
      "SELECT * FROM activities WHERE trip_id = $1",
      [trip_id],
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Update the number of likes for a specific activity
const updateActivityLikes = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { num_votes } = req.body; // Expecting likes to be sent in the request body

    const results = await pool.query(
      `UPDATE activities
      SET num_votes = COALESCE(num_votes, 0) + $1
      WHERE id = $2 RETURNING *`,
      [num_votes, id],
    );

    if (results.rows.length > 0) {
      res.status(200).json(results.rows[0]);
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Delete a single activity
const deleteActivity = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const results = await pool.query(
      "DELETE FROM activities WHERE id = $1 RETURNING *",
      [id],
    );

    if (results.rows.length > 0) {
      res.status(200).json({ message: "Activity deleted successfully" });
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  createActivity,
  getActivities,
  getTripActivities,
  updateActivityLikes,
  deleteActivity,
};
