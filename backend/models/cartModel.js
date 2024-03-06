const mongoose = require('mongoose')
const Schema = mongoose.Schema

const storeSchema = new Schema({
    store_name: String,
    store_location: String,
    products: [
      {
        product_id: String,
        name: String,
        price: Number,
        weight: Number,
      }
    ],
    carts: [
      {
        cart_id: Number,
        virtual_cart: [
          {
            product_id: String,
            name: String,
            quantity: Number,
            price: Number,
            weight: Number,
          }
        ],
      }
    ],
  },{collection: 'Store'});
  
module.exports = mongoose.model('Store', storeSchema);
  