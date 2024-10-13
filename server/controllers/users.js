import pool from "../config/database.js";

// Insert a new user
const createUser = async (req, res) => {
  try {
    const { githubid, username, avatarurl, accesstoken } = req.body;

    const results = await pool.query(
      `INSERT INTO users (githubid, username, avatarurl, accesstoken)
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
      [githubid, username, avatarurl, accesstoken],
    );

    res.status(201).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Retrieve all users
const getUsers = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Retrieve a specific user by ID
const getUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const results = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (results.rows.length > 0) {
      res.status(200).json(results.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Update user information
const updateUser = async (req, res) => {
  try {
    const { githubid, username, avatarurl, accesstoken } = req.body;
    const id = parseInt(req.params.id);

    const results = await pool.query(
      `UPDATE users
      SET githubid = $1, username = $2, avatarurl = $3, accesstoken = $4
      WHERE id = $5 RETURNING *`,
      [githubid, username, avatarurl, accesstoken, id],
    );

    if (results.rows.length > 0) {
      res.status(200).json(results.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const results = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );

    if (results.rows.length > 0) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
