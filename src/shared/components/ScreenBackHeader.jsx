import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ScreenBackHeader({ title, subtitle }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← VOLVER</Text>
      </TouchableOpacity>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 12 },
  backBtn: { marginBottom: 12 },
  backText: { color: '#9ca3af', fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title: { fontSize: 24, fontWeight: '900', color: '#fff' },
  subtitle: { fontSize: 12, color: '#6b7280', marginTop: 4 },
});
