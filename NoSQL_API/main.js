const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

// Connect to your MongoDB database
mongoose.connect('mongodb://admin:admin@localhost:27017/TPO?authSource=admin', {});

// Create a Mongoose model for your "clients" collection
const cliente = mongoose.model('client', new mongoose.Schema ({
    activo: Number,
    apellido: String,
    direccion: String,
    nombre: String,
    nro_cliente: Number
    // Add other fields as needed
    },
    {
        collection: 'cliente'
    }
));

const producto = mongoose.model('producto', new mongoose.Schema ({
    codigo: Number,
    descripcion: String,
    marca: String,
    nombre: String,
    precio: Number,
    stock: Number
    // Add other fields as needed
  },
  {
    collection: 'producto'
  }
));

// Middleware to parse JSON in incoming requests
app.use(express.json());

app.get('/collections', async (req, res) => {
    try {
      // Use the mongoose.connection to access the database
      const db = mongoose.connection;
  
      // Get the collection names
      const collections = await db.db.listCollections().toArray();
  
      // Extract the collection names from the results
      const collectionNames = collections.map((collection) => collection.name);
  
      res.json(collectionNames);
      console.log("Client req OK");
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });


//---------------------------------------------------
//  CLIENTES
//---------------------------------------------------

// Create
app.post("/clients", async (req, res) => {
  const { nombre,apellido,direccion,activo} = req.body;
  try{

    // Use the aggregation framework to calculate the next nro_cliente
const nextNroClientePipeline = [
    {
      $sort: { nro_cliente: -1 }
    },
    {
      $limit: 1
    },
    {
      $project: {
        _id: 0,
        nro_cliente: { $add: ["$nro_cliente", 1] }
      }
    }
  ];
  
  const [nextNroCliente] = await cliente.aggregate(nextNroClientePipeline);
    cliente.insertMany({
        nro_cliente: nextNroCliente.nro_cliente,
        nombre: nombre,
        apellido: apellido,
        direccion: direccion,
        activo: activo
    })
    res.status(200).json(await cliente.find({nro_cliente: nextNroCliente.nro_cliente}));
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to create client" });
  }
});

// Define a route to get a list of clients
app.get('/clients', async (req, res) => {
    try {
      const my_clients = await cliente.find();
      res.status(200).json(my_clients);
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });

// Read
app.get("/clients/:id", async (req, res) => {
  const id = req.params.id;
  try{
    const my_clients = await cliente.find({nro_cliente: id});
    if(my_clients.length != 0){
        res.json(my_clients[0]);
    }else{
        res.status(404).json({ error: "User not found" });
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
    const clients = await cliente.find({nro_cliente: id});
    if(clients.length == 0){
        res.status(404).json({error: "User not found"})
    }else{
        const result = await cliente.updateOne({nro_cliente: id}, {$set: {
            nombre: nombre,
            apellido: apellido,
            direccion: direccion,
            activo: activo
        }}, {upsert: false})
        
        res.status(200).json(await cliente.find({nro_cliente: id}))
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


// //---------------------------------------------------
// //  PRODUCTOS
// //---------------------------------------------------

// app.get("/products", async (req, res) => {
//   try{
//     const result = await pool.query("SELECT * FROM e01_producto");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve products" });
//   }
// });

// app.get("/products/:id", async (req, res) => {
//   try{
//     const { id } = req.params;
//     const result = await pool.query("SELECT * FROM e01_producto WHERE codigo_producto = $1", [id]);
//     if (result.rowCount === 0) {
//       res.status(404).json({ error: "Product not found" }); // 404 Not Found
//     } else {
//       res.status(200).json(result.rows);
//     }
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });

// app.post("/products", async (req, res) => {
//   try{
//     const { marca,nombre,descripcion,precio,stock} = req.body;
//     const result = await pool.query(
//       "INSERT INTO e01_producto (marca,nombre,descripcion,precio,stock) values ($1, $2,$3,$4,$5) RETURNING *",
//       [marca,nombre,descripcion,precio,stock]
//     );
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to save product" });
//   }
// });

// app.put("/products/:id", async (req, res) => {
//   try{
//     const { id } = req.params;
//     const { marca,nombre,descripcion,precio,stock} = req.body;
//     const result = await pool.query(
//       "UPDATE e01_producto SET marca = $1, nombre = $2, descripcion = $3, precio = $4,stock = $5 WHERE codigo_producto = $6 RETURNING *",
//       [marca, nombre,descripcion,precio,stock, id]
//     );
//     if (result.rowCount === 0) {
//       res.status(404).json({ error: "Product not found" }); // 404 Not Found
//     } else {
//       res.status(200).json(result.rows);
//     }
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to modify product" });
//   }
// });

// app.delete("/products/:id", async (req, res) => {
//   try{
//     const { id } = req.params;
//     await pool.query("DELETE FROM e01_producto WHERE codigo_producto = $1", [id]);
//     if (result.rowCount === 0) {
//       res.status(404).json({ error: "Product not found" }); // 404 Not Found
//     } else {
//       res.json({ message: "Product deleted" });
//     }
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to delete product" });
//   }
// });


// //---------------------------------------------------
// //  Queries
// //---------------------------------------------------

// app.get("/queries/1", async (req, res) => {
//   try{
//     const result = await pool.query("SELECT E01_CLIENTE.nro_cliente, codigo_area, nro_telefono FROM E01_CLIENTE JOIN E01_TELEFONO ON E01_CLIENTE.nro_cliente = E01_TELEFONO.nro_cliente WHERE E01_CLIENTE.nombre = 'Wanda' AND E01_CLIENTE.apellido = 'Baker';");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });


// app.get("/queries/2", async (req, res) => {
//   try{
//     const result = await pool.query("SELECT DISTINCT E01_CLIENTE.nro_cliente, E01_CLIENTE.nombre, E01_CLIENTE.apellido FROM E01_CLIENTE JOIN E01_FACTURA ON E01_CLIENTE.nro_cliente = E01_FACTURA.nro_cliente;");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });


// app.get("/queries/3", async (req, res) => {
//   try{
//     const result = await pool.query("SELECT E01_CLIENTE.nro_cliente, E01_CLIENTE.nombre, E01_CLIENTE.apellido FROM E01_CLIENTE LEFT JOIN E01_FACTURA ON E01_CLIENTE.nro_cliente = E01_FACTURA.nro_cliente WHERE E01_FACTURA.nro_factura IS NULL;");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });


// app.get("/queries/4", async (req, res) => {
//   try{
//     const result = await pool.query("SELECT DISTINCT E01_PRODUCTO.codigo_producto, E01_PRODUCTO.marca, E01_PRODUCTO.nombre FROM E01_PRODUCTO JOIN E01_DETALLE_FACTURA ON E01_PRODUCTO.codigo_producto = E01_DETALLE_FACTURA.codigo_producto;");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });


// app.get("/queries/5", async (req, res) => {
//   try{
//     const result = await pool.query("select nro_cliente as \"Numero de cliente\", concat(apellido, ',', nombre) as \"Appelido, Nombre\", tipo as \"Sexo\", direccion as \"Direccion\", activo as \"Activo\", concat('(',codigo_area,') ', nro_telefono) as \"Numero de telefono\" from e01_cliente natural join e01_telefono;");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });


// app.get("/queries/6", async (req, res) => {
//   try{
//     const result = await pool.query("select c.nro_cliente as \"Numero de cliente\", concat(apellido, ',', nombre) as \"Appelido, Nombre\", cant_fact as \"Cantidad de facturas\" from e01_cliente as c join (select nro_cliente, count(*) as cant_fact from e01_factura group by nro_cliente) as f on f.nro_cliente = c.nro_cliente;");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });


// app.get("/queries/7", async (req, res) => {
//   try{
//     const result = await pool.query("select c.nro_cliente as \"Numero de cliente\", concat(apellido, ',', nombre) as \"Appelido, Nombre\", nro_factura as \"Numero de factura\", fecha as \"Fecha\", total_sin_iva as \"Monto (sin iva)\", iva as \"IVA\", total_con_iva as \"Monto (con iva)\" from e01_factura f natural join (select nombre, apellido, nro_cliente from e01_cliente where lower(apellido) = lower('Tate') and lower(nombre) = lower('Pandora')) c;");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });


// app.get("/queries/8", async (req, res) => {
//   try{
//     const result = await pool.query("select distinct(nro_factura) from e01_detalle_factura natural join e01_producto where marca = 'In Faucibus Inc.'");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });


// app.get("/queries/9", async (req, res) => {
//   try{
//     const result = await pool.query("select nro_telefono,nombre,apellido, direccion,activo from e01_cliente natural join e01_telefono");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });


// app.get("/queries/10", async (req, res) => {
//   try{
//     const result = await pool.query("select nombre,apellido,sum(total_con_iva) from e01_cliente natural join e01_factura group by nombre, apellido");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });


// //---------------------------------------------------
// //  Views
// //---------------------------------------------------

// app.post("/view/1", async (req, res) => {
//   try{
//     const result = await pool.query("create view E01_FACTURA_ORDENADAS_POR_FECHA as select * from e01_factura order by fecha;");
//     res.status(200).json({result: "View created successfully"});
//   }catch(error){
//     if (error.message.includes("already exists")) {
//       res.status(400).json({ error: "View already exists" });
//     }
//     else{
//       console.error(error);
//       res.status(500).json({ error: "Failed to retrieve product" });
//     }
//   }
// });

// app.post("/view/2", async (req, res) => {
//   try{
//     const result = await pool.query("create view PRODUCTOS_NO_FACTURADOS as select * from e01_producto where codigo_producto not in(select p.codigo_producto from e01_producto p join e01_detalle_factura df on p.codigo_producto = df.codigo_producto);");
//     res.status(200).json({result: "View created successfully"});
//   }catch(error){
//     if (error.message.includes("already exists")) {
//       res.status(400).json({ error: "View already exists" });
//     }
//     else{
//       console.error(error);
//       res.status(500).json({ error: "Failed to retrieve product" });
//     }
//   }
// });

// app.get("/view/1", async (req, res) => {
//   try{
//     const result = await pool.query("select * from E01_FACTURA_ORDENADAS_POR_FECHA;");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });

// app.get("/view/2", async (req, res) => {
//   try{
//     const result = await pool.query("select * from PRODUCTOS_NO_FACTURADOS;");
//     res.status(200).json(result.rows);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({ error: "Failed to retrieve product" });
//   }
// });





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
