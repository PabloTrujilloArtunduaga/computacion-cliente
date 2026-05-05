// src/utils/api.js

export const fetchConToken = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      ...options.headers
    }
  });

  // 👉 manejo básico de errores global
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    window.location.href = "/login";
  }

  return res;
};