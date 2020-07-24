const Product = require('../models/product');
const Order = require('../models/order');
const { validationResult } = require('express-validator');
const User = require('../models/user');



exports.getProducts = (req, res, next) => {

    Product.find()
        .then(products => {
            console.log(products);

            res.status(200).json({

                products: products
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.userId
    });
    product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'post created successfully !',
                product: product
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.toggleFavorite = (req, res, next) => {
    const isFav = req.body.isFavorite;
    const prodId = req.body.productId;

    Product.findById(prodId)
        .then(product => {
            return req.user.toggleFavorite(product._id, isFav);
        })
        .then(result => {
            res.status(201).json({ message: 'fav status updated successfully' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};

exports.getFavorite = (req, res, next) => {

    const favProds = req.user.favoriteProduct;
    res.status(200).json(
        favProds
    );

};

exports.updateProduct = (req, res, next) => {
    const prodId = req.params.productId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                const error = new Error('Could not find product.');
                error.statusCode = 404;
                throw error;
            }

            if (product.userId.toString() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            product.title = title;
            product.description = description;
            product.imageUrl = imageUrl;
            product.price = price;
            return product.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'product updated successfully',
                product: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                const error = new Error('Could not find product.');
                error.statusCode = 404;
                throw error;
            }

            if (product.userId.toString() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            return Product.findByIdAndRemove(prodId);
        })
        .then(result => {
            return User.find();
        }).then(users => {
            const user = [...users];
            user.forEach(us => {
                us.cart.items.findByIdAndRemove(prodId);
                us.favoriteProduct.products.pull(prodId);
                us.save();
            });

        })
        .then(result => {
            res.status(200).json({ message: 'product deleted succesfully' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getAdminProducts = (req, res, next) => {
    Product.find({ userId: req.userId })
        .then(products => {
            res.status(200).json({
                message: 'product fetched successfully',
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