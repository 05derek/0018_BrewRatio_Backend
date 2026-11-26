const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require('../controllers/userController');

router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteAccount);

module.exports = router;