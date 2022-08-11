const Product = require('../models/product');
const User = require('../models/user');

const categories = require('../configs').categories;

exports.getHomePage = async (req, res, next) => {
    const category = req.query.category;
    const donation = req.query.donation;
    const productFilter = {};
    if (category) {
        productFilter.category = category;
    }
    if (donation) {
        productFilter.price = 0;
    } else {
        productFilter.price = { $gt: 0 };
    }
    const products = await Product.find(productFilter);
    try {
        res.render('main/home', {
            pagetitle: 'NIT Store',
            isLoggedIn: false,
            products: products,
            categories: categories
        });
    } catch (err) {
        const error = new Error('Something went wrong with the Database!');
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getProductDetailPage = async (req, res, next) => {
    const product_id = req.params.product_id;
    try {
        const product = await Product.findOne({
            _id: product_id
        });
        const seller = await User.findOne({
            rollNo: product.sellerRollNo
        });
        res.render('shop/productDetail.ejs', {
            pagetitle: 'Product Details',
            isLoggedIn: false,
            product: product,
            seller: seller,
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        const error = new Error('Something went wrong with the Database!');
        error.httpStatusCode = 500;
        return next(error);
    }
};