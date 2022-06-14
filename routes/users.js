const router = require('express').Router();
const { getUsers, getUserByID, createNewUser } = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserByID);

router.post('/users', createNewUser);

module.exports = router;
