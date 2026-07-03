import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default function CustomerMenuCard({ menu, onView }) {
  const menuName = menu.Menu_Plate || menu.name || 'Sin nombre';
  const menuDescription = menu.Menu_description_plate || menu.description || 'Sin descripción disponible.';
  const isAvailable = menu.Menu_available ?? menu.available ?? true;

  return (
    <View style={styles.card}>
      {/* Encabezado con degradado simulado */}
      <View style={styles.header}>
        <View style={styles.row}>
          <View style={styles.titleWrapper}>
            <Text style={styles.statusLabel}>Menú disponible</Text>
            <Text style={styles.title}>{menuName}</Text>
          </View>
          
          <View style={[styles.badge, isAvailable ? styles.badgeAvailable : styles.badgeUnavailable]}>
            <Text style={[styles.badgeText, isAvailable ? styles.textAvailable : styles.textUnavailable]}>
              {isAvailable ? 'Disponible' : 'No disponible'}
            </Text>
          </View>
        </View>
      </View>

      {/* Cuerpo */}
      <View style={styles.body}>
        <Text style={styles.description} numberOfLines={4}>
          {menuDescription}
        </Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => onView(menu)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>VER DETALLES</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.1)',
    overflow: 'hidden',
    margin: 8,
  },
  header: {
    padding: 24,
    backgroundColor: '#1f2937', // Color sólido de reemplazo para el gradiente
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleWrapper: { flex: 1, marginRight: 10 },
  statusLabel: { fontSize: 10, fontWeight: '900', color: '#d1d5db', letterSpacing: 3, textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: '900', color: '#f8fafc', marginTop: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  badgeAvailable: { borderColor: 'rgba(52, 211, 153, 0.4)', backgroundColor: 'rgba(52, 211, 153, 0.1)' },
  badgeUnavailable: { borderColor: 'rgba(248, 113, 113, 0.4)', backgroundColor: 'rgba(248, 113, 113, 0.1)' },
  badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  textAvailable: { color: '#a7f3d0' },
  textUnavailable: { color: '#fecaca' },
  body: { padding: 24 },
  description: { fontSize: 14, color: '#d1d5db', lineHeight: 22 },
  button: { 
    marginTop: 24, 
    backgroundColor: '#f8fafc', 
    borderRadius: 16, 
    paddingVertical: 14, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#1f2937', 
    fontSize: 12, 
    fontWeight: '900', 
    letterSpacing: 2.5 
  }
});

CustomerMenuCard.propTypes = {
  menu: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
};