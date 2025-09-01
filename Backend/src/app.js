const cookieParser = require('cookie-parser');
const express = require('express')
const cors = require('cors')
const authRoute = require('./routes/auth.route')
const avatarRoute = require('./routes/avatar.route');

const app = express()

app.use(cors({
  origin: 'http://localhost:5173', // your frontend
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true, // if using cookies/sessions
}));

app.use(express.json()); // parse JSON body
app.use(cookieParser()); // for reading cookies

//routes
app.use('/api/auth', authRoute)
app.use('/api/avatar', avatarRoute);

module.exports = app