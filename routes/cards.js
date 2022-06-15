const router = require('express').Router();
const {
  createNewCard, getCards, deleteCardById, setCardLike, removeCardLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createNewCard);

router.delete('/cards/:cardId', deleteCardById);

router.put('/cards/:cardId/likes', setCardLike);

router.delete('/cards/:cardId/likes', removeCardLike);

module.exports = router;
