const router = require('express').Router();
const { form, home, destroy } = require('../controllers/controller');
const login = require('../middlewares/auth');

router.get('/', login, form);
router.post('/home', home);
router.post('/logout', destroy);

module.exports = router;