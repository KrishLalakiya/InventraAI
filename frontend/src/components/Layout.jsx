export default function Layout({ children, setActivePage }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">AI Inventory</h2>
        <ul className="space-y-4">
          <li 
            className="hover:text-gray-300 cursor-pointer"
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </li>

          <li 
            className="hover:text-gray-300 cursor-pointer"
            onClick={() => setActivePage("inventory")}
          >
            Inventory
          </li>

          <li 
            className="hover:text-gray-300 cursor-pointer"
            onClick={() => setActivePage("analytics")}
          >
            Analytics
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>

    </div>
  );
}