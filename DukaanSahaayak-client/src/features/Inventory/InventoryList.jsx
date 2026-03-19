/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../api/productApi";
import { Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function InventoryList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    price_purchase: "",
    price_sale: "",
    quantity: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/products/`, {
        ...newProduct,
        price_purchase: parseFloat(newProduct.price_purchase),
        price_sale: parseFloat(newProduct.price_sale),
        quantity: parseFloat(newProduct.quantity),
      });
      setShowForm(false);
      setNewProduct({
        product_name: "",
        price_purchase: "",
        price_sale: "",
        quantity: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-emerald-700 font-medium animate-pulse">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-emerald-700"
        >
          Inventory List
        </motion.h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className=" overflow-hidden shadow border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">Product Name</th>
                <th className="px-4 py-3 border">Purchase Price</th>
                <th className="px-4 py-3 border">Sale Price</th>
                <th className="px-4 py-3 border">Quantity</th>
                {/* <th className="px-4 py-3 border text-center">Actions</th> */}
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-500">
                      No products available.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <motion.tr
                      key={product.product_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`transition ${
                        product.quantity < 5
                          ? "bg-red-50"
                          : "hover:bg-emerald-50"
                      }`}
                    >
                      <td className="border px-4 py-2">{product.product_id}</td>
                      <td className="border px-4 py-2">
                        {product.product_name}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{Math.floor(product.price_purchase * 100) / 100}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{product.price_sale}
                      </td>
                      <td className="border px-4 py-2">{product.quantity}</td>
                      {/* <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(product.product_id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 mx-auto"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </td> */}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
            >
              <h3 className="text-xl font-semibold text-emerald-700 mb-4">
                Add New Product
              </h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.product_name}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      product_name: e.target.value,
                    })
                  }
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Purchase Price"
                  value={newProduct.price_purchase}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price_purchase: e.target.value,
                    })
                  }
                  onWheel={(e) => e.target.blur()}
                  step="any"
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Sale Price"
                  value={newProduct.price_sale}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price_sale: e.target.value })
                  }
                  onWheel={(e) => e.target.blur()}
                  step="any"
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, quantity: e.target.value })
                  }
                  onWheel={(e) => e.target.blur()}
                  step="any"
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
