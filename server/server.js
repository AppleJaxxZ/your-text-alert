const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config()
const port = process.env.PORT || 8880;



const { jwtStrategy } = require('./config/passport');
const passport = require('passport');


const routes = require('./routes/index');
if (process.env.NODE_ENV !== "production") require('dotenv').config();


// db

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB Error => ', err));

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.options("*", cors({ origin: true }));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);


app.use(routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}



app.listen(port, () => console.log(`Server is running on port ${port}`));