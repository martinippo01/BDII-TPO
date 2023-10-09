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
    console.error(error);
    res.status(500).json({ error: "Failed to create client" });
  }
});

// Read
app.get("/clients", async (req, res) => {
  try{
    const result = await pool.query("SELECT * FROM e01_cliente");
    res.status(200).json(result.rows);
  }catch(error){
    console.error(error);
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
    console.error(error);
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
  try{
    const result = await pool.query("SELECT * FROM e01_producto");
    res.status(200).json(result.rows);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

app.get("/products/:id", async (req, res) => {
  try{
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM e01_producto WHERE codigo_producto = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Product not found" }); // 404 Not Found
    } else {
      res.status(200).json(result.rows[0]);
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});

app.post("/products", async (req, res) => {
  try{
    const { marca,nombre,descripcion,precio,stock} = req.body;
    const result = await pool.query(
      "INSERT INTO e01_producto (marca,nombre,descripcion,precio,stock) values ($1, $2,$3,$4,$5) RETURNING *",
      [marca,nombre,descripcion,precio,stock]
    );
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to save product" });
  }
});

app.put("/products/:id", async (req, res) => {
  try{
    const { id } = req.params;
    const { marca,nombre,descripcion,precio,stock} = req.body;
    const result = await pool.query(
      "UPDATE e01_producto SET marca = $1, nombre = $2, descripcion = $3, precio = $4,stock = $5 WHERE codigo_producto = $6 RETURNING *",
      [marca, nombre,descripcion,precio,stock, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Product not found" }); // 404 Not Found
    } else {
      res.status(200).json(result.rows[0]);
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to modify product" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try{
    const { id } = req.params;
    await pool.query("DELETE FROM e01_producto WHERE codigo_producto = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Product not found" }); // 404 Not Found
    } else {
      res.json({ message: "Product deleted" });
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});


//---------------------------------------------------
//  Queries
//---------------------------------------------------

app.get("/queries/1", async (req, res) => {
  try{
    const result = await pool.query("SELECT E01_CLIENTE.nro_cliente, codigo_area, nro_telefono FROM E01_CLIENTE JOIN E01_TELEFONO ON E01_CLIENTE.nro_cliente = E01_TELEFONO.nro_cliente WHERE E01_CLIENTE.nombre = 'Wanda' AND E01_CLIENTE.apellido = 'Baker';");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});


app.get("/queries/2", async (req, res) => {
  try{
    const result = await pool.query("SELECT DISTINCT E01_CLIENTE.nro_cliente, E01_CLIENTE.nombre, E01_CLIENTE.apellido FROM E01_CLIENTE JOIN E01_FACTURA ON E01_CLIENTE.nro_cliente = E01_FACTURA.nro_cliente;");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});


app.get("/queries/3", async (req, res) => {
  try{
    const result = await pool.query("SELECT E01_CLIENTE.nro_cliente, E01_CLIENTE.nombre, E01_CLIENTE.apellido FROM E01_CLIENTE LEFT JOIN E01_FACTURA ON E01_CLIENTE.nro_cliente = E01_FACTURA.nro_cliente WHERE E01_FACTURA.nro_factura IS NULL;");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});


app.get("/queries/4", async (req, res) => {
  try{
    const result = await pool.query("SELECT DISTINCT E01_PRODUCTO.codigo_producto, E01_PRODUCTO.marca, E01_PRODUCTO.nombre FROM E01_PRODUCTO JOIN E01_DETALLE_FACTURA ON E01_PRODUCTO.codigo_producto = E01_DETALLE_FACTURA.codigo_producto;");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});


app.get("/queries/5", async (req, res) => {
  try{
    const result = await pool.query("select nro_cliente as \"Numero de cliente\", concat(apellido, ',', nombre) as \"Appelido, Nombre\", tipo as \"Sexo\", direccion as \"Direccion\", activo as \"Activo\", concat('(',codigo_area,') ', nro_telefono) as \"Numero de telefono\" from e01_cliente natural join e01_telefono;");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});


app.get("/queries/6", async (req, res) => {
  try{
    const result = await pool.query("select c.nro_cliente as \"Numero de cliente\", concat(apellido, ',', nombre) as \"Appelido, Nombre\", cant_fact as \"Cantidad de facturas\" from e01_cliente as c join (select nro_cliente, count(*) as cant_fact from e01_factura group by nro_cliente) as f on f.nro_cliente = c.nro_cliente;");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});


app.get("/queries/7", async (req, res) => {
  try{
    const result = await pool.query("select c.nro_cliente as \"Numero de cliente\", concat(apellido, ',', nombre) as \"Appelido, Nombre\", nro_factura as \"Numero de factura\", fecha as \"Fecha\", total_sin_iva as \"Monto (sin iva)\", iva as \"IVA\", total_con_iva as \"Monto (con iva)\" from e01_factura f natural join (select nombre, apellido, nro_cliente from e01_cliente where lower(apellido) = lower('Tate') and lower(nombre) = lower('Pandora')) c;");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});


app.get("/queries/8", async (req, res) => {
  try{
    const result = await pool.query("select distinct(nro_factura) from e01_detalle_factura natural join e01_producto where marca = 'In Faucibus Inc.'");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});


app.get("/queries/9", async (req, res) => {
  try{
    const result = await pool.query("select nro_telefono,nombre,apellido, direccion,activo from e01_cliente natural join e01_telefono");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});


app.get("/queries/10", async (req, res) => {
  try{
    const result = await pool.query("select nombre,apellido,sum(total_con_iva) from e01_cliente natural join e01_factura group by nombre, apellido");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});


//---------------------------------------------------
//  Views
//---------------------------------------------------

app.post("/view/1", async (req, res) => {
  try{
    const result = await pool.query("create view E01_FACTURA_ORDENADAS_POR_FECHA as select * from e01_factura order by fecha;");
    res.status(200).json({result: "View created successfully"});
  }catch(error){
    if (error.message.includes("already exists")) {
      res.status(400).json({ error: "View already exists" });
    }
    else{
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve product" });
    }
  }
});

app.post("/view/2", async (req, res) => {
  try{
    const result = await pool.query("create view PRODUCTOS_NO_FACTURADOS as select * from e01_producto where codigo_producto not in(select p.codigo_producto from e01_producto p join e01_detalle_factura df on p.codigo_producto = df.codigo_producto);");
    res.status(200).json({result: "View created successfully"});
  }catch(error){
    if (error.message.includes("already exists")) {
      res.status(400).json({ error: "View already exists" });
    }
    else{
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve product" });
    }
  }
});

app.get("/view/1", async (req, res) => {
  try{
    const result = await pool.query("select * from E01_FACTURA_ORDENADAS_POR_FECHA;");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});

app.get("/view/2", async (req, res) => {
  try{
    const result = await pool.query("select * from PRODUCTOS_NO_FACTURADOS;");
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
});


//---------------------------------------------------
//  UP
//---------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
