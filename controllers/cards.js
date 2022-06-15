const Card = require('../models/card');
const { INCORRECT_DATA, NOT_FOUND, DEFAULT_ERROR } = require('../errors/errors');

module.exports.createNewCard = (req, res) => {
  const {
    name, link,
  } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Введены неверные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Общая ошибка сервера' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(NOT_FOUND).send({ message: 'Не обнаружено информации о карточках' }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Такой карточки не обнаружено' });
      }
      return res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Ошибка в ID карточки' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Общая ошибка сервера' });
    });
};

module.exports.setCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Ошибка в ID карточки' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Общая ошибка сервера' });
    });
};

module.exports.removeCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Ошибка в ID карточки' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Общая ошибка сервера' });
    });
};
