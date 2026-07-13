import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import bankingClient from "./bankingClient";
import authClient from "./authClient";
import { useAuthStore } from "../store/authStore";

function attachAuthHeader(client) {
    client.interceptors.request.use((config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data?.constructor?.name === "FormData") {
            delete config.headers["Content-Type"];
        }
        return config;
    });
    return client;
}

const publicClient = attachAuthHeader(
    axios.create({
        baseURL: ENDPOINTS.API,
        timeout: 10000, // 10 segundos timeout para evitar requests indefinidas
        headers: { "Content-Type": "application/json" },
    }),
);

const adminClient = publicClient;

export { bankingClient, publicClient, authClient };
export default adminClient;
