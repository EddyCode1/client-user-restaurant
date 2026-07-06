import apiClient from '../../../shared/api/apiClient';

const normalizeMenus = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const extractBeverages = (menus) =>
  menus.flatMap((menu) => {
    const beverages = menu?.beverages || menu?.Beverages || menu?.bebidas || [];
    return Array.isArray(beverages) ? beverages : [];
  });

export const getBeveragesByRestaurant = async (restaurantId) => {
  const response = await apiClient.get('/menu', {
    params: restaurantId ? { restaurant_id: restaurantId } : {},
  });
  return extractBeverages(normalizeMenus(response.data));
};

export const getBeverageById = async (id) => {
  const response = await apiClient.get('/menu');
  const beverages = extractBeverages(normalizeMenus(response.data));
  return (
    beverages.find((item) => String(item?._id || item?.id) === String(id)) || {
      _id: id,
      name: 'Bebida',
    }
  );
};

export const searchBeveragesByName = async (restaurantId, name) => {
  const beverages = await getBeveragesByRestaurant(restaurantId);
  const term = String(name || '').trim().toLowerCase();
  if (!term) return beverages;
  return beverages.filter((item) =>
    String(item?.name || item?.nombre || '').toLowerCase().includes(term),
  );
};

export default {
  getBeveragesByRestaurant,
  getBeverageById,
  searchBeveragesByName,
};
