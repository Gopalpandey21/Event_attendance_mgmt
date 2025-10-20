const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // 1. Import the built-in 'path' module
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// --- API Routes ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/admin', require('./routes/adminApiRoutes'));


app.use('/api/certificate', require('./routes/certificateRoutes'));
// --- Serve Uploaded Files Statically ---
// 2. This line will now work correctly
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));