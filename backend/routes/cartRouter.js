const express = require('express')
const router = express.Router()

const cartController = require('../controllers/cartController')

router.get('/fetch-cart-data/:storeId/:cartId', cartController.fetchCartData);
router.get('/fetch-item/:storeId/:barcode', cartController.fetchItemData);
router.post('/update-virtual-cart', cartController.updateVirtualCart);
router.post('/reset-virtual-cart/:storeId/:cartId', cartController.resetVirtualCart);
router.post('/update-products/:storeId', cartController.updateProducts)
router.post('/reset-database', cartController.resetDatabase)
module.exports = router