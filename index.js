//* Global path --------------------- ------------------------------ --------------------- */
const moduleAlias = require('module-alias');
const path = require('path');
moduleAlias.addAliases({
  '@models': path.join(__dirname, 'models'),
  '@controllers': path.join(__dirname, 'controllers'),
  '@middleware': path.join(__dirname, 'middleware'),
  '@routes': path.join(__dirname, 'routes'),
  '@helpers': path.join(__dirname, 'helpers'),
  '@imageHandler': path.join(__dirname, 'helpers/imageHandler'),
});

//* Dependencies -----------------------------------------------------------------
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

// Routes
const userRouter = require('./routes/userRoute');
const meetTheTeamRouter = require('./routes/meetTheTeamRoute');
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
app.use(fileUpload());
app.use(express.json());
app.use(logger);
app.use(bodyParser.json());
app.use(morgan('dev')); // Logs request details (method, URL, status, etc.)
//* ------------------------- ----------------------- --------------------------------------------------------------------------------
// Routes
app.get('/', (req, res) => {
  console.log(__dirname);
  res.send('Hello, Express!: ' + __dirname);
});
app.use('/users', userRouter);
app.use('/meetTheTeam', meetTheTeamRouter);



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
