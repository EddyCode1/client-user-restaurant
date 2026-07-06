import {
  getBeveragesByRestaurant,
  getBeverageById,
  searchBeveragesByName,
} from '../api/beverageApi.js';

export const getBeveragesByRestaurantService = async (restaurantId) => {
  try {
    return await getBeveragesByRestaurant(restaurantId);
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener bebidas';
  }
};

export const getBeverageByIdService = async (id) => {
  try {
    return await getBeverageById(id);
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener bebida';
  }
};

export const searchBeveragesByNameService = async (restaurantId, name) => {
  try {
    return await searchBeveragesByName(restaurantId, name);
  } catch (error) {
    throw error.response?.data?.message || 'Error al buscar bebidas';
  }
};

export default {
  getBeveragesByRestaurantService,
  getBeverageByIdService,
  searchBeveragesByNameService,
};
