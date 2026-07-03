import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default function CustomerRestaurantCard({ restaurant, onView }) {
  const name = restaurant.restaurant_name || restaurant.name || 'Sin nombre';
  const address = restaurant.restaurant_direction || restaurant.address || '';
  const time = `${restaurant.restaurant_time_start || ''} - ${restaurant.restaurant_time_close || ''}`;
  const price = restaurant.restaurant_mean_price || restaurant.mean_price || '';
  const imageUri = restaurant.restaurant_images?.[0];

  return (
    <View style={styles.card}>
      {/* Imagen */}
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>Sin imagen</Text>
          </View>
        )}
        <View style={styles.gradientOverlay} />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.address} numberOfLines={1}>{address}</Text>

        <View style={styles.row}>
          <Text style={styles.text}>{time}</Text>
          <Text style={styles.price}>{price ? `$${price}` : ''}</Text>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => onView(restaurant)}
        >
          <Text style={styles.buttonText}>Ver detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    overflow: 'hidden',
    marginVertical: 10,
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: { height: 176, backgroundColor: '#9ca3af' },
  image: { width: '100%', height: '100%' },
  noImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noImageText: { color: '#fff', fontStyle: 'italic' },
  gradientOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(156, 163, 175, 0.4)' },
  content: { padding: 20, backgroundColor: '#f8fafc' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  address: { fontSize: 14, color: '#1f2937', marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  text: { fontSize: 14, color: '#1f2937' },
  price: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  button: { 
    marginTop: 16, 
    paddingVertical: 12, 
    borderRadius: 8, 
    backgroundColor: '#6b7280', 
    alignItems: 'center' 
  },
  buttonText: { color: '#f8fafc', fontWeight: 'bold' }
});

CustomerRestaurantCard.propTypes = {
  restaurant: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
};