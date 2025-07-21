const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const general = require('../controllers/meetTheTeam/generalController');



const { body, param } = require('express-validator');
// router.use(authenticateToken);


router.get('/', general.index);
router.get('/initialize', general.initialize);

// router.put(
//   '/navbar/:id',
//   [
//     param('id').isMongoId().withMessage('Invalid ID'),
//     body('brand.name').optional().isString().withMessage('Brand name must be a string'),
//     body('links').optional().isArray().withMessage('Links must be an array'),
//     body('links.*').optional().isString().withMessage('Each link must be a string'),
//     body('cta.text').optional().isString().withMessage('CTA text must be a string'),
//     body('cta.url').optional().isURL().withMessage('CTA URL must be valid'),
//   ],
//   meetTheTeam.updateNavbar
// );

// router.put('/section_0001/:id', meetTheTeam.updateSection0001);

// router.get(
//   '/navbar/:id',meetTheTeam.updateNavbar
// );

module.exports = router;