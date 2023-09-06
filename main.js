const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Set up database connection
const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "postgres",
  password: "admin",
  port: 5432,
});

// Create
app.post("/users", async (req, res) => {
  const { username, email } = req.body;
  const result = await pool.query(
    "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
    [username, email]
  );
  res.json(result.rows[0]);
});

// Read
app.get("/users", async (_, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

// Update
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  const result = await pool.query(
    "UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *",
    [username, email, id]
  );
  res.json(result.rows[0]);
});

// Delete
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  res.json({ message: "User deleted" });
});

app.listen(port, () => {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  console.log(`Server is running on http://localhost:${port}`);
});
