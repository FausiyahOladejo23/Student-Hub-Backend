const router = require('express').Router();
const { body } = require('express-validator');
const controller = require('../controllers/authController');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/requireAuth');

router.post('/register', [body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'), body('email').trim().isEmail().withMessage('Enter a valid email.').normalizeEmail(), body('password').isString().isLength({ min: 8, max: 128 }).withMessage('Password must be at least 8 characters.')], validate, controller.register);
router.post('/login', [body('email').trim().isEmail().withMessage('Enter a valid email.'), body('password').isString().notEmpty().withMessage('Password is required.')], validate, controller.login);
router.post('/logout', controller.logout);
router.get('/me', requireAuth, controller.me);
router.patch('/change-password', requireAuth, [body('currentPassword').isString().notEmpty(), body('newPassword').isString().isLength({ min: 8, max: 128 }).withMessage('New password must be at least 8 characters.')], validate, controller.changePassword);
module.exports = router;
