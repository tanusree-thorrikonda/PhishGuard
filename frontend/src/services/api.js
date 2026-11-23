import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const scanUrl = async (url) => {
  const response = await API.post("/api/scan", { url });
  return response.data;
};

export const getScanById = async (scanId) => {
  const response = await API.get(`/api/scan/${scanId}`);
  return response.data;
};

export const getScanHistory = async () => {
  const response = await API.get("/api/history");
  return response.data;
};

export const getScanStats = async () => {
  const response = await API.get("/api/stats");
  return response.data;
};
