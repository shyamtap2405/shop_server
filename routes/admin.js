const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/cartItem', isAuth, adminController.getCart);

router.post('/cart', isAuth, adminController.postCart);

router.post('/cart/delete', isAuth, adminController.deleteCartItem);

router.post('/order', isAuth, adminController.postOrder);

router.get('/orderItem', isAuth, adminController.getOrders);

router.post('/singleCartItem', isAuth, adminController.deleteSingleCartItem);

module.exports = router;