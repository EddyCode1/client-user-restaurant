import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { useCart } from '../hooks/useCart';

export default function CartCheckoutCTA({ restaurantId: routeRestaurantId }) {
  const navigation = useNavigation();
  const { cart, subtotal, restaurantId: cartRestaurantId } = useCart();

  if (cart.length === 0) return null;

  const targetRestaurantId = routeRestaurantId || cartRestaurantId;

  const handlePress = () => {
    navigation.navigate('OrderCreate', {
      ...(targetRestaurantId ? { restaurantId: targetRestaurantId } : {}),
    });
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>
          Ver carrito ({itemCount}) · Q{subtotal.toFixed(2)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

CartCheckoutCTA.propTypes = {
  restaurantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: '#111',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
