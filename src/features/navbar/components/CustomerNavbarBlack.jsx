import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const menuItems = [
  { id: 1, label: 'Restaurantes', path: 'Restaurants', isTab: true },
  { id: 2, label: 'Mapa General', path: 'MapaGeneral', isTab: false },
  { id: 3, label: 'Mesas', path: 'TableLayout', isTab: false },
  { id: 4, label: 'Reservaciones', path: 'Reservations', isTab: true },
  { id: 5, label: 'Menú', path: 'Menu', isTab: true },
  { id: 6, label: 'Órdenes', path: 'Orders', isTab: true },
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
            onPress={() => {
              if (item.isTab) {
                navigation.navigate('MainTabs', { screen: item.path });
              } else {
                navigation.navigate(item.path);
              }
            }}
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