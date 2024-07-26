const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

require("dotenv").config();

// Running The Server
const PORT = process.env.PORT || 8000;
// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

// Protect routes
const { authenticate } = require('./config/ProtectRoutes');

// mongoose Database
const connectToDB = require("./config/db");
// Connection To Database
connectToDB();
// auto refresh
require("./config/autoRefresh");



app.get('/protected', authenticate, (req, res) => {
  //console.log("req.client: " + req.client);
  return res.status(200).json({ message: 'Protected resource accessed', client: req.client, isAuthenticated:true });
});



app.get('/', (req, res) => {
  res.send('Hello World   !')
})


app.use("/auth", require("./routes/authRoute"));
app.use("/api", require("./routes/userRoute"));
app.use("/product", require("./routes/productRoute"));

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
