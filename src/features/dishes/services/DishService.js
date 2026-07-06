import apiClient from '../../../shared/api/apiClient';

const normalizeMenus = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const extractDishes = (menus) =>
  menus.flatMap((menu) => {
    const dishes = menu?.dishes || menu?.Dishes || menu?.platos || [];
    return Array.isArray(dishes) ? dishes : [];
  });

export const getDishesByRestaurantService = async (restaurantId) => {
  const response = await apiClient.get('/menu', {
    params: restaurantId ? { restaurant_id: restaurantId } : {},
  });
  return extractDishes(normalizeMenus(response.data));
};

export const getDishByIdService = async (id) => {
  const response = await apiClient.get('/menu');
  const dishes = extractDishes(normalizeMenus(response.data));
  return (
    dishes.find((dish) => String(dish?._id || dish?.id) === String(id)) || {
      _id: id,
      name: 'Plato',
    }
  );
};

export default {
  getDishesByRestaurantService,
  getDishByIdService,
};
