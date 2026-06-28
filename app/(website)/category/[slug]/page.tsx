import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, Grid, List } from "lucide-react";

async function getCategoryData(slug: string, page: number = 1, sort: string = "newest") {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/categories?slug=${slug}&page=${page}&sort=${sort}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const sort = sp.sort || "newest";
  const data = await getCategoryData(slug, page, sort);
  
  if (!data) notFound();

  const { category, products, total, pages, hasMore } = data;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Category Header */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 md:px-10" 
        style={{ backgroundImage: `url('/assets/images/page-title.png')` }}
      >
        <div className="absolute inset-0 bg-black/60" /> {/* overlay */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{category.name}</h1>
          {category.description && (
            <p className="text-white/70 max-w-2xl">{category.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A1A1A]">Filters</h3>
                <SlidersHorizontal size={18} className="text-[#1A1A1A]/60" />
              </div>
              
              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#1A1A1A] mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-[#1A1A1A]/70">Under ₹500</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-[#1A1A1A]/70">₹500 - ₹1000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-[#1A1A1A]/70">₹1000 - ₹2000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-[#1A1A1A]/70">₹2000 - ₹5000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-[#1A1A1A]/70">Above ₹5000</span>
                  </label>
                </div>
              </div>

              {/* Badge Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#1A1A1A] mb-3">Special Offers</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-[#1A1A1A]/70">New Arrivals</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-[#1A1A1A]/70">Sale</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-[#1A1A1A]/70">Best Sellers</span>
                  </label>
                </div>
              </div>

              <button className="w-full py-2 bg-[#1A1A1A] text-white rounded-lg text-sm font-medium hover:bg-[#333] transition-colors">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-sm text-[#1A1A1A]/60">
                Showing {products.length} of {total} products
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-[#1A1A1A] text-white rounded-lg">
                    <Grid size={18} />
                  </button>
                  <button className="p-2 bg-white text-[#1A1A1A]/60 rounded-lg hover:bg-gray-50">
                    <List size={18} />
                  </button>
                </div>
                <select 
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#1A1A1A]"
                  defaultValue={sort}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                 
                  {products.map((product: any) => (
                    <Link
                      key={product._id}
                      href={`/product/${product.slug}`}
                      className="group"
                    >
                      <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square relative">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                          {product.badge && (
                            <div className="absolute top-3 left-3 px-2 py-1 bg-[#C17A56] text-white text-xs font-bold rounded-full">
                              {product.badge}
                            </div>
                          )}
                          {product.salePrice && (
                            <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                              SALE
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-[#1A1A1A] text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold text-[#C17A56]">
                              ₹{(product.salePrice || product.price).toLocaleString()}
                            </p>
                            {product.salePrice && (
                              <p className="text-sm text-[#1A1A1A]/50 line-through">
                                ₹{product.price.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-xs ${
                                    star <= Math.round(product.ratings.average || 0)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-[#1A1A1A]/60">
                              ({product.ratings.count || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    {page > 1 && (
                      <Link
                        href={`/category/${slug}?page=${page - 1}&sort=${sort}`}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Previous
                      </Link>
                    )}
                    {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Link
                          key={pageNum}
                          href={`/category/${slug}?page=${pageNum}&sort=${sort}`}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            pageNum === page
                              ? "bg-[#C17A56] text-white"
                              : "bg-white border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                    {hasMore && (
                      <Link
                        href={`/category/${slug}?page=${page + 1}&sort=${sort}`}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center">
                <p className="text-[#1A1A1A]/60 mb-4">No products found in this category.</p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-[#C17A56] text-white rounded-xl font-medium hover:bg-[#A06245] transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
