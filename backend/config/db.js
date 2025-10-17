const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the URI from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit the process with a failure code if the connection fails
    process.exit(1);
  }
};

module.exports = connectDB;