import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const createSale = (saleData) => axios.post(`${BASE_URL}/api/sales/`, saleData);
