const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Mongoose model for your "clients" collection
const Client = mongoose.model('Client', {
  name: String,
  email: String,
  // Add other fields as needed
});

// Middleware to parse JSON in incoming requests
app.use(express.json());

// Define a route to get a list of clients
app.get('/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
