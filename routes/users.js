const express = require('express');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './public/uploads/images');
  },
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

router.get('/new', (request, response) => {
  response.render('new', { title: "Add User" });
});

router.get('/:slug', async (request, response) => {
  let user = await User.findOne({ slug: request.params.slug });

  if (user) {
    response.render('show', { user: user,  title: "User Details" });
  } else {
    response.redirect('/');
  }
});

router.post('/', upload.single('image'), async (request, response) => {
  let user = new User({
    first_name: request.body.first_name,
    last_name: request.body.last_name,
    bio: request.body.bio,
    birthday: request.body.birthday,
    country: request.body.country,
    img: request.file.filename,
  });

  try {
    user = await user.save();
    response.redirect(`users/${user.slug}`);
  } catch (error) {
    console.log(error);
  }
});

router.get('/edit/:id', async (request, response) => {
  let user = await User.findById(request.params.id);
  response.render('edit', { user: user,  title: "Edit User" });
});

router.post('/:id', upload.single('image'), async (request, response) => {
  request.user = await User.findById(request.params.id);
  let user = request.user;
  user.first_name = request.body.first_name
  user.last_name = request.body.last_name
  user.bio = request.body.bio
  user.birthday = request.body.birthday
  user.country = request.body.country
  if (request.file) {
    user.img = request.file.filename
  }
  try {
    user = await user.save();
    response.redirect(`/users/${user.slug}`);
  } catch (error) {
    console.log(error);
    response.redirect(`/users/edit/${user.id}`, { user: user });
  }
});

router.delete('/:id', async (request, response) => {
  await User.findByIdAndDelete(request.params.id);
  response.redirect('/');
});

module.exports = router;