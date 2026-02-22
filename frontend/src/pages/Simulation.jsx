import { useEffect, useState } from "react";
import API from "../api/api";

export default function Simulation() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    new_price: "",
    new_stock: ""
  });

  const [baseline, setBaseline] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // When product_id changes, fetch baseline simulation for current price/stock
    const id = parseInt(form.product_id);
    if (!id) {
      setBaseline(null);
      return;
    }

    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    (async () => {
      try {
        const res = await API.post("/analytics/simulate", {
          product_id: id,
          new_price: parseFloat(prod.selling_price),
          new_stock: parseInt(prod.current_stock)
        });
        setBaseline(res.data);
      } catch (err) {
        setBaseline(null);
      }
    })();
  }, [form.product_id, products]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/");
      setProducts(res.data);
    } catch (err) {
      setProducts([]);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const runSimulation = async (payload) => {
    setLoading(true);
    try {
      const res = await API.post("/analytics/simulate", payload);
      setResult(res.data);
    } catch (err) {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product_id) return;

    await runSimulation({
      product_id: parseInt(form.product_id),
      new_price: parseFloat(form.new_price),
      new_stock: parseInt(form.new_stock)
    });
  };

  // Quick scenario: percent changes (e.g., +10% price)
  const applyScenario = async (pricePct = 0, stockPct = 0) => {
    const id = parseInt(form.product_id);
    if (!id) return;
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    const new_price = +(prod.selling_price * (1 + pricePct / 100)).toFixed(2);
    const new_stock = Math.max(0, Math.round(prod.current_stock * (1 + stockPct / 100)));

    setForm({ ...form, new_price, new_stock });

    await runSimulation({ product_id: id, new_price, new_stock });
  };

  const delta = baseline && result ? {
    revenue_change: result.simulated_revenue - baseline.simulated_revenue,
    profit_change: result.simulated_profit - baseline.simulated_profit
  } : null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">What‑If Profit Simulation</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <select
          name="product_id"
          value={form.product_id}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            type="number"
            name="new_price"
            placeholder="New Selling Price"
            value={form.new_price}
            onChange={handleChange}
            className="w-1/2 p-3 border rounded"
            required
          />

          <input
            type="number"
            name="new_stock"
            placeholder="New Stock Level"
            value={form.new_stock}
            onChange={handleChange}
            className="w-1/2 p-3 border rounded"
            required
          />
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => applyScenario(10, 0)} className="px-3 py-2 bg-gray-100 rounded">+10% Price</button>
          <button type="button" onClick={() => applyScenario(0, 20)} className="px-3 py-2 bg-gray-100 rounded">+20% Stock</button>
          <button type="button" onClick={() => applyScenario(10, 20)} className="px-3 py-2 bg-purple-600 text-white rounded">Price+10% & Stock+20%</button>
        </div>

        <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded">Run Simulation</button>
      </form>

      {baseline && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <strong>Baseline (current):</strong>
          <p>Revenue: ₹ {baseline.simulated_revenue}</p>
          <p>Profit: ₹ {baseline.simulated_profit}</p>
        </div>
      )}

      {loading && <p className="mt-4">Running simulation…</p>}

      {result && (
        <div className="mt-4 bg-white p-6 rounded-xl shadow max-w-md">
          <h2 className="text-xl font-semibold mb-4">Simulation Result</h2>
          <p>Simulated Revenue: ₹ {result.simulated_revenue}</p>
          <p>Simulated Profit: ₹ {result.simulated_profit}</p>

          {delta && (
            <div className="mt-4">
              <p className={delta.revenue_change >= 0 ? 'text-green-600' : 'text-red-600'}>
                Revenue change: {delta.revenue_change >= 0 ? '+' : ''}₹ {delta.revenue_change}
              </p>
              <p className={delta.profit_change >= 0 ? 'text-green-600' : 'text-red-600'}>
                Profit change: {delta.profit_change >= 0 ? '+' : ''}₹ {delta.profit_change}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}