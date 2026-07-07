import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import ScreenBackHeader from '../../../shared/components/ScreenBackHeader';

export default function CustomerReviewsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackHeader title="Reseñas" subtitle="Próximamente" />
      <View style={styles.body}>
        <Text style={styles.text}>
          Las reseñas de clientes estarán disponibles en una próxima versión.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  text: { color: '#9ca3af', textAlign: 'center', fontSize: 14, lineHeight: 22 },
});
