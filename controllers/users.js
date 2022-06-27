const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  INCORRECT_DATA, NOT_FOUND, DUPLICATE_ERROR_CODE, WRONG_EMAIL_OR_PASSWORD,
} = require('../errors/errors');

const MONGO_DUPLICATE_ERROR_CODE = 11000;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users));
};

module.exports.getUserByID = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        const err = new Error('Такой пользователь не найден');
        err.statusCode = NOT_FOUND;
        next(err);
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        const err = new Error('Ошибка в ID пользователя');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
    });
};

module.exports.createNewUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
        const err = new Error('Пользователь с таким email уже существует');
        err.statusCode = DUPLICATE_ERROR_CODE;
        next(err);
      }
      if (error.name === 'ValidationError') {
        const err = new Error('Введены неверные данные');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        const err = new Error('Такой пользователь не найден');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        const err = new Error('Введены неверные данные');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
      if (error.name === 'CastError') {
        const err = new Error('Ошибка в ID пользователя');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        const err = new Error('Такой пользователь не найден');
        err.statusCode = NOT_FOUND;
        next(err);
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        const err = new Error('Введены неверные данные');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
      if (error.name === 'CastError') {
        const err = new Error('Ошибка в ID пользователя');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
    });
};

module.exports.userLogin = (req, res, next) => {
  const { email, password } = req.body;
  let user;

  User.findOne({ email }).select('+password')
    .then((foundUser) => {
      if (!foundUser) {
        const err = new Error('Неправильный e-mail или пароль');
        err.statusCode = WRONG_EMAIL_OR_PASSWORD;
        next(err);
      }
      user = foundUser;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        const err = new Error('Неправильный e-mail или пароль');
        err.statusCode = WRONG_EMAIL_OR_PASSWORD;
        next(err);
      }
      const token = jwt.sign({ _id: user.id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
      res.send({ token });
    })
    .catch((error) => {
      if (error.statusCode === WRONG_EMAIL_OR_PASSWORD) {
        const err = new Error('Неправильный e-mail или пароль');
        err.statusCode = WRONG_EMAIL_OR_PASSWORD;
        next(err);
      }
    });
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  User.findById(req._id)
    .then((user) => {
      if (!user) {
        const err = new Error('Такой пользователь не найден');
        err.statusCode = NOT_FOUND;
        next(err);
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        const err = new Error('Ошибка в ID пользователя');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
    });
};
