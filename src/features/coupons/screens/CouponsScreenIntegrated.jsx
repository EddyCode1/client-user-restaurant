import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useCoupons } from '../hooks/index.js';
import CouponList from '../components/CouponList.jsx';

const CouponsScreenIntegrated = () => {
  const { coupons, loading, fetchCoupons } = useCoupons();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const filteredCoupons = useMemo(() => {
    if (!searchText) return coupons;
    const term = searchText.toLowerCase();
    return (coupons || []).filter((c) => {
      const code = String(c?.code || '').toLowerCase();
      const description = String(c?.description || '').toLowerCase();
      return code.includes(term) || description.includes(term);
    });
  }, [coupons, searchText]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Cupones</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar cupón..."
          placeholderTextColor="#71717A"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <CouponList coupons={filteredCoupons} loading={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  header: { padding: 20, backgroundColor: '#09090B' },
  title: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 15 },
  searchBar: {
    backgroundColor: '#18181B',
    borderRadius: 12,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default CouponsScreenIntegrated;
