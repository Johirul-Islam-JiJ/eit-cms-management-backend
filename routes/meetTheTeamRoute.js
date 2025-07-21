const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const meetTheTeam = require('../controllers/meetTheTeamController');

router.get('/', meetTheTeam.index);
router.post('/', authenticateToken, meetTheTeam.store);
router.get('/initialize', meetTheTeam.initialize);

module.exports = router;