import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getSalesUdhaar = () => axios.get(`${BASE_URL}/api/udhaar/sales/`);
export const getPurchaseUdhaar = () => axios.get(`${BASE_URL}/api/udhaar/purchases/`);
export const clearSalesUdhaar = (id) => axios.delete(`${BASE_URL}/api/udhaar/sales/${id}`);
export const clearPurchaseUdhaar = (id) => axios.delete(`${BASE_URL}/api/udhaar/purchases/${id}`);
export const sendSalesUdhaarSms = (id) => axios.post(`${BASE_URL}/api/udhaar/sales/${id}/send_sms/`);
export const sendPurchaseUdhaarSms = (id) => axios.post(`${BASE_URL}/api/udhaar/purchases/${id}/send_sms/`);