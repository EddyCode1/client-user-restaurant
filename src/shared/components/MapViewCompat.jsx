import { Platform, View, Text, StyleSheet } from 'react-native';

let NativeMapView;
let NativeMarker;

if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  NativeMapView = maps.default;
  NativeMarker = maps.Marker;
}

export const MapView = ({ style, children, initialRegion, ...props }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webMap, style]}>
        <Text style={styles.webLabel}>Vista de mapa disponible en app móvil</Text>
        {initialRegion ? (
          <Text style={styles.webCoords}>
            Centro: {initialRegion.latitude?.toFixed?.(4)}, {initialRegion.longitude?.toFixed?.(4)}
          </Text>
        ) : null}
        {children}
      </View>
    );
  }

  return (
    <NativeMapView style={style} initialRegion={initialRegion} {...props}>
      {children}
    </NativeMapView>
  );
};

export const Marker = (props) => {
  if (Platform.OS === 'web') return null;
  return <NativeMarker {...props} />;
};

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
