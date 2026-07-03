import { create } from "zustand";
import {
    getBeveragesByRestaurantService,
    getBeverageByIdService,
    searchBeveragesByNameService
} from "../services/beverageService.js";
import { Alert } from "react-native";

const normalizeBeverageList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.beverages)) return payload.beverages;
    return [];
};

export const useBeverageStore = create((set, get) => ({
    // State
    beverages: [],
    currentBeverage: null,
    loading: false,
    error: null,
    filters: {
        search: '',
        restaurant: null,
        type: null,
    },

    // Setters básicos
    setBeverages: (beverages) => set({ beverages }),
    setLoading: (loading) => set({ loading }),
    setFilters: (filters) =>
        set((state) => ({
            filters: { ...state.filters, ...filters },
        })),

    // Async Actions (Solo Lectura)
    fetchBeveragesByRestaurant: async (restaurantId) => {
        try {
            set({ loading: true, error: null });
            const response = await getBeveragesByRestaurantService(restaurantId);
            const beverages = normalizeBeverageList(response);
            set({ beverages, loading: false });
            return { success: true, data: beverages };
        } catch (err) {
            const message = err || "Error al cargar bebidas";
            set({ error: message, loading: false, beverages: [] });
            Alert.alert("Error", message);
            return { success: false, error: message };
        }
    },

    fetchBeverageById: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await getBeverageByIdService(id);
            set({ currentBeverage: response, loading: false });
            return { success: true, data: response };
        } catch (err) {
            const message = err || "Error al cargar bebida";
            set({ error: message, loading: false });
            Alert.alert("Error", message);
            return { success: false, error: message };
        }
    },

    searchBeverages: async (restaurantId, searchTerm) => {
        try {
            set({ loading: true, error: null });
            const response = await searchBeveragesByNameService(restaurantId, searchTerm);
            const beverages = normalizeBeverageList(response);
            set({
                beverages,
                filters: { ...get().filters, search: searchTerm },
                loading: false,
            });
            return { success: true, data: beverages };
        } catch (err) {
            const message = err || "Error al buscar bebidas";
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // Getters
    getFilteredBeverages: () => {
        const state = get();
        let filtered = state.beverages;

        if (state.filters.search) {
            filtered = filtered.filter((b) =>
                (b.name || '').toLowerCase().includes(state.filters.search.toLowerCase())
            );
        }

        if (state.filters.type) {
            filtered = filtered.filter((b) => b.type === state.filters.type);
        }

        // Cliente solo ve lo disponible
        return filtered.filter((b) => b.available);
    },
}));

export default useBeverageStore;