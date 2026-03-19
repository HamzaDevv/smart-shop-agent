/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSaleById } from "../api/detailsApi";
import {
  ReceiptText,
  CalendarDays,
  User,
  ShoppingCart,
  IndianRupee,
} from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function SaleDetails() {
  const { saleId } = useParams();
  const [sale, setSale] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getSaleById(saleId)
      .then((res) => {
        setSale(res.data);
        setLoading(false);
        if (res.data?.customer_id) {
          axios
            .get(`${BASE_URL}/api/customers/${res.data.customer_id}`)
            .then((cRes) => setCustomerName(cRes.data.customer_name))
            .catch(() => setCustomerName(""));
        }
      })
      .catch(() => {
        setError("Failed to load sale details");
        setLoading(false);
      });
  }, [saleId]);

  if (loading)
    return <div className="p-8 text-gray-500 animate-pulse">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!sale) return <div className="p-8 text-gray-500">No details found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow border border-gray-100">
      {/* Header */}
      <h2 className="text-3xl font-bold text-emerald-700 mb-6 flex items-center gap-2">
        <ReceiptText className="w-6 h-6 text-emerald-600" /> Sale Details
      </h2>

      {/* Details Section */}
      <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700">
        <DetailCard
          label="Sale ID"
          value={sale.sales_id}
          icon={<ReceiptText className="w-5 h-5" />}
        />
        {customerName && (
          <DetailCard
            label="Customer Name"
            value={customerName}
            icon={<User className="w-5 h-5" />}
          />
        )}
        <DetailCard
          label="Date"
          value={sale.transaction_date}
          icon={<CalendarDays className="w-5 h-5" />}
        />
        <DetailCard
          label="Total Quantity"
          value={sale.total_quantity}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <DetailCard
          label="Total Amount"
          value={`₹${sale.total_amount}`}
          icon={<IndianRupee className="w-5 h-5" />}
        />
      </div>

      {/* Product Section */}
      {sale.products && sale.products.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-emerald-700 mb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            Products Sold
          </h3>

          <div className="space-y-3">
            {sale.products.map((p, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm text-sm flex flex-col md:flex-row md:justify-between md:items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {p.product_name}
                  </p>
                  <p className="text-gray-600">Qty: {p.quantity}</p>
                </div>
                <div className="mt-2 md:mt-0 text-right">
                  <p className="text-gray-600">Rate: ₹{p.rate}</p>
                  <p className="text-gray-600">Total: ₹{p.sale_price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({ label, value, icon }) {
  return (
    <div className="bg-emerald-50 p-4 rounded-lg flex items-center gap-3 shadow-sm">
      <div className="text-emerald-600">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
