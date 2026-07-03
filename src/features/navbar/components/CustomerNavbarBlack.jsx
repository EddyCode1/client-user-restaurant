import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const menuItems = [
  { id: 1, label: 'Restaurantes', path: 'Restaurants' },
  { id: 2, label: 'Mapa General', path: 'MapaGeneral' },
  { id: 3, label: 'Mesas', path: 'Tables' },
  { id: 4, label: 'Reservaciones', path: 'Reservations' },
  { id: 5, label: 'Menú', path: 'Menu' },
  { id: 6, label: 'Perfil', path: 'Profile' },
  { id: 7, label: 'Orders', path: 'Orders' },
];

const NAVBAR_TITLE = 'CONOZCA NUESTRAS RAMAS';

const CustomerNavbarBlack = ({ isSidebarOpen = true, onToggleSidebar }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.navContainer}>
        {/* Botón toggle */}
        <TouchableOpacity 
          onPress={onToggleSidebar} 
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>{isSidebarOpen ? '⟨' : '⟩'}</Text>
        </TouchableOpacity>

        <Text style={styles.navTitle}>{NAVBAR_TITLE}</Text>
      </View>

      {/* Menú horizontal */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            onPress={() => navigation.navigate(item.path)}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    backgroundColor: '#000', 
    borderBottomWidth: 1, 
    borderColor: '#374151', 
    paddingVertical: 20, 
    paddingHorizontal: 15 
  },
  navContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20 
  },
  toggleButton: { 
    position: 'absolute', 
    left: 0, 
    width: 40, 
    height: 40, 
    borderRadius: 8, 
    backgroundColor: '#1f2937', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#9ca3af'
  },
  toggleText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  navTitle: { color: '#9ca3af', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  menuContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    gap: 15 
  },
  menuItem: { padding: 5 },
  menuText: { color: '#e5e7eb', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }
});

export default CustomerNavbarBlack;