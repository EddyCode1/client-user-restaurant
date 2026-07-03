import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import CouponCard from './CouponCard';

/**
 * CouponList
 * Componente para renderizar la lista de cupones disponibles para el cliente.
 */
const CouponList = ({ coupons, loading }) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!coupons || coupons.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No hay cupones disponibles en este momento.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={coupons}
      keyExtractor={(item) => item._id || item.id}
      renderItem={({ item }) => <CouponCard coupon={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyText: {
    color: '#71717A',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CouponList;
