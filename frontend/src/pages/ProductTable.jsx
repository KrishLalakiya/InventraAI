import { useEffect, useState } from "react";
import API from "../api/api";

export default function ProductTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
  try {
    const res = await API.get("/analytics/risk");
    console.log("API RESPONSE:", res.data);

    setProducts(Array.isArray(res.data.risk_analysis) 
      ? res.data.risk_analysis 
      : []);
  } catch (error) {
    console.error("Error fetching products:", error);
    setProducts([]);
  }
};

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Product Inventory</h1>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Cost</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Risk</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4 font-medium">
                  {product.name}
                </td>
                <td className="px-6 py-4">
                  {typeof product.selling_price !== 'undefined' && product.selling_price !== null
                    ? `₹ ${product.selling_price}`
                    : '—'}
                </td>
                <td className="px-6 py-4">
                  ₹ {product.cost_price}
                </td>
                <td className="px-6 py-4">
                  {typeof product.current_stock !== 'undefined' && product.current_stock !== null
                    ? product.current_stock
                    : '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        product.risk_level === "High"
                          ? "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                          : product.risk_level === "Medium"
                            ? "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                            : "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                      }
                    >
                      {product.risk_level}
                    </span>

                    {typeof product.risk_score !== 'undefined' && (
                      <span className="text-sm text-gray-500">({product.risk_score})</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}