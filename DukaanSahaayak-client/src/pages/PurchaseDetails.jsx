import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPurchaseById } from "../api/detailsApi";
import {
  FileTextIcon,
  ShoppingCartIcon,
  CalendarDaysIcon,
  PackageIcon,
  IndianRupeeIcon,
  Building2,
} from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function PurchaseDetails() {
  const { purchaseId } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [vendorName, setVendorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPurchaseById(purchaseId)
      .then((res) => {
        setPurchase(res.data);
        setLoading(false);
        if (res.data?.vendor_id) {
          axios
            .get(`${BASE_URL}/api/vendors/${res.data.vendor_id}`)
            .then((vRes) => setVendorName(vRes.data.vendor_name))
            .catch(() => setVendorName(""));
        }
      })
      .catch(() => {
        setError("Failed to load purchase details");
        setLoading(false);
      });
  }, [purchaseId]);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!purchase)
    return <div className="p-8 text-gray-500">No details found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-emerald-700 flex items-center gap-2">
          <FileTextIcon className="w-6 h-6 text-emerald-600" />
          Purchase Details
        </h2>
      </div>

      {/* Detail Cards */}
      <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700">
        <div className="bg-emerald-50 p-4 rounded-lg flex items-center gap-3 shadow-sm">
          <ShoppingCartIcon className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="font-medium">Purchase ID</p>
            <p>#{purchase.purch_id}</p>
          </div>
        </div>

        {vendorName && (
          <div className="bg-emerald-50 p-4 rounded-lg flex items-center gap-3 shadow-sm">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-medium">Vendor Name</p>
              <p>{vendorName}</p>
            </div>
          </div>
        )}

        <div className="bg-emerald-50 p-4 rounded-lg flex items-center gap-3 shadow-sm">
          <CalendarDaysIcon className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="font-medium">Date</p>
            <p>{purchase.transaction_date}</p>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg flex items-center gap-3 shadow-sm">
          <PackageIcon className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="font-medium">Total Quantity</p>
            <p>{purchase.total_quantity}</p>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg flex items-center gap-3 shadow-sm md:col-span-2">
          <IndianRupeeIcon className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="font-medium">Total Amount</p>
            <p>₹{purchase.total_amount}</p>
          </div>
        </div>
      </div>

      {/* Product List */}
      {purchase.products && purchase.products.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-emerald-700 mb-3 flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-emerald-600" />
            Products in Purchase
          </h3>
          <div className="space-y-3">
            {purchase.products.map((product, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm text-sm flex flex-col md:flex-row md:justify-between md:items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {product.product_name}
                  </p>
                  <p className="text-gray-600">
                    Quantity: {product.quantity}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 text-right">
                  <p className="text-gray-600">
                    Purchase: ₹{product.purchase_price}
                  </p>
                  <p className="text-gray-600">
                    Selling: ₹{product.selling_price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
