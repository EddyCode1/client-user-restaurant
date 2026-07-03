import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CustomerLobbyScreen = () => {
  const navigation = useNavigation();
  const backgroundImage = { uri: 'https://static.wixstatic.com/media/00fb00_858f44146f614385a542ac5de52678a4~mv2.jpg' };

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      {/* Capa de oscurecimiento (overlay) */}
      <View style={styles.overlay} />

      {/* Bloque central */}
      <View style={styles.content}>
        <Text style={styles.title}>Omakase</Text>
        
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Menu')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>VER MENÚ</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.52)', // Combinación del gradiente original + capa negra
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  title: {
    color: '#FFF',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  button: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // Sombra para Android
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  }
});

export default CustomerLobbyScreen;