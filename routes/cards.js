const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  createNewCard, getCards, deleteCardById, setCardLike, removeCardLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)/),
    owner: Joi.string().required(),
  }),
}), createNewCard);

router.delete('/cards/:cardId', deleteCardById);

router.put('/cards/:cardId/likes', setCardLike);

router.delete('/cards/:cardId/likes', removeCardLike);

module.exports = router;
