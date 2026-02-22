import { useState } from "react";
import API from "../api/api";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    selling_price: "",
    cost_price: "",
    current_stock: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products/", {
        name: form.name,
        selling_price: parseFloat(form.selling_price),
        cost_price: parseFloat(form.cost_price),
        current_stock: parseInt(form.current_stock)
      });

      alert("Product added successfully ✅");

      // Reset form
      setForm({
        name: "",
        selling_price: "",
        cost_price: "",
        current_stock: ""
      });

    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product ❌");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Add New Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-md space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="number"
          name="selling_price"
          placeholder="Selling Price"
          value={form.selling_price}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="number"
          name="cost_price"
          placeholder="Cost Price"
          value={form.cost_price}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="number"
          name="current_stock"
          placeholder="Current Stock"
          value={form.current_stock}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}