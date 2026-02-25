import axios from "axios";
import Cookies from "js-cookie";
export const Myaxios = axios.create({
  baseURL: "https://admin-crm.onrender.com",
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
});
