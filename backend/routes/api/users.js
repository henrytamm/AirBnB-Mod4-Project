const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const user = require('../../db/models/user')


const router = express.Router();


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

//sign up
router.post('/', validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;

  const checkValidEmail = await User.findOne({
    where: {
      email: email
    }
  });
  if (checkValidEmail) {
    return res.status(403).json({
      "message": 'User already exists',
      "statusCode": 403,
      "errors": {
        "email": "User with that email already exists"
      }
    })
  };

  const checkValidUsername = await User.findOne({
    where: {
      username: username
    }
  });
  if (checkValidUsername) {
    return res.status(403).json({
      "message": 'User already exists',
      "statusCode": 403,
      "errors": {
        "username": "User with that username already exists"
      }
    });

  }
  
  const user = await User.signup({
    firstName,
    lastName,
    email,
    password,
    username,
  })

  await setTokenCookie(res, user);

  return res.json(user)
})

module.exports = router;