import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Pantalla de Dashboard - Menú Principal (Hero)
 */
export default function DashboardScreen({ navigation }) {
  return (
    <ImageBackground
      source={{ uri: 'https://static.wixstatic.com/media/00fb00_858f44146f614385a542ac5de52678a4~mv2.jpg/v1/fill/w_980,h_653,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/00fb00_858f44146f614385a542ac5de52678a4~mv2.jpg' }}
      style={styles.backgroundImage}
    >
      {/* Overlay oscuro */}
      <View style={styles.overlay} />

      {/* Contenido centrado */}
      <View style={styles.content}>
        <Text style={styles.title}>Omakase</Text>

        {/* Botón de Reserva */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Restaurants')} // Asegúrate de que coincida con tu Stack.Screen name
        >
          <Text style={styles.buttonText}>EXPLORAR RESTAURANTES</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 24,
  },
  title: {
    color: '#fff',
    fontSize: 60,
    fontWeight: '800',
    letterSpacing: -1,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 0,
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Courier', // Aproximación a font-mono
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
  },
});