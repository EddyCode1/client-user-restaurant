import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, UIManager, Platform } from 'react-native';

let MapViewNative;
let MarkerNative;
let PolylineNative;
let CalloutNative;

const hasNativeMapView = () => {
  if (Platform.OS === 'web') return false;
  if (typeof UIManager.hasViewManagerConfig === 'function') {
    return UIManager.hasViewManagerConfig('AIRMap');
  }
  return Boolean(UIManager.getViewManagerConfig?.('AIRMap'));
};

const mapsAvailable = (() => {
  if (!hasNativeMapView()) return false;
  try {
    const maps = require('react-native-maps');
    MapViewNative = maps.default;
    MarkerNative = maps.Marker;
    PolylineNative = maps.Polyline;
    CalloutNative = maps.Callout;
    return Boolean(MapViewNative);
  } catch {
    return false;
  }
})();

const MapFallback = forwardRef(({ style, initialRegion }, ref) => (
  <View ref={ref} style={[styles.fallback, style]}>
    <Text style={styles.title}>Mapa nativo no disponible</Text>
    <Text style={styles.subtitle}>
      Recompila la dev build con mapas: npx expo prebuild --clean && npx expo run:android
    </Text>
    {initialRegion ? (
      <Text style={styles.coords}>
        {initialRegion.latitude?.toFixed?.(4)}, {initialRegion.longitude?.toFixed?.(4)}
      </Text>
    ) : null}
  </View>
));

export const MapView = forwardRef((props, ref) => {
  if (!mapsAvailable) {
    return <MapFallback ref={ref} style={props.style} initialRegion={props.initialRegion} />;
  }
  return <MapViewNative ref={ref} {...props} />;
});

export const Marker = mapsAvailable && MarkerNative ? MarkerNative : () => null;
export const Polyline = mapsAvailable && PolylineNative ? PolylineNative : () => null;
export const Callout = mapsAvailable && CalloutNative ? CalloutNative : () => null;

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
  },
  title: { color: '#f87171', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#9ca3af', fontSize: 12, marginTop: 8, textAlign: 'center', lineHeight: 18 },
  coords: { color: '#e5e7eb', fontSize: 12, marginTop: 10 },
});

export default MapView;
