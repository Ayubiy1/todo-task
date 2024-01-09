import axios from "axios";
import React from "react";

export const api = axios.create({
  baseURL: "https://todo-task-4qt6.onrender.com/",
  timeout: 30 * 1000,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${this.getToken()}`,
  },
});

export const ContextApi = React.createContext(api);
