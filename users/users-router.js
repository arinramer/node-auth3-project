const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const restricted = require('../users/restricted-middleware.js');

const users = require('../users/users-model.js');
const { jwtSecret } = require("../config/secrets.js");

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    users.add(user)
    .then(saved => {
        res.status(201).json(saved);
    })
    .catch(error => {
        res.status(500).json(error);
      });
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/users', restricted, (req, res) => {
    users.getUsers()
    .then(users => {
        res.json(users)
    })
})

function generateToken(user) {
    const payload = {
        username: user.username,
        role: user.department || 'HR'
    }

    const options = {
        expiresIn: '1h'
    }

    return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;