import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/admin",
});

export default API