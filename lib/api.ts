import axios from "axios";

const api = axios.create({
  baseURL: "https://sportlink-api.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function register({ nome, email, senha }: { nome: string; email: string; senha: string }) {
  const response = await api.post("usuarios/", { nome, email, senha });
  return response.data;
}

export async function login({ email, senha }: { email: string; senha: string }) {
  const response = await api.post("usuarios/login/", { email, senha });
  return response.data;
}

export default api;
