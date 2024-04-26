const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/hotel";
// Connection to MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Making a component through which we interact with the database
const db = mongoose.connection;

// Define event listeners for database connections
db.on("connected", () => console.log("Connection is established"));
db.on("disconnected", () => console.log("Disconnection is established"));
db.on("error", (err) => console.error("Error is established", err));

// Export the database connection object
module.exports = db;
