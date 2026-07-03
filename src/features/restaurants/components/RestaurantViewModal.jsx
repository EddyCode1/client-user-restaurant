import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_RESTAURANT_KEY = 'customer:lastRestaurant';

export default function RestaurantViewModal({ isOpen, onClose, restaurant }) {
  const navigation = useNavigation();

  if (!restaurant) return null;

  const name = restaurant.restaurant_name || restaurant.name || 'SIN NOMBRE';
  const address = restaurant.restaurant_direction || restaurant.address || '';
  const images = restaurant.restaurant_images || [];
  const id = restaurant._id || restaurant.id;

  const setLastRestaurant = async () => {
    await AsyncStorage.setItem(
      LAST_RESTAURANT_KEY,
      JSON.stringify({ id, name, ts: Date.now() })
    );
  };

  const handlePress = async (action, route, useStorage = false) => {
    if (useStorage) await setLastRestaurant();
    onClose();
    navigation.navigate(route, { restaurantId: id }); // Ajusta según tus nombres de ruta
  };

  return (
    <Modal visible={isOpen} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>CERRAR</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>VISTA DE RESTAURANTE</Text>
            <Text style={styles.title}>{name.toUpperCase()}</Text>
            {address ? <Text style={styles.address}>{address}</Text> : null}

            <View style={styles.menuGrid}>
              <TouchableOpacity onPress={() => handlePress(null, 'RestaurantMenu')}>
                <Text style={styles.menuItem}>MENÚ RESTAURANTE</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePress(null, 'RestaurantOrders', true)}>
                <Text style={styles.menuItem}>ORDEN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePress(null, 'TableLayout')}>
                <Text style={styles.menuItem}>DISTRIBUCIÓN MESAS</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePress(null, 'Reviews')}>
                <Text style={styles.menuItem}>RESEÑAS</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePress(null, 'CreateReservation', true)}>
                <Text style={styles.menuItem}>RESERVACIONES</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePress(null, 'Map', true)}>
                <Text style={styles.menuItem}>VER EN MAPA</Text>
              </TouchableOpacity>
            </View>

            {images[0] ? (
              <Image source={{ uri: images[0] }} style={styles.image} />
            ) : (
              <View style={styles.noImage}><Text style={styles.noImageText}>ALTA COCINA</Text></View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0a0a0a', padding: 30, borderRadius: 0, borderWidth: 1, borderColor: '#27272a' },
  closeButton: { position: 'absolute', top: 20, right: 20 },
  closeText: { fontSize: 10, letterSpacing: 2, color: '#a1a1aa' },
  subtitle: { fontSize: 10, letterSpacing: 2, color: '#a1a1aa', marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  address: { fontSize: 14, color: '#a1a1aa', marginBottom: 30, maxWidth: 300 },
  menuGrid: { gap: 20, marginBottom: 30 },
  menuItem: { fontSize: 16, fontWeight: 'bold', color: '#fff', textDecorationLine: 'underline', letterSpacing: 1 },
  image: { width: '100%', height: 200, opacity: 0.8 },
  noImage: { width: '100%', height: 160, borderWidth: 1, borderColor: '#27272a', alignItems: 'center', justifyContent: 'center' },
  noImageText: { fontSize: 10, letterSpacing: 2, color: '#52525b' }
});