import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";

import Navbar from "../components/Navbar";

const InventoryList = lazy(() => import("../features/Inventory/InventoryList"));
const CreateBill = lazy(() => import("../features/Billing/CreateBill"));

const ViewSalesUdhaar = lazy(() =>
  import("../features/Udhaar/ViewSalesUdhaar")
);
const ViewPurchaseUdhaar = lazy(() =>
  import("../features/Udhaar/ViewPurchaseUdhaar")
);

const Chat = lazy(() => import("../features/Chat/Chat"));

const SaleDetails = lazy(() => import("../pages/SaleDetails"));
const PurchaseDetails = lazy(() => import("../pages/PurchaseDetails"));
const Dashboard = lazy(() => import("../pages/Dashboard"));

const NotFound = () => (
  <div className="text-center text-gray-500 mt-20 text-xl">
    404 – Page Not Found
  </div>
);

export default function AppRoutes() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 w-screen">
        {/* Navbar */}
        <header className="sticky top-0 z-10 w-full">
          <Navbar />
        </header>

        <main className="flex-1 overflow-x-auto p-4 sm:p-6 w-full">
          <Suspense
            fallback={<div className="text-gray-400 mt-10">Loading...</div>}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/inventory" />} />
              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/billing" element={<CreateBill />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/udhaar/sales" element={<ViewSalesUdhaar />} />
              <Route
                path="/udhaar/purchases"
                element={<ViewPurchaseUdhaar />}
              />
              <Route path="/sale/:saleId" element={<SaleDetails />} />
              <Route
                path="/purchase/:purchaseId"
                element={<PurchaseDetails />}
              />
              <Route path="/chat" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}
