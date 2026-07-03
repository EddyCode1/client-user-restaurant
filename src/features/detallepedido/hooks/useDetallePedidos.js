import { useCallback } from "react";
import useDetallePedidoStore from "../store/useDetallePedidoStore.js";

// Hook para consultar detalles de un pedido específico del cliente
export const useDetallePedidosByOrder = (orderId = null) => {
    const { detallePedidos, loading, error, fetchDetallePedidosByOrder, setFilters } = useDetallePedidoStore();

    const handleFetchByOrder = useCallback(async () => {
        if (!orderId) return;
        setFilters({ orderId });
        return await fetchDetallePedidosByOrder(orderId);
    }, [fetchDetallePedidosByOrder, orderId, setFilters]);

    return {
        detallePedidos,
        loading,
        error,
        fetchDetallePedidosByOrder: handleFetchByOrder,
    };
};

// Hook para validar y guardar cambios en el detalle del pedido (solo validaciones de negocio)
export const useSaveDetallePedido = (detallePedidoId = null) => {
    const { saveDetallePedido, loading, error } = useDetallePedidoStore();

    const handleSave = useCallback(
        async (formData) => {
            // Validaciones de negocio (comunes para cliente y admin)
            if (!formData?.producto || !["dish", "beverage"].includes(formData?.productType)) {
                return { success: false, error: "Producto o tipo de producto inválido" };
            }
            if (!formData?.candidadproducto || Number(formData.candidadproducto) < 1) {
                return { success: false, error: "La cantidad debe ser mayor a 0" };
            }

            return await saveDetallePedido(formData, detallePedidoId);
        },
        [saveDetallePedido, detallePedidoId]
    );

    return {
        handleSave,
        loading,
        error
    };
};
