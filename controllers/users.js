const User = require('../models/user');
const { INCORRECT_DATA, NOT_FOUND, DEFAULT_ERROR } = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(NOT_FOUND).send({ message: 'Не обнаружено информации о пользователях' }));
};

module.exports.getUserByID = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Такой пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Ошибка в ID пользователя' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Общая ошибка сервера' });
    });
};

module.exports.createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Введены неверные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Общая ошибка сервера' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(INCORRECT_DATA).send({ message: 'Такой пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Введены неверные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Общая ошибка сервера' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(INCORRECT_DATA).send({ message: 'Такой пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Введены неверные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Общая ошибка сервера' });
    });
};
