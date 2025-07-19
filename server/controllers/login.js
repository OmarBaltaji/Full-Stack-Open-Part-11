const jwt = require('jsonwebtoken');
const User = require('../models/user');
const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'Wrong credentials' });
  }

  const userForToken = {
    id: user._id,
    username: user.username
  };

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60*24 }
  );

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;