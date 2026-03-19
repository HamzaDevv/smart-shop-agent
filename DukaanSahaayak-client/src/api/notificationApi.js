import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getUdhaarNotifications = () => axios.get(`${BASE_URL}/api/notifications/`);
