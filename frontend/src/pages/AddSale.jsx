import { useEffect, useState } from "react";
import API from "../api/api";

export default function AddSale() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    quantity_sold: "",
    sale_date: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/sales/", {
        product_id: parseInt(form.product_id),
        quantity_sold: parseInt(form.quantity_sold),
        sale_date: form.sale_date
      });

      alert("Sale added successfully ✅");

      setForm({
        product_id: "",
        quantity_sold: "",
        sale_date: ""
      });

    } catch (error) {
      console.error("Error adding sale:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add Sale</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

        {/* Product Dropdown */}
        <select
          name="product_id"
          value={form.product_id}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        {/* Quantity */}
        <input
          type="number"
          name="quantity_sold"
          placeholder="Quantity Sold"
          value={form.quantity_sold}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        {/* Date */}
        <input
          type="date"
          name="sale_date"
          value={form.sale_date}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Add Sale
        </button>

      </form>
    </div>
  );
}