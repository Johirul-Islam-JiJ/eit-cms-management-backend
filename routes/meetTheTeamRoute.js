const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const general = require('@controllers/meetTheTeam/generalController');
const navbar = require('@controllers/meetTheTeam/navbarController');
const section0001 = require('@controllers/meetTheTeam/section0001Controller');
const section0002 = require('@controllers/meetTheTeam/section0002Controller');
const section0003 = require('@controllers/meetTheTeam/section0003Controller');
// const section0004 = require('@controllers/meetTheTeam/section0004Controller');


const { body, param } = require('express-validator');
// router.use(authenticateToken);


router.get('/', general.index);
router.get('/initialize', general.initialize);

router.get('/navbar/:id', navbar.navbar);
router.put('/navbar/updateBrandName/:id', navbar.updateBrandName);
router.put('/navbar/updateCta/:id', navbar.updateCta);
router.put('/navbar/addLink/:id', navbar.addLink);
router.put('/navbar/removeLink/:id', navbar.removeLink);


router.get('/section0001/:id', section0001.getSection);
router.put('/section0001/:id/cta', section0001.updateSectionCta);
router.put('/section0001/:id/title', section0001.updateTitle);
router.put('/section0001/:id/subtitle', section0001.updateSubtitle);
router.put('/section0001/:id/description', section0001.updateDescription);
router.post('/section0001/:id/team-members', section0001.addTeamMember);
router.delete('/section0001/:id/team-members', section0001.removeTeamMember);


router.get('/section0002/:id', section0002.getDepartmentSection);
router.put('/section0002/:id/department-title', section0002.updateDepartmentTitle);
router.post('/section0002/:id/add-department', section0002.addDepartment);
router.delete('/section0002/:id/remove-department', section0002.removeDepartment);


router.get('/section0003/:id', section0003.getSection);
router.put('/section0003/:id/updateSectionTitle', section0003.updateSectionTitle);
router.post('/section0003/:id/addImage', section0003.addImage);
router.delete('/section0003/:id/removeImage', section0003.removeImage);




module.exports = router;