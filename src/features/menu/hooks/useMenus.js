import { useState, useCallback } from 'react';
import adminClient from '../../../shared/api/adminClient.js';

/**
 * Hook para obtener menús del servidor.
 * Reutilizable en cualquier pantalla de Cliente.
 */
export function useMenus() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminClient.get('/menu');
      
      // Adaptamos la lógica de datos según la estructura que retorna tu API
      const data = response.data?.data || response.data;
      setMenus(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching menus:', e);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { menus, fetchMenus, loading };
}

export default useMenus;