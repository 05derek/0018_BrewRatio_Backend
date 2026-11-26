const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const {
  getAllBrewLogs,
  createBrewLog,
  updateBrewLog,
  deleteBrewLog,
} = require('../controllers/brewLogController');

router.use(verifyToken);

router.get('/', getAllBrewLogs);
router.post('/', createBrewLog);
router.put('/:id', updateBrewLog);
router.delete('/:id', deleteBrewLog);

module.exports = router;