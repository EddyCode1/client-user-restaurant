import { View, Text, StyleSheet } from 'react-native';
import React, { forwardRef } from 'react';

export const MapView = forwardRef(({ style, children, initialRegion }, ref) => (
  <View ref={ref} style={[styles.webMap, style]}>
    <Text style={styles.webLabel}>Vista de mapa disponible en app móvil</Text>
    {initialRegion ? (
      <Text style={styles.webCoords}>
        Centro: {initialRegion.latitude?.toFixed?.(4)}, {initialRegion.longitude?.toFixed?.(4)}
      </Text>
    ) : null}
    {children}
  </View>
));

export const Marker = () => null;
export const Polyline = () => null;
export const Callout = () => null;

const styles = StyleSheet.create({
  webMap: {
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  webLabel: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  webCoords: {
    color: '#9ca3af',
    fontSize: 12,
  },
});

export default MapView;
