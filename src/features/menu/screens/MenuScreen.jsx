import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * MenuScreen
 * Pantalla principal del menú de bebidas/comidas
 */
const MenuScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Menú</Text>
        <Text style={styles.description}>
          Esta es la pantalla de menú. La lógica y el diseño serán implementados próximamente.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Asumiendo el tema oscuro del proyecto
    padding: 20,
  },
  content: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#A1A1AA', // Color grisáceo tipo 'muted'
  },
});

export default MenuScreen;