const { query } = require("../db");

exports.create = async ({ content, username }) => {
  const result = await query(
    "INSERT INTO tweets (content, username) VALUES ($1, $2) RETURNING *",
    [content, username],
  );
  return result.rows[0];
};

exports.getAll = async () => {
  const result = await pool.query("SELECT * FROM tweets");
  return result.rows;
};

exports.delete = async (id) => {
  await pool.query("DELETE FROM tweets WHERE id = $1", [id]);
};
