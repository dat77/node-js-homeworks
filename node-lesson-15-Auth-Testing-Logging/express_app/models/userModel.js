const pool = require("../db");

exports.create = async ({ username, password }) => {
  await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
    username,
    password,
  ]);
};

exports.exists = async (username) => {
  const result = await pool.query("SELECT 1 FROM users WHERE username = $1", [
    username,
  ]);
  return result.rowCount > 0;
};

exports.findByUsername = async (username) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};
