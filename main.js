const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const fs = require('fs');



const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static("public"));

app.use(bodyParser.json());

// Set up database connection
const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "postgres",
  password: "admin",
  port: 5433,
  // Additional options
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  max: 10, // Limit the maximum number of connections
});

// Function to create a users table
const createUsersTable = async () => {
  
  const schemaSql = fs.readFileSync('schema.sql', 'utf8');

  await pool.query(schemaSql, (err, res) => {
    if (err) {
      console.error("An error occurred while creating the table:", err);
    } else {
      console.log("Table created successfully!");
    }
  });
};

// Execute the table creation function
createUsersTable();

//---------------------------------------------------
//  CLIENTES
//---------------------------------------------------

// Create
app.post("/clients", async (req, res) => {
  const { nombre,apellido,direccion,activo} = req.body;
  try{
    const result = await pool.query(
      "INSERT INTO e01_cliente (nombre,apellido,direccion,activo) values ($1,$2,$3,$4) RETURNING *",
      [nombre,apellido,direccion,activo]
    );
    res.status(200).json(result.rows[0]);
  }catch(error){
    res.status(500).json({ error: "Failed to create client" });
  }
});

// Read
app.get("/clients", async (req, res) => {
  try{
    const result = await pool.query("SELECT * FROM e01_cliente");
    res.status(200).json(result.rows);
  }catch(error){
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// Read
app.get("/clients/:id", async (req, res) => {
  const id = req.params.id;
  try{
    const result = await pool.query("SELECT * FROM e01_cliente WHERE nro_cliente = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "User not found" }); // 404 Not Found
    } else {
      res.status(200).json(result.rows[0]);
    }
  }catch(error){
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// Update
app.put("/clients/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, direccion, activo } = req.body;
  try {
    const result = await pool.query(
      "UPDATE e01_cliente SET nombre = $1, apellido = $2, direccion = $4, activo = $5 WHERE nro_cliente = $3 RETURNING *",
//      [nombre, apellido, direccion, activo, id]
        [nombre, apellido, id, direccion, activo]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "User not found" }); // 404 Not Found
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" }); // 500 Internal Server Error
  }
});

// Delete
app.delete("/clients/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM e01_cliente WHERE nro_cliente = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "User not found" }); // 404 Not Found
    } else {
      res.json({ message: "User deleted" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" }); // 500 Internal Server Error
  }
});


//---------------------------------------------------
//  PRODUCTOS
//---------------------------------------------------

app.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM e01_producto");
  res.json(result.rows);
});

app.post("/products", async (req, res) => {
  const { marca,nombre,descripcion,precio,stock} = req.body;
  const result = await pool.query(
    "INSERT INTO e01_producto (marca,nombre,descripcion,precio,stock) values ($1, $2,$3,$4,$5) RETURNING *",
    [marca,nombre,descripcion,precio,stock]
  );
  res.json(result.rows[0]);
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { marca,nombre,descripcion,precio,stock} = req.body;
  const result = await pool.query(
    "UPDATE e01_producto SET marca = $1, nombre = $2, descripcion = $3, precio = $4,stock = $5 WHERE nro_producto = $6 RETURNING *",
    [marca, nombre,descripcion,precio,stock, id]
  );
  res.json(result.rows[0]);
});
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM e01_producto WHERE nro_producto = $1", [id]);
  res.json({ message: "Product deleted" });
});

//---------------------------------------------------
//  UP
//---------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
