import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import CustomerMapaGeneralScreen from '../features/mapa/screens/CustomerMapaGeneralScreen';
import CustomerRestaurantMapScreen from '../features/mapa/screens/CustomerRestaurantMapScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="MapaGeneral" component={CustomerMapaGeneralScreen} />
      <Stack.Screen name="RestaurantMap" component={CustomerRestaurantMapScreen} />
    </Stack.Navigator>
  );
}
