import axios from "axios";
import { cookies } from "next/headers";

const instance = axios.create({
  baseURL: "http://localhost:5000/v1",
  withCredentials: true,
});

export default instance;
