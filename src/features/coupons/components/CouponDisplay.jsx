import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * CouponDisplay
 * Visualización estática de los detalles de un cupón para el usuario final
 */
const CouponDisplay = ({ coupon }) => {
  if (!coupon) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Cupón</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Código:</Text>
        <Text style={styles.value}>{coupon.code}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.value}>{coupon.description}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Descuento:</Text>
        <Text style={styles.value}>
          {coupon.discount_type === 'percentage' 
            ? `${coupon.discount_value}%` 
            : `$${coupon.discount_value}`}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Vence el:</Text>
        <Text style={styles.value}>{new Date(coupon.expiration_date).toLocaleDateString()}</Text>
      </View>

      {coupon.min_order_amount && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Compra mínima:</Text>
          <Text style={styles.value}>${coupon.min_order_amount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#18181B', borderRadius: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 15 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: '#A1A1AA', fontSize: 14 },
  value: { color: '#ffffff', fontSize: 14, fontWeight: '600' }
});

export default CouponDisplay;