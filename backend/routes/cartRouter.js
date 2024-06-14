const express = require('express')
const router = express.Router()

const cartController = require('../controllers/cartController')

router.get('/fetch-cart-data/:storeId/:cartId', cartController.fetchCartData);
router.get('/fetch-cart-mode/:storeId/:cartId', cartController.fetchCartZombieMode);
router.get('/fetch-item/:storeId/:barcode', cartController.fetchItemData);
router.get('/get-all-products/:storeId', cartController.getAllProducts);
router.post('/update-virtual-cart', cartController.updateVirtualCart);
router.post('/update-cart-mode', cartController.updateCartZombieMode);
router.post('/reset-virtual-cart/:storeId/:cartId', cartController.resetVirtualCart);
router.post('/update-products/:storeId', cartController.updateProducts)
router.post('/reset-database', cartController.resetDatabase)
module.exports = router