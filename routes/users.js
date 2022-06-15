const router = require('express').Router();
const {
  getUsers, getUserByID, createNewUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserByID);

router.post('/users', createNewUser);

router.patch('/users/me', updateUserInfo);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
