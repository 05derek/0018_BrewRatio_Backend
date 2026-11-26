const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const {
  getAllMethods,
  createMethod,
  updateMethod,
  deleteMethod,
} = require('../controllers/methodController');

router.use(verifyToken);

router.get('/', getAllMethods);
router.post('/', createMethod);
router.put('/:id', updateMethod);
router.delete('/:id', deleteMethod);

module.exports = router;