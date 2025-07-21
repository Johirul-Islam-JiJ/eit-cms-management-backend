const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const aboutUsWebSiteTemplate1Controller = require('../controllers/aboutUsWebSiteTemplate1Controller');

router.get('/', aboutUsWebSiteTemplate1Controller.index);
router.post('/', authenticateToken, aboutUsWebSiteTemplate1Controller.store);
router.get('/initialize', aboutUsWebSiteTemplate1Controller.initialize);

module.exports = router;