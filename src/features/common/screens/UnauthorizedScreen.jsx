import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * UnauthorizedScreen
 * Pantalla de error 403 - Acceso denegado
 */
const UnauthorizedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Text style={styles.title}>403</Text>
        <Text style={styles.subtitle}>No autorizado</Text>
        <Text style={styles.description}>No tienes permiso para acceder a esta sección.</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 20,
    color: '#ffffff',
    marginTop: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#A1A1AA',
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#e67e22',
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default UnauthorizedScreen;