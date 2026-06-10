import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // baseURL: "http://localhost:5000/api",
});

export const loginUser = async (data) =>
  await API.post("/auth/login", data);

export const getPlayer = async (id) =>
  await API.get(`/player/${id}`);

export const submitDailyReport = async (data) =>
  await API.post("/daily-report/create", data);

export const fetchAllWellnessReport = async (playerId) => {
  console.log("pooooo", playerId);

  return await API.get(`/daily-report/dailywellnessrprt/${playerId}`);
};