const Router = require('find-my-way');
const render = require('./renderer');
const { notFound } = require('./errorHandler');
const dashboardController = require('../controllers/dashboardController');
const activityController = require('../controllers/activityController');
const facilityController = require('../controllers/facilityController');
const associationController = require('../controllers/associationController');
const memberController = require('../controllers/memberController');
const checkoutController = require('../controllers/checkoutController');
const registrationController = require('../controllers/registrationController');
const waitingListController = require('../controllers/waitingListController');

const router = Router({
  defaultRoute: (req, res) => {
    notFound(res);
  }
});

router.on('GET', '/', dashboardController.show);

router.on('GET', '/facilities', facilityController.list);
router.on('GET', '/facilities/new', facilityController.newForm);
router.on('POST', '/facilities', facilityController.create);
router.on('GET', '/facilities/:id', facilityController.detail);

router.on('GET', '/associations', associationController.list);
router.on('GET', '/associations/new', associationController.newForm);
router.on('POST', '/associations', associationController.create);
router.on('GET', '/associations/:id', associationController.detail);

router.on('GET', '/members', memberController.list);
router.on('GET', '/members/new', memberController.newForm);
router.on('POST', '/members', memberController.create);
router.on('GET', '/members/:id', memberController.detail);

router.on('GET', '/activities', activityController.list);
router.on('GET', '/activities/new', activityController.newForm);
router.on('POST', '/activities', activityController.create);
router.on('GET', '/activities/:id', activityController.detail);

router.on('GET', '/checkout', checkoutController.show);

router.on('GET', '/registrations', registrationController.list);
router.on('GET', '/registrations/new', registrationController.newForm);
router.on('POST', '/registrations', registrationController.create);
router.on('POST', '/registrations/:id/cancel', registrationController.cancel);

router.on('GET', '/waiting-list', waitingListController.list);
router.on('POST', '/waiting-list/:id/confirm', waitingListController.confirm);

module.exports = router;