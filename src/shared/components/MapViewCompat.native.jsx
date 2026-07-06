import React, { forwardRef } from 'react';
import MapViewNative, { Marker, Polyline, Callout } from 'react-native-maps';

export const MapView = forwardRef((props, ref) => (
  <MapViewNative ref={ref} {...props} />
));

export { Marker, Polyline, Callout };
export default MapView;
