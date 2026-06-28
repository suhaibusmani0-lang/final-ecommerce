import { connectDB } from "@/lib/databaseConnection";
import { getSession } from "@/lib/auth";
import CartModel from "@/models/Cart.model";
import ProductModel from "@/models/Product.model";
import { jsonRes } from "@/lib/adminMiddleware";

function normalizeVariant(v = {}) {
  return { size: v.size ?? "", color: v.color ?? "" };
}

export async function GET(req) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session?.userId) return jsonRes(401, "Not authenticated");

    const cart = await CartModel.findOne({ user: session.userId }).populate("items.product", "name images price stock slug isActive");
    if (!cart) return jsonRes(200, "Cart fetched", { items: [], totalAmount: 0 });

    const validItems = cart.items.filter(item => item.product && item.product.isActive);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    return jsonRes(200, "Cart fetched", cart);
  } catch (e) {
    return jsonRes(500, e.message);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session?.userId) return jsonRes(401, "Not authenticated");

    const { productId, qty = 1, variant: rawVariant = {} } = await req.json();
    if (!productId) return jsonRes(400, "Product ID is required");

    const variant = normalizeVariant(rawVariant);

    const product = await ProductModel.findById(productId);
    if (!product) return jsonRes(404, "Product not found");
    if (!product.isActive) return jsonRes(400, "Product is not available");
    if (product.stock < qty) return jsonRes(400, "Insufficient stock");

    let cart = await CartModel.findOne({ user: session.userId });
    if (!cart) {
      cart = await CartModel.create({ user: session.userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex((item) => {
      const itemVariant = normalizeVariant(item.variant);
      return item.product.toString() === productId &&
        itemVariant.size === variant.size &&
        itemVariant.color === variant.color;
    });

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].qty + qty;
      if (product.stock < newQty) return jsonRes(400, "Insufficient stock");
      cart.items[existingItemIndex].qty = newQty;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images[0]?.url || "",
        price: product.salePrice ?? product.price,
        qty,
        variant,
      });
    }

    await cart.save();
    await cart.populate("items.product", "name images price stock slug isActive");
    return jsonRes(200, "Item added to cart", cart);
  } catch (e) {
    return jsonRes(500, e.message);
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session?.userId) return jsonRes(401, "Not authenticated");

    const { itemId, qty, variant } = await req.json();
    if (!itemId) return jsonRes(400, "Item ID is required");

    const cart = await CartModel.findOne({ user: session.userId });
    if (!cart) return jsonRes(404, "Cart not found");

    const item = cart.items.id(itemId);
    if (!item) return jsonRes(404, "Item not found in cart");

    if (qty !== undefined) {
      if (qty <= 0) {
        cart.items.pull(itemId);
      } else {
        const product = await ProductModel.findById(item.product);
        if (product && product.stock < qty) {
          return jsonRes(400, "Insufficient stock");
        }
        item.qty = qty;
      }
    }

    if (variant) {
      item.variant = { ...item.variant, ...variant };
    }

    await cart.save();
    await cart.populate("items.product", "name images price stock slug isActive");
    return jsonRes(200, "Cart updated", cart);
  } catch (e) {
    return jsonRes(500, e.message);
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session?.userId) return jsonRes(401, "Not authenticated");

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");
    const clear = searchParams.get("clear") === "true";

    const cart = await CartModel.findOne({ user: session.userId });
    if (!cart) return jsonRes(404, "Cart not found");

    if (clear) {
      cart.items = [];
    } else if (itemId) {
      cart.items.pull(itemId);
    } else {
      return jsonRes(400, "Item ID or clear parameter required");
    }

    await cart.save();
    await cart.populate("items.product", "name images price stock slug isActive");
    return jsonRes(200, "Cart updated", cart);
  } catch (e) {
    return jsonRes(500, e.message);
  }
}
