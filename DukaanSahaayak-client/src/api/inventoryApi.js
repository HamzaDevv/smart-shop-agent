import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const updateInventoryQuantity = (productName, quantity) => {
    return axios.put(`${BASE_URL}/api/products/${encodeURIComponent(productName)}`, {
        quantity: quantity
    });
}
