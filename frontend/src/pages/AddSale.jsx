import { useEffect, useState } from "react";
import API from "../api/api";

export default function AddSale() {
  const [products, setProducts] = useState([]);
  const [csvName, setCsvName] = useState("");
  // helper to format today's date as yyyy-mm-dd for the date input value
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    product_id: "",
    quantity_sold: "",
    sale_date: today
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
        sale_date: today
      });

    } catch (error) {
      console.error("Error adding sale:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/sales/upload_csv", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(`Import complete: ${res.data.sales_imported} sales imported, ${res.data.created_products} products created`);
      // refresh products list
      fetchProducts();
    } catch (err) {
      console.error("CSV upload failed", err);
      alert("CSV upload failed");
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

      <div className="mt-6 max-w-md">
        <h2 className="text-lg font-semibold mb-2">Upload Sales CSV</h2>
        <div className="flex items-center gap-3">
          <label htmlFor="csv-upload" className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">Choose CSV</label>
          <input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          <span id="csv-filename" className="text-sm text-gray-600">{csvName || 'Drop a CSV or click Choose CSV'}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">CSV columns: product_id or product_name, quantity_sold, sale_date (YYYY-MM-DD). If product_name doesn't exist, product will be created.</p>
      </div>
    </div>
  );
}