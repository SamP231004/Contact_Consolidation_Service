const express = require('express');
const mongoose = require('mongoose');
const contactRoutes = require('./routes/contactRoutes');
const { handleError } = require('./utils/errorHandlers'); // Import error handler
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Check if MONGODB_URI is defined
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1); // Exit if the variable is not set
}

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    // Consider a more sophisticated way to handle this in a real application,
    // such as logging to a file or using a process manager to restart.
    // For this example, we'll just exit.
    process.exit(1);
  });

app.use('/identify', contactRoutes);

// Error handling middleware (Added to app.js)
app.use((err, req, res, next) => {
  handleError(res, err, 'Internal Server Error'); // Use the unified error handler
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
