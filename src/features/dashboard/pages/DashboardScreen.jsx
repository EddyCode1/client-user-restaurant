import React from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { width, height: screenHeight } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

const galleryImages = [
  { id: 1, source: require('../../../../assets/imagen_loby1.jpg') },
  { id: 2, source: require('../../../../assets/imagen_loby2.jpg') },
  { id: 3, source: require('../../../../assets/imagen_loby3.jpg') },
  { id: 4, source: require('../../../../assets/imagen_loby4.jpg') },
  { id: 5, source: require('../../../../assets/imagen_loby5.jpg') },
  { id: 6, source: require('../../../../assets/imagen_loby6.jpg') },
];

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.scroll} bounces={false}>
      <View style={styles.heroContainer}>
        <ImageBackground
          source={{ uri: 'https://static.wixstatic.com/media/00fb00_858f44146f614385a542ac5de52678a4~mv2.jpg/v1/fill/w_980,h_653,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/00fb00_858f44146f614385a542ac5de52678a4~mv2.jpg' }}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay} />
          <View style={styles.content}>
            <Text style={styles.title}>Omakase</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Restaurants')}
            >
              <Text style={styles.buttonText}>EXPLORAR RESTAURANTES</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.gallerySection}>
        <Text style={styles.galleryTitle}>GALERÍA</Text>
        <Text style={styles.gallerySubtitle}>Descubre nuestros espacios</Text>
        <View style={styles.galleryGrid}>
          {galleryImages.map((img, index) => {
            const isLarge = index % 3 === 0;
            return (
              <View
                key={img.id}
                style={[
                  styles.imageWrapper,
                  isLarge && styles.imageWrapperLarge,
                ]}
              >
                <Image
                  source={img.source}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#000',
  },
  heroContainer: {
    height: screenHeight,
  },
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
    fontFamily: 'Courier',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
  },
  gallerySection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  galleryTitle: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3.5,
    marginBottom: 8,
  },
  gallerySubtitle: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 24,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageWrapper: {
    width: COLUMN_WIDTH,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageWrapperLarge: {
    width: width - 40,
    height: 240,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
});
