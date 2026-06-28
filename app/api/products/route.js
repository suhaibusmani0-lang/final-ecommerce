import { connectDB } from "@/lib/databaseConnection";
import ProductModel from "@/models/Product.model";
import CategoryModel from "@/models/Category.model";
import { jsonRes } from "@/lib/adminMiddleware";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const isFeatured = searchParams.get("isFeatured") === "true";
    const isNewArrival = searchParams.get("isNewArrival") === "true";
    const isBestSeller = searchParams.get("isBestSeller") === "true";

    const query = { isActive: true };
    
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    
    if (category) {
      const categoryDoc = await CategoryModel.findOne({ slug: category, isActive: true, isDeleted: false });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (isFeatured) query.isFeatured = true;
    if (isNewArrival) query.isNewArrival = true;
    if (isBestSeller) query.isBestSeller = true;

    let sortOption = {};
    switch (sort) {
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      case "popular":
        sortOption = { "ratings.count": -1 };
        break;
      case "rating":
        sortOption = { "ratings.average": -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit),
      ProductModel.countDocuments(query),
    ]);

    return jsonRes(200, "Products fetched", { 
      products, 
      total, 
      page, 
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total 
    });
  } catch (e) {
    return jsonRes(500, e.message);
  }
}
