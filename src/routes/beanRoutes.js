const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const {
  getAllBeans,
  createBean,
  updateBean,
  deleteBean,
} = require('../controllers/beanController');

router.use(verifyToken);

router.get('/', getAllBeans);
router.post('/', createBean);
router.put('/:id', updateBean);
router.delete('/:id', deleteBean);

module.exports = router;