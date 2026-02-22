import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import AddSale from "./pages/AddSale";
import ProductTable from "./pages/ProductTable";
import Simulation from "./pages/Simulation";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">

        {/* ================= NAVBAR ================= */}
        <nav className="bg-gray-900 text-white px-8 py-4 flex gap-8 shadow-md">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "font-bold text-blue-400" : "hover:text-gray-300"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/add-product"
            className={({ isActive }) =>
              isActive ? "font-bold text-blue-400" : "hover:text-gray-300"
            }
          >
            Add Product
          </NavLink>

          <NavLink
            to="/add-sale"
            className={({ isActive }) =>
              isActive ? "font-bold text-blue-400" : "hover:text-gray-300"
            }
          >
            Add Sale
          </NavLink>
          <NavLink
            to="/products"
          >Products</NavLink>

          <NavLink to="/simulation">Simulation</NavLink>

        </nav>

        {/* ================= PAGE CONTENT ================= */}
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-sale" element={<AddSale />} />
            <Route path="/products" element={<ProductTable />} />
            <Route path="/simulation" element={<Simulation />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}