import axios from "axios";
import { baseURL } from "../baseUrls";

const globalApi = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default globalApi;