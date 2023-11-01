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
    const clients = await cliente.find({nro_cliente: id});
    if(clients.length == 0){
        res.status(404).json({error: "Client not found"})
    }else{
        const result = await cliente.deleteOne({nro_cliente: id})
        res.status(200).json({ message: "Client deleted" })
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
    const products = await producto.find()
    res.status(200).json(products)
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    try{
        const products = await producto.find({codigo: id})
        if(products.length != 0){
            res.status(200).json(products[0])
        }else{
            res.status(404).json({error: "Product not found"})
        }
      }catch(error){
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve products" });
      }
});

app.post("/products", async (req, res) => {
  try{
    const { marca,nombre,descripcion,precio,stock} = req.body;
    
    const pipeline = [
    {
      $sort: { codigo: -1 }
    },
    {
      $limit: 1
    },
    {
      $project: {
        _id: 0,
        codigo: { $add: ["$codigo", 1] }
      }
    }
    ];
  
    const [nextNro] = await producto.aggregate(pipeline);
  
    producto.insertMany({
        codigo: nextNro.codigo,
        marca: marca,
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        stock: stock
    })
    res.status(200).json(await producto.find({codigo: nextNro.codigo}));
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to save product" });
  }
});

app.put("/products/:id", async (req, res) => {
  try{
    const { id } = req.params;
    const { marca,nombre,descripcion,precio,stock} = req.body;
    
    const products = await producto.find({codigo: id});

    if(products.length != 0){
        await producto.updateOne({codigo: id}, {
            $set:{
                codigo: id,
                marca: marca, 
                nombre: nombre,
                descripcion: descripcion, 
                precio: precio,
                stock: stock
            }
        }, {upsert: false});
        res.status(200).json(await producto.find({codigo: id}))
    }else{
        res.status(404).json({ error: "Product not found" }); // 404 Not Found
    }

  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to modify product" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try{
    const { id } = req.params;
    
    const products = await producto.find({codigo: id});
    
    if(products.length != 0){
        await producto.deleteOne({codigo: id});
        res.status(200).json({message: "Product deleted"})
    }else{
        res.status(404).json({ error: "Product not found" }); // 404 Not Found
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
