import { useEffect, useState } from "react";
import {
  getPurchaseUdhaar,
  clearPurchaseUdhaar,
  sendPurchaseUdhaarSms,
} from "../../api/udhaarApi";
import { Link } from "react-router-dom";
import { CheckCircle2, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function ViewPurchaseUdhaar() {
  const [udhaarList, setUdhaarList] = useState([]);

  const fetchUdhaar = async () => {
    try {
      const response = await getPurchaseUdhaar();
      setUdhaarList(response.data);
    } catch (error) {
      console.error("Failed to load purchase udhaar:", error);
    }
  };

  const handleClear = async (udhar_id) => {
    try {
      await clearPurchaseUdhaar(udhar_id);
      fetchUdhaar();
    } catch (error) {
      console.error("Failed to clear purchase udhaar:", error);
    }
  };

  const handleSendSms = async (udhar_id) => {
    try {
      await sendPurchaseUdhaarSms(udhar_id);
      alert("SMS sent successfully!");
    } catch (error) {
      console.error("Failed to send SMS:", error);
      alert("Failed to send SMS");
    }
  };

  useEffect(() => {
    fetchUdhaar();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-emerald-700 mb-6"
      >
        Vendor Payable
      </motion.h2>

      {udhaarList.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">
          No outstanding purchases.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {udhaarList.map((entry, index) => (
            <motion.div
              key={entry.udhar_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 shadow p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Udhaar ID: #{entry.udhar_id}
                  </h3>
                  <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <strong>Purchase:</strong>{" "}
                  <Link
                    to={`/purchase/${entry.purch_id}`}
                    className="text-emerald-600 hover:underline"
                  >
                    View Purchase
                  </Link>
                </div>

                <div className="text-sm text-gray-600">
                  <strong>Date of Entry:</strong> {entry.date_of_entry}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Payment Due:</strong> {entry.date_of_payment}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleClear(entry.udhar_id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md flex items-center justify-center gap-2 transition"
                >
                  <CheckCircle2 size={18} /> Clear Udhaar
                </button>
                <button
                  onClick={() => handleSendSms(entry.udhar_id)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md flex items-center justify-center gap-2 transition"
                >
                  <Bell size={18} /> Send SMS
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
