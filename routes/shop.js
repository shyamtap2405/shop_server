const express = require('express');
const { body } = require('express-validator/check')

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

router.get('/products', isAuth, shopController.getProducts);

router.post(
    '/add-product',
    isAuth, [
        body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),

        body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    shopController.createProduct
);

router.post('/userFavorites', isAuth, shopController.toggleFavorite);

router.get('/userfav', isAuth, shopController.getFavorite);

router.patch('/updateProduct/:productId',
    isAuth, [
        body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),

        body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    shopController.updateProduct);

router.get('/admin/products', isAuth, shopController.getAdminProducts);

router.post('/product/:productId', isAuth, shopController.deleteProduct);

module.exports = router;