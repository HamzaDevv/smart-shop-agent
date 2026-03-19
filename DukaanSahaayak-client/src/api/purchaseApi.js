import axios from "axios";


const BASE_URL = import.meta.env.VITE_BACKEND_URL 

export const createPurchase = (purchaseData) =>
  axios.post(`${BASE_URL}/api/purchases/`, purchaseData);
