/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  TrendingUp,
  HandCoins,
  PackageCheck,
  ShoppingCart,
  Boxes,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function StatCard({ label, value, icon, link }) {
  const content = (
    <div className="bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:bg-emerald-50">
      <div className="flex gap-4 items-center">
        <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full">
          {icon}
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {label}
          </div>
          <div className="text-lg font-bold text-emerald-800">{value}</div>
        </div>
      </div>
      {link && <ArrowRight className="text-emerald-600" size={20} />}
    </div>
  );
  return link ? <Link to={link}>{content}</Link> : content;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaySales, setTodaySales] = useState(0);
  const [todaySalesCount, setTodaySalesCount] = useState(0);
  const [profitLossData, setProfitLossData] = useState([]);
  const [salesUdhaarCount, setSalesUdhaarCount] = useState(0);
  const [purchaseUdhaarCount, setPurchaseUdhaarCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];

        const getLast7Dates = () => {
          return Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split("T")[0];
          });
        };

        const [allSalesRes, salesUdhaarRes, purchaseUdhaarRes] =
          await Promise.all([
            axios.get(`${BASE_URL}/api/sales/`),
            axios.get(`${BASE_URL}/api/udhaar/sales/`),
            axios.get(`${BASE_URL}/api/udhaar/purchases/`),
          ]);

        const todaySalesEntries = allSalesRes.data.filter(
          (sale) => sale.transaction_date === today
        );

        setTodaySalesCount(todaySalesEntries.length);
        setTodaySales(
          todaySalesEntries.reduce(
            (acc, sale) => acc + parseFloat(sale.total_amount || 0),
            0
          )
        );

        setSalesUdhaarCount(salesUdhaarRes.data.length || 0);
        setPurchaseUdhaarCount(purchaseUdhaarRes.data.length || 0);

        const dates = getLast7Dates();
        const weeklyProfitLossResponses = await Promise.all(
          dates.map((date) =>
            axios.get(`${BASE_URL}/api/profit-loss/by-date/${date}`)
          )
        );

        const weeklyData = dates.map((date, idx) => {
          const res = weeklyProfitLossResponses[idx];
          const data = Array.isArray(res.data) ? res.data[0] : res.data;
          return {
            date,
            amount: data?.amount || 0,
            is_profit: data?.is_profit || false,
          };
        });

        setProfitLossData(weeklyData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-emerald-800 mb-6">
        🛍️ Store Dashboard
      </h1>

      {loading ? (
        <p className="text-gray-600 animate-pulse">Loading data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <StatCard
              label="Today's Sales"
              value={`₹${todaySales.toFixed(2)}`}
              icon={<TrendingUp />}
            />
            <StatCard
              label="Total Sales Today"
              value={todaySalesCount}
              icon={<PackageCheck />}
            />
            <StatCard
              label="Sales on Udhaar"
              value={salesUdhaarCount}
              icon={<HandCoins />}
              link="/udhaar/sales"
            />
            <StatCard
              label="Purchases on Udhaar"
              value={purchaseUdhaarCount}
              icon={<ShoppingCart />}
              link="/udhaar/purchases"
            />
            <StatCard
              label="Inventory"
              value="View Stock"
              icon={<Boxes />}
              link="/inventory"
            />
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold text-emerald-800 mb-4">
              📈 Profit / Loss - Last 7 Days
            </h2>
            <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={profitLossData.map((d) => ({
                    ...d,
                    day: new Date(d.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                    }),
                    displayAmount: d.is_profit
                      ? `₹${d.amount}`
                      : `-₹${Math.abs(d.amount)}`,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, _, props) =>
                      props?.payload?.displayAmount
                    }
                  />
                  <Legend />
                  <Bar dataKey="amount" name="Net (₹)">
                    {profitLossData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.is_profit ? "#38a169" : "#e53e3e"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
