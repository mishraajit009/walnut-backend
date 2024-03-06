const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3001;
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { getConnection } = require('./db');
const apiRoutes = require('./routes/apiRoutes');
const userRoutes = require('./routes/userRoutes');
const { processPitchEmailWithGPTModel, parseToolCallReponseUsingFunctionName, generate_appointment_scheduling_structure } = require('./openaiFunction');

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
const io = require('socket.io')(server,{
  cors: {
    origin: '*',
  }
});

io.on('connection', socket => {
  console.log('User connected');

  socket.on('chat message', async message => {
    console.log("Message from users",message)

    const initialPrompt = "Get Time";
    const toolForGettingTime = generate_appointment_scheduling_structure()
    const appointmentResponse = await processPitchEmailWithGPTModel(
      initialPrompt,
      text,
      toolForGettingTime,
      0.5,
      0.5
    )
    io.emit('chat message', "I am sending users ->"+appointmentResponse);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// From HERE connection for APP.
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
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });