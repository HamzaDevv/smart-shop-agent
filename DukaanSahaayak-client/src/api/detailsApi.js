import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getSaleById = (saleId) => {
  return axios.get(`${BASE_URL}/api/sales/${saleId}`);
};

export const getPurchaseById = (purchaseId) => {
  return axios.get(`${BASE_URL}/api/purchases/${purchaseId}`);
};
