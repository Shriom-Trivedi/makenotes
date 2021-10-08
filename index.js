const connectToMongo = require('./db');
const express = require('express');
const dotenv = require("dotenv");
dotenv.config();

connectToMongo();
const app = express()
const port = 5000
app.use(express.json())

// available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/note'))

app.listen(port, () => {
  console.log(`Makenotes is listening at http://localhost:${port}`)
})
