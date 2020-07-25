const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const product = require('../models/product');
const { json } = require('body-parser');
const { Query } = require('mongoose');


exports.getCart = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            const products = user.cart.items;
            res.json({
                message: 'cart fetched successfully',
                products: products
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });



};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            const prod = product
            return req.user.addToCart(product);
        })
        .then(result => {
            var query = new Query()
            const cart = query.select(result.cart.items)['_fields'];
            // const addedItem = cart.array.forEach(element => {

            //     if (item.product._id === prodId) {
            //         return {
            //             cartId: item._id,
            //             product: item.product,
            //             quantity: item.quantity
            //         };
            //     }
            // });
            // cart.get(prodId)

            res.status(201).json({
                message: 'cart product added successfully',
                cart: cart
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};

exports.deleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(result => {
            res.status(201).json({
                message: 'item deleted successfully'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};

exports.postOrder = (req, res, next) => {
    const products = req.user.cart.items;
    let total = 0;
    products.forEach(p => {
        total += p.quantity * p.price;
    });
    const order = new Order({
        user: {
            email: req.user.email,
            userId: req.userId
        },
        products: products,
        amount: total
    });
    return order.save()
        .then(result => {
            const order = result;
            return req.user.clearCart();
        }).then(() => {
            res.status(201).json({
                order: order,
                message: 'order placed successfully'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.userId })
        .then(orders => {
            res.status(200).json({
                orders: orders,
                message: 'order fetched successfully'
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteSingleCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.removeSingleItem(product);
        })
        .then(result => {
            res.status(201).json({
                message: ' single item removed successfully',
                result: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};