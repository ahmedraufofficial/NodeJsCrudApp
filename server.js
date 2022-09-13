require('dotenv').config({path: '.env'})
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const userRouter = require('./routes/users');
const User = require('./models/User');
const app = express();

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.MONGO_URI}/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.get('/', async (request, response) => {
  let users = await User.find().sort({ timeCreated: 'desc' });

  response.render('index', { users: users, title: "Home" });
});

app.use(express.static('public'));

app.use('/users', userRouter);

app.listen(5000, () => {
  console.log("app Running on localhost:5000")
});