import { useEffect, useState } from "react";
import API from "../api/api";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function Dashboard() {
  const [profitData, setProfitData] = useState(null);
  const [rebalance, setRebalance] = useState([]);
  const [cashflow, setCashflow] = useState(null);
  const [insights, setInsights] = useState([]);

  // ================= BAR CHART DATA =================
  const chartData = profitData
    ? [
        {
          name: "Next 7 Days",
          Revenue: profitData.total_predicted_revenue,
          Profit: profitData.total_predicted_profit,
        },
      ]
    : [];

  // ================= LINE CHART DATA =================
  const trendData = (profitData && profitData.trend) ? profitData.trend : (
    profitData
      ? [
          { day: "Mon", revenue: profitData.total_predicted_revenue * 0.12 },
          { day: "Tue", revenue: profitData.total_predicted_revenue * 0.15 },
          { day: "Wed", revenue: profitData.total_predicted_revenue * 0.18 },
          { day: "Thu", revenue: profitData.total_predicted_revenue * 0.14 },
          { day: "Fri", revenue: profitData.total_predicted_revenue * 0.16 },
          { day: "Sat", revenue: profitData.total_predicted_revenue * 0.13 },
          { day: "Sun", revenue: profitData.total_predicted_revenue * 0.12 }
        ]
      : []
  );

  // ================= PIE CHART DATA =================
  const deadCount = cashflow && Array.isArray(cashflow.dead_stock_products)
    ? cashflow.dead_stock_products.length
    : 0;

  const pieData = cashflow
    ? [
        { name: "Active Stock", value: Math.max(0, 100 - deadCount * 10) },
        { name: "Dead Stock", value: deadCount * 10 }
      ]
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricsRes = await API.get("/analytics/metrics");
        const trendRes = await API.get("/analytics/revenue_trend");
        const rebalanceRes = await API.get("/analytics/rebalance");
        const insightsRes = await API.get("/analytics/insights_nl");
        const cashflowRes = await API.get("/analytics/cashflow_guardian");

        setProfitData({
          total_predicted_revenue: metricsRes.data.total_revenue,
          total_predicted_profit: metricsRes.data.total_profit
        });

        setRebalance(rebalanceRes.data.rebalance_recommendations || []);
        setInsights(insightsRes.data.insights || []);
        setCashflow(cashflowRes.data || null);

        // Replace trend data with real trend when available
        if (trendRes.data && trendRes.data.trend) {
          // transform to expected format for chart
          // we map date -> revenue
          const t = trendRes.data.trend.map((d) => ({ day: d.date, revenue: d.revenue }));
          setProfitData((prev) => ({ ...prev, trend: t }));
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        AI Inventory Dashboard 🚀
      </h1>

      {/* ================= KPI CARDS ================= */}
      {profitData && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">
              Predicted Revenue (7 Days)
            </h2>
            <p className="text-2xl font-bold text-green-600">
              ₹ {profitData.total_predicted_revenue}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">
              Predicted Profit (7 Days)
            </h2>
            <p className="text-2xl font-bold text-blue-600">
              ₹ {profitData.total_predicted_profit}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Total Inventory</h2>
            <p className="text-2xl font-bold text-gray-800">{profitData.total_stock ?? '—'}</p>
          </div>
        </div>
      )}

      {/* ================= REVENUE TREND ================= */}
      {profitData && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">
            Revenue Trend (7 Days)
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => `₹ ${value}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ================= INVENTORY HEALTH ================= */}
      {cashflow && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">
            Inventory Health
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ================= REBALANCE ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Rebalance Alerts
        </h2>

        {rebalance.length === 0 ? (
          <p className="text-gray-500">No alerts</p>
        ) : (
          rebalance.map((item, index) => (
            <div key={index} className="mb-2">
              ⚠️ {item.product} → {item.action}
            </div>
          ))
        )}
      </div>

      {/* ================= INSIGHTS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          AI Insights
        </h2>

        {insights.length === 0 ? (
          <p className="text-gray-500">No insights yet</p>
        ) : (
          insights.map((text, index) => (
            <div key={index} className="mb-2">
              💡 {text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import API from "../api/api";
// import {
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from "recharts";
// export default function Dashboard() {
//   const [profitData, setProfitData] = useState(null);
//   const [rebalance, setRebalance] = useState([]);
//   const [cashflow, setCashflow] = useState(null);
//   const [insights, setInsights] = useState([]);
//   const chartData = profitData
//     ? [
//       {
//         name: "Next 7 Days",
//         Revenue: profitData.total_predicted_revenue,
//         Profit: profitData.total_predicted_profit,
//       },
//     ]
//     : [];
//   const trendData = profitData
//     ? [
//       { day: "Mon", revenue: profitData.total_predicted_revenue * 0.12 },
//       { day: "Tue", revenue: profitData.total_predicted_revenue * 0.15 },
//       { day: "Wed", revenue: profitData.total_predicted_revenue * 0.18 },
//       { day: "Thu", revenue: profitData.total_predicted_revenue * 0.14 },
//       { day: "Fri", revenue: profitData.total_predicted_revenue * 0.16 },
//       { day: "Sat", revenue: profitData.total_predicted_revenue * 0.13 },
//       { day: "Sun", revenue: profitData.total_predicted_revenue * 0.12 }
//     ]
//     : [];
//   const pieData = cashflow
//     ? [
//       { name: "Active Stock", value: 100 - cashflow.dead_stock_products.length * 10 },
//       { name: "Dead Stock", value: cashflow.dead_stock_products.length * 10 }
//     ]
//     : [];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const profitRes = await API.get("/analytics/profit-forecast");
//         const rebalanceRes = await API.get("/analytics/rebalance");
//         const insightsRes = await API.get("/analytics/insights");
//         const cashflowRes = await API.get("/analytics/cashflow");

//         setProfitData(profitRes.data);

//         // IMPORTANT FIX HERE 👇
//         setRebalance(
//           rebalanceRes.data.rebalance_recommendations || []
//         );

//         setInsights(
//           insightsRes.data.ai_insights || []
//         );

//         setCashflow(cashflowRes.data);

//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">
//         AI Inventory Dashboard 🚀
//       </h1>

//       {/* Profit Section */}
//       {profitData && (
//         <div className="grid grid-cols-2 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-xl shadow">
//             <h2 className="text-gray-500">
//               Predicted Revenue (7 Days)
//             </h2>
//             <p className="text-2xl font-bold text-green-600">
//               ₹ {profitData.total_predicted_revenue}
//             </p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow">
//             <h2 className="text-gray-500">
//               Predicted Profit (7 Days)
//             </h2>
//             <p className="text-2xl font-bold text-blue-600">
//               ₹ {profitData.total_predicted_profit}
//             </p>
//           </div>
//         </div>
//       )}

//       {profitData && (
//         <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
//           <h2 className="text-xl font-bold mb-4">
//             Revenue Trend (7 Days)
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={trendData}>
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#3b82f6"
//                 strokeWidth={3}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}

//       {cashflow && (
//         <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
//           <h2 className="text-xl font-bold mb-4">
//             Inventory Health
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 dataKey="value"
//                 outerRadius={100}
//                 fill="#8884d8"
//                 label
//               >
//                 <Cell fill="#22c55e" />
//                 <Cell fill="#ef4444" />
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       )}

//       {/* Rebalance Section */}
//       <div className="bg-white p-6 rounded-xl shadow mb-8">
//         <h2 className="text-xl font-semibold mb-4">
//           Rebalance Alerts
//         </h2>

//         {rebalance.length === 0 ? (
//           <p className="text-gray-500">No alerts</p>
//         ) : (
//           rebalance.map((item, index) => (
//             <div key={index} className="mb-2">
//               ⚠️ {item.product} → {item.action}
//             </div>
//           ))
//         )}
//       </div>


//       {/* Insights Section */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-semibold mb-4">
//           AI Insights
//         </h2>

//         {insights.length === 0 ? (
//           <p className="text-gray-500">No insights yet</p>
//         ) : (
//           insights.map((text, index) => (
//             <div key={index} className="mb-2">
//               💡 {text}
//             </div>
//           ))
//         )}


//       </div>
//     </div>
//   );
// }