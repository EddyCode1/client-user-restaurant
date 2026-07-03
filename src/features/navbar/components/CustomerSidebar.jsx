import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../../shared/stores/useAuthStore';
import logoRestaurant from '../../../shared/assets/img/logo.png';

const CustomerSidebar = ({ isOpen = true }) => {
  const navigation = useNavigation();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    // En React Navigation, la navegación al login suele ser sustituida
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const menuLinks = [
    { label: 'Menú Principal', path: 'CustomerHome' },
    { label: 'Restaurantes', path: 'Restaurants' },
    { label: 'Mapa General', path: 'MapaGeneral' },
    { label: 'Mesas', path: 'Tables' },
    { label: 'Menú', path: 'Menu' },
    { label: 'Cupones', path: 'Coupons' },
    { label: 'Órdenes', path: 'Orders' },
    { label: 'Factura', path: 'Factura' },
    { label: 'Mi Perfil', path: 'Profile' },
  ];

  if (!isOpen) return null;

  return (
    <View style={styles.sidebar}>
      {/* Logo y Encabezado */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={logoRestaurant} style={styles.logo} />
        </View>
        <Text style={styles.title}>Restaurantes</Text>
        <Text style={styles.subtitle}>Panel de Cliente</Text>
      </View>

      {/* Navegación */}
      <ScrollView style={styles.nav} contentContainerStyle={styles.navContent}>
        {menuLinks.map((link, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.link} 
            onPress={() => navigation.navigate(link.path)}
          >
            <Text style={styles.linkText}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Usuario y Logout */}
      <View style={styles.footer}>
        <View style={styles.userBox}>
          <Text style={styles.mutedText}>Usuario conectado</Text>
          <Text style={styles.userName} numberOfLines={1}>{user?.nombre || user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: { width: 288, height: '100%', backgroundColor: '#000', borderRightWidth: 1, borderColor: '#333' },
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