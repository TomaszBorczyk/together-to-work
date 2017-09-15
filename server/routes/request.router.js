const RequestController = require('../controllers/request.controller'),
      router = require('express').Router(),
      passport = require('passport');

router.get('/getfordriver', RequestController.getRequestsAsDriver);
router.get('/getforpassenger', RequestController.getRequestsAsPassenger);

router.post('/areunsolved', RequestController.areUnsolvedRequests);
router.post('/arefree', RequestController.areFreeSeats);

router.post('/add', RequestController.add);
router.post('/solve', RequestController.solveRequest);
router.post('/accept', RequestController.acceptRequest);
router.post('/decline', RequestController.declineRequest);
router.post('/cancel', RequestController.cancelRequest);

router.post('/markshownall', RequestController.markAllAsShown);
router.post('/markshown', RequestController.markAsShown);
router.get('/countnotshown', RequestController.countResolvedtNotShown);
router.get('/countnew', RequestController.countNewRequests);

module.exports = router;
