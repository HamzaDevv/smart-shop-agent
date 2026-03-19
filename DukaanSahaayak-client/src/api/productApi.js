import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getProducts = () => axios.get(`${BASE_URL}/api/products/`);

export const addProduct = (productData) => axios.post(`${BASE_URL}/api/products/`, productData);

export const updateProduct = (productId, updatedData) =>
  axios.put(`${BASE_URL}/api/products/${productId}`, updatedData);

export const deleteProduct = (productId) =>
  axios.delete(`${BASE_URL}/api/products/${productId}`);
