const cartModel = require("../models/cartModel");

// API to Fetch virtual cart object from respective store
const fetchCartData = async (req, res) => {
  const { storeId, cartId } = req.params;
  console.log("Received store ID:", storeId);
  console.log("Received cart ID:", cartId);

  try {
    const store = await cartModel.findOne({ _id: storeId });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const cart = store.carts.find((c) => c.cart_id === parseInt(cartId));
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    console.log("virtual cart sending");
    return res.json(cart.virtual_cart);
  } catch (error) {
    return res.status(500).json({ error, error: "\nInternal server error"});
  }
};

// API to Fetch product data from respective store
const fetchItemData = async (req, res) => {
  const { storeId, barcode } = req.params;

  try {
    const store = await cartModel.findOne({ _id: storeId });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const product = store.products.find((p) => p.product_id === barcode);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({
      name: product.name,
      price: product.price,
      weight: product.weight,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// API to Update the virtual cart for the specified cart in the database
const updateVirtualCart = async (req, res) => {
  const { storeId, cartId, virtualCartData } = req.body;

  try {
    await cartModel.updateOne(
      { _id: storeId, "carts.cart_id": cartId },
      {
        $set: {
          "carts.$.virtual_cart": virtualCartData.map((item) => ({
            _id: null, // Explicitly set _id to null for each element
            ...item,
          })),
        },
      }
    );

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// API to Reset the virtual cart for the specified cart in the database
const resetVirtualCart = async (req, res) => {
  const { storeId, cartId } = req.params;

  try {
    await cartModel.updateOne(
      { _id: storeId, "carts.cart_id": cartId },
      { $set: { "carts.$.virtual_cart": [] } }
    );

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// API to sync with/update the  store's products
const updateProducts = async (req, res) => {
  try {
    const { storeId } = req.params;
    const newProductArray = req.body;

    // Validate product array
    if (!Array.isArray(newProductArray) || !newProductArray.every(isValidProductData)) {
      return res.status(400).json({ error: 'Invalid product array' });
    }

    // Update the entire product array for the specified storeId
    const result = await updateProductArray(storeId, newProductArray);

    if (result.success) {
      return res.json({ success: true });
    } else {
      return res.status(500).json({ error: 'Failed to update product array', details: result.error });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to validate product object
function isValidProductData(product) {
  // Validate product attributes
  return (
    product &&
    typeof product.productId === 'string' &&
    typeof product.name === 'string' &&
    typeof product.price === 'number' &&
    typeof product.weight === 'number'
  );
}

// Function to update the entire product array for the specified storeId
async function updateProductArray(storeId, newProductArray) {
  try {
    const store = await cartModel.findById(storeId);

    if (!store) {
      return { success: false, error: 'Store not found' };
    }

    // Update the entire product array
    store.products = newProductArray;

    // Save the updated store document
    const updatedStore = await store.save();

    if (updatedStore) {
      return { success: true };
    } else {
      return { success: false, error: 'Failed to save updated store' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Internal server error' };
  }
}

// API to reset the whole database 
const resetDatabase = async (req, res) => {
  try {
    // Ensure the request body contains the entire database structure
    const newData = req.body;
      
    // Replace the entire database with the provided data
    await cartModel.deleteMany({});
    await cartModel.insertMany(newData);

    return res.json({ success: true, message: 'Database reset successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// API to Get all products in a specific store
const getAllProducts = async (req, res) => {
  const { storeId } = req.params;

  try {
    const store = await cartModel.findOne({ _id: storeId });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const products = store.products;
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  fetchCartData,
  fetchItemData,
  updateVirtualCart,
  resetVirtualCart,
  updateProducts,
  resetDatabase,
  getAllProducts,
};
