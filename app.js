const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes/apiRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();
const bodyParser = require('body-parser');
const { getConnection } = require('./db');
app.set('trust proxy', 1);
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(bodyParser.json());
app.use('/api', limiter);

// Use routes defined in apiRoutes.js
app.use('/admin', apiRoutes);
app.use('/user',userRoutes)

const connection = getConnection();
// Error handling middleware for rate limiting
app.use((err, req, res, next) => {
  if (err) {
    console.log("error",err);
    res.json({err:err.message})
  } else {
    next(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
