// app/api/admin/products/[id]/route.js
import { connectDB } from "@/lib/databaseConnection";
import ProductModel from "@/models/Product.model";
import { jsonRes } from "@/lib/adminMiddleware";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const product = await ProductModel.findById(params.id)
      .populate("category", "_id name");
    if (!product) return jsonRes(404, "Product not found");
    return jsonRes(200, "Product fetched", { product });
  } catch (e) {
    return jsonRes(500, e.message);
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const formData = await req.formData();
    const updateData = {};
    for (const [key, value] of formData.entries()) {
      // Skip files for now; handle images if needed
      if (key !== "images") {
        updateData[key] = value;
      }
    }
    // Convert numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.salePrice) updateData.salePrice = parseFloat(updateData.salePrice);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    // Boolean fields
    ["isFeatured", "isNewArrival", "isBestSeller", "isActive"].forEach(field => {
      if (updateData[field] !== undefined) {
        updateData[field] = updateData[field] === "true";
      }
    });

    const product = await ProductModel.findByIdAndUpdate(params.id, updateData, { new: true });
    if (!product) return jsonRes(404, "Product not found");
    return jsonRes(200, "Product updated", { product });
  } catch (e) {
    return jsonRes(500, e.message);
  }
}