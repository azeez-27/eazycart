const cartModel = require("../models/cartModel");

//Fetch virtual cart object from respective store 
const fetchCartData = async (req, res) => {
  const { storeId, cartId } = req.params;
  console.log('Received store ID:', storeId);
  console.log('Received cart ID:', cartId);
  
  try {
    const store = await cartModel.findOne({ _id: storeId });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const cart = store.carts.find((c) => c.cart_id === parseInt(cartId));
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    return res.json(cart.virtual_cart);

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

//Fetch product data from respective store
const fetchItemData = async (req, res) => {
  const { storeId, barcode } = req.params;

  try {
    const store = await cartModel.findOne({ _id: storeId });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const product = store.products.find((p) => p.product_id === barcode);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({
      name: product.name,
      price: product.price,
      weight: product.weight,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

//Update the virtual cart for the specified cart in the database
const updateVirtualCart = async (req, res) => {
  const { storeId, cartId, virtualCartData } = req.body;

  try {
        await cartModel.updateOne(
      { _id: storeId, 'carts.cart_id': cartId },
      { $set: { 'carts.$.virtual_cart': virtualCartData.map((item) => ({
        _id: null,  // Explicitly set _id to null for each element
        ...item,
      })), } }
    );

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Reset the virtual cart for the specified cart in the database
const resetVirtualCart = async (req, res) => {
  const { storeId, cartId } = req.params;

  try {    
    await cartModel.updateOne({ _id: storeId, 'carts.cart_id': cartId }, { $set: { 'carts.$.virtual_cart': [] } });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
    fetchCartData,
    fetchItemData,
    updateVirtualCart,
    resetVirtualCart,
}
