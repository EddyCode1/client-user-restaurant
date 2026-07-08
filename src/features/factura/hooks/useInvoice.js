import { useCallback, useState } from 'react';
import { invoiceService } from '../services/invoiceService';

export const useInvoice = (orderId) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInvoice = useCallback(async () => {
    if (!orderId) {
      setInvoice(null);
      return { success: false, error: 'ID de orden requerido' };
    }

    setLoading(true);
    setError('');

    const result = await invoiceService.getInvoicesByOrder(orderId);

    if (result.success) {
      const [firstInvoice] = result.data || [];
      setInvoice(firstInvoice || null);
      setLoading(false);
      return { success: true, data: firstInvoice || null };
    }

    setInvoice(null);
    setLoading(false);
    setError(result.error);
    return result;
  }, [orderId]);

  return { invoice, loading, error, fetchInvoice };
};

export default useInvoice;
