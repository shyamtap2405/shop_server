const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            product: {
                type: Object,
                ref: 'Product',
                required: true
            },
            quantity: { type: Number, required: true }
        }]
    },
    favoriteProduct: {
        products: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            isFavorite: { type: Boolean, default: false }
        }]
    }
});

userSchema.methods.toggleFavorite = function(productId, isFav) {
    const favProdIndex = this.favoriteProduct.products.findIndex(fp => {
        return fp.productId.toString() === productId.toString();
    });
    const favProducts = [...this.favoriteProduct.products];
    if (favProdIndex >= 0) {
        favProducts[favProdIndex].isFavorite = isFav;
    } else {
        favProducts.push({
            productId: productId,
            isFavorite: isFav
        });

    }
    const updatedFavProducts = {
        products: favProducts
    }

    this.favoriteProduct = updatedFavProducts;
    return this.save();

};

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.product._id.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            product: product,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.removeSingleItem = function(id) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp._id.toString() === id.toString();
    });

    const updatedCartItems = [...this.cart.items];



    if (updatedCartItems[cartProductIndex].quantity > 1) {
        updatedCartItems[cartProductIndex].quantity = updatedCartItems[cartProductIndex].quantity - 1;
        this.cart.items = updatedCartItems;
    } else if (updatedCartItems[cartProductIndex].quantity === 1) {
        const updatedCartItems1 = this.cart.items.filter(item => {
            return item._id.toString() !== id.toString();
        });
        this.cart.items = updatedCartItems1;
    }

    return this.save();
};

userSchema.methods.removeFromCart = function(id) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item._id.toString() !== id.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};



userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
};


module.exports = mongoose.model('User', userSchema);