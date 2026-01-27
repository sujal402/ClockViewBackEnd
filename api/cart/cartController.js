import Cart from "./cartModel.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing userId or productId" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    await cart.populate("items.product", "name price");

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get cart for user
// export const getCartForUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     console.log("getCartForUser userId:", userId);

//     if (!userId) {
//       return res.status(400).json({ message: "Missing userId" });
//     }

//     let cart = await Cart.findOne({ user: userId }).populate(
//       "items.product",
//       "name price"
//     );

//     // If cart doesn't exist, return empty cart
//     if (!cart) {
//       cart = { items: [] };
//     }

//     res.status(200).json(cart);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
export const getCartForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    // Populate specific fields from Product
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "companyName brand cost imageUrl", // select the fields you need
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing userId or productId" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product", "name price");

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update quantity of an item
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || typeof quantity !== "number") {
      return res
        .status(400)
        .json({ message: "Missing userId, productId, or quantity" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      await cart.populate("items.product", "name price");
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
