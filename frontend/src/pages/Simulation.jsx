import { useEffect, useState } from "react";
import API from "../api/api";

export default function Simulation() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    new_price: "",
    new_stock: ""
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products/");
    setProducts(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await API.post("/analytics/simulate", {
      product_id: parseInt(form.product_id),
      new_price: parseFloat(form.new_price),
      new_stock: parseInt(form.new_stock)
    });

    setResult(res.data);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        What‑If Profit Simulation
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

        <select
          name="product_id"
          value={form.product_id}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        >
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="new_price"
          placeholder="New Selling Price"
          value={form.new_price}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="number"
          name="new_stock"
          placeholder="New Stock Level"
          value={form.new_stock}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-3 rounded"
        >
          Run Simulation
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Simulation Result
          </h2>
          <p>Simulated Revenue: ₹ {result.simulated_revenue}</p>
          <p>Simulated Profit: ₹ {result.simulated_profit}</p>
        </div>
      )}
    </div>
  );
}