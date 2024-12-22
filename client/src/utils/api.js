import axios from "axios";


export const api = axios.create({
  baseURL: "https://chat-app-server-pzli.onrender.com/",
  withCredentials: true
});