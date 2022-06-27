const Card = require('../models/card');
const { INCORRECT_DATA, NOT_FOUND } = require('../errors/errors');

module.exports.createNewCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        const err = new Error('Введены неверные данные');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        const err = new Error('Такой карточки не обнаружено');
        err.statusCode = NOT_FOUND;
        next(err);
      }
      if (card.owner.toString() !== req.user._id) {
        const err = new Error('Удаление чужой карточки запрещено');
        err.statusCode = NOT_FOUND;
        next(err);
      }
      return res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        const err = new Error('Ошибка в ID карточки');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
    });
};

module.exports.setCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Такой карточки не обнаружено');
        err.statusCode = NOT_FOUND;
        next(err);
      }
      return res.status(200).send({ card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        const err = new Error('Ошибка в ID карточки');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
    });
};

module.exports.removeCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Такой карточки не обнаружено');
        err.statusCode = NOT_FOUND;
        next(err);
      }
      return res.status(200).send({ message: 'Лайк удалён' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        const err = new Error('Ошибка в ID карточки');
        err.statusCode = INCORRECT_DATA;
        next(err);
      }
    });
};
