export const asId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value?._id || value?.id || value?.Orders_id || '';
};

export const formatDateTime = (value) => {
  if (!value) return 'Sin fecha';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  // En React Native, toLocaleString funciona igual, 
  // pero puedes ajustar el formato si el dispositivo lo requiere.
  return date.toLocaleString('es-ES');
};

export const extractDetalleList = (resp) => {
  if (!resp) return [];
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp?.data)) return resp.data;
  if (Array.isArray(resp?.detallePedidos)) return resp.detallePedidos;
  return [];
};

export const getInvoiceStatusLabel = (status) => {
  const normalized = String(status || 'pendiente').toLowerCase();
  if (normalized === 'pagada') return 'Pagada';
  if (normalized === 'cancelada') return 'Cancelada';
  if (normalized === 'emitida') return 'Emitida';
  return 'Pendiente';
};