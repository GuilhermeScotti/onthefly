import GitHubStrategy from "passport-github2";
import pool from "./database.js";

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/github/callback",
};

const verify = async (accessToken, refreshToken, profile, callback) => {
  const {
    _json: { id, login, avatar_url },
  } = profile;

  const userData = {
    githubid: id,
    username: login,
    avatarurl: avatar_url,
    accessToken,
  };

  try {
    const results = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [userData.username],
    );
    const user = results.rows[0];

    if (!user) {
      const results = await pool.query(
        `INSERT INTO users (githubid, username, avatarurl, accesstoken)
        VALUES($1, $2, $3, $4)
        RETURNING *`,
        [
          userData.githubid,
          userData.username,
          userData.avatarurl,
          userData.accessToken,
        ],
      );

      const newUser = results.rows[0];

      return callback(null, newUser);
    }

    return callback(null, user);
  } catch (error) {
    return callback(error);
  }
};

export const GitHub = new GitHubStrategy(options, verify);
