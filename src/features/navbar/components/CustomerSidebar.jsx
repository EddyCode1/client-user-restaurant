import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../shared/store/authStore';
import logoRestaurant from '../../../../assets/logo.png';

const SIDEBAR_WIDTH = 288;

const CustomerSidebar = ({ isOpen = true }) => {
  const navigation = useNavigation();
  const { logout, user } = useAuthStore();
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, translateX]);

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const isTabScreen = (path) =>
    ['CustomerHome', 'Restaurants', 'Menu', 'Orders', 'Reservations', 'Coupons'].includes(path);

  const menuLinks = [
    { label: 'Menú Principal', path: 'CustomerHome' },
    { label: 'Restaurantes', path: 'Restaurants' },
    { label: 'Mapa General', path: 'MapaGeneral' },
    { label: 'Mesas', path: 'TableLayout' },
    { label: 'Menú', path: 'Menu' },
    { label: 'Cupones', path: 'Coupons' },
    { label: 'Órdenes', path: 'Orders' },
    { label: 'Factura', path: 'Factura' },
    { label: 'Reservaciones', path: 'Reservations' },
  ];

  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={logoRestaurant} style={styles.logo} />
        </View>
        <Text style={styles.title}>Restaurantes</Text>
        <Text style={styles.subtitle}>Panel de Cliente</Text>
      </View>

      <ScrollView style={styles.nav} contentContainerStyle={styles.navContent}>
        {menuLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.link}
            onPress={() => {
              if (isTabScreen(link.path)) {
                navigation.navigate('MainTabs', { screen: link.path });
              } else {
                navigation.navigate(link.path);
              }
            }}
          >
            <Text style={styles.linkText}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.userBox}>
          <Text style={styles.mutedText}>Usuario conectado</Text>
          <Text style={styles.userName} numberOfLines={1}>{user?.nombre || user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#000',
    borderRightWidth: 1,
    borderColor: '#333',
    zIndex: 100,
    elevation: 10,
  },
  header: { padding: 24 },
  logoContainer: { borderRadius: 24, overflow: 'hidden', backgroundColor: '#ffffff10' },
  logo: { width: '100%', height: 192 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 20 },
  subtitle: { fontSize: 14, color: '#aaa', marginTop: 8 },
  nav: { flex: 1, paddingHorizontal: 24 },
  navContent: { paddingBottom: 24 },
  link: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, marginBottom: 12 },
  linkText: { color: '#FFF', fontSize: 16 },
  footer: { padding: 24 },
  userBox: { backgroundColor: '#1a1a1a', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#333' },
  mutedText: { fontSize: 12, color: '#888' },
  userName: { color: '#FFF', fontWeight: 'bold', marginTop: 4 },
  logoutButton: { marginTop: 16, padding: 12, backgroundColor: '#333', borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#FFF', fontWeight: 'bold' }
});

export default CustomerSidebar;
