import React from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import CustomerMenuCard from './CustomerMenuCard';

export default function CustomerMenuList({ menus, loading, onView }) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f8fafc" />
        <Text style={styles.loadingText}>CARGANDO MENÚ...</Text>
      </View>
    );
  }

  if (!Array.isArray(menus) || menus.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No hay menús disponibles</Text>
        <Text style={styles.emptySubtitle}>
          Revisa que el backend esté devolviendo registros en el endpoint de menús.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={menus}
      keyExtractor={(item) => item._id || item.id || String(Math.random())}
      renderItem={({ item }) => <CustomerMenuCard menu={item} onView={onView} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 60 
  },
  loadingText: { 
    marginTop: 16, 
    fontSize: 10, 
    color: 'rgba(209, 213, 219, 0.8)', 
    letterSpacing: 3.5 
  },
  emptyContainer: { 
    margin: 20, 
    padding: 32, 
    borderRadius: 32, 
    borderWidth: 1, 
    borderColor: 'rgba(248, 250, 252, 0.2)', 
    borderStyle: 'dashed', 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    alignItems: 'center' 
  },
  emptyTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#f8fafc' 
  },
  emptySubtitle: { 
    marginTop: 8, 
    fontSize: 14, 
    color: 'rgba(209, 213, 219, 0.7)', 
    textAlign: 'center' 
  },
  listContent: { 
    padding: 8 
  }
});

CustomerMenuList.propTypes = {
  menus: PropTypes.array,
  loading: PropTypes.bool,
  onView: PropTypes.func.isRequired,
};