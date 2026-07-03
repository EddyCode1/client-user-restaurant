import { 
    getBeveragesByRestaurant as getBeveragesByRestaurantRequest,
    getBeverageById as getBeverageByIdRequest,
    searchBeveragesByName as searchBeveragesByNameRequest
} from "../api/beverageApi.js"; // Asegúrate de que este archivo llame a axiosClient

export const getBeveragesByRestaurantService = async (restaurantId) => {
    try {
        const response = await getBeveragesByRestaurantRequest(restaurantId);
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Error al obtener bebidas";
    }
};

export const getBeverageByIdService = async (id) => {
    try {
        const response = await getBeverageByIdRequest(id);
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Error al obtener bebida";
    }
};

export const searchBeveragesByNameService = async (restaurantId, name) => {
    try {
        const response = await searchBeveragesByNameRequest(restaurantId, name);
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Error al buscar bebidas";
    }
};

export default {
    getBeveragesByRestaurantService,
    getBeverageByIdService,
    searchBeveragesByNameService
};