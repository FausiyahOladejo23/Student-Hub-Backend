const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const controller = require('../controllers/dashboardController');
router.get('/summary', requireAuth, controller.summary);
module.exports = router;
