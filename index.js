// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Routes
const userRouter = require('./routes/userRoute');
const aboutUsWebSiteTemplate1Router = require('./routes/aboutUsWebSiteTemplate1Route');
// Middleware
const logger = require('./middleware/logger');
const authenticateToken = require('./middleware/auth');

//* ------------------------- ----------------------- ------------------------ */
const app = express();
const PORT = 3000;
//TODO: Move to .env
const JWT_SECRET = 'your-secret-key'; // Store in environment variable in production

//* ------------------------- ----------------------- ------------------------ */
// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/cms';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

//* ------------------------- ----------------------- ------------------------ */
// Middleware

app.use(express.json());
app.use(logger);
app.use(bodyParser.json());
app.use(morgan('dev')); // Logs request details (method, URL, status, etc.)
//* ------------------------- ----------------------- --------------------------------------------------------------------------------
// Routes
app.get('/', (req, res) => res.send('Hello, Express!'));
app.use('/users', userRouter);
app.use('/aboutUsWebSiteTemplate1', aboutUsWebSiteTemplate1Router);



//* ------------------------- ----------------------- ------------------------ */
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ error: 'Something went wrong!' });
});

 

//* ------------------------- ----------------------- ------------------------ */
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
