import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Linking } from 'react-native';
import { useContactStore } from '../store/useContactStore';

/**
 * ContactScreen
 * Pantalla de visualización del directorio de contacto del restaurante
 */
const ContactScreen = () => {
  const { contacts, loading, fetchContacts } = useContactStore();

  useEffect(() => {
    fetchContacts();
  }, []);

  const renderContactItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.contact_name}</Text>
      <Text style={styles.type}>{item.contact_type} • {item.contact_position}</Text>
      
      <View style={styles.actions}>
        <Text style={styles.link} onPress={() => Linking.openURL(`mailto:${item.contact_email}`)}>
          {item.contact_email}
        </Text>
        <Text style={styles.link} onPress={() => Linking.openURL(`tel:${item.contact_phone_number}`)}>
          {item.contact_phone_number}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Directorio de Contacto</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item._id}
          renderItem={renderContactItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay contactos disponibles.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 20, marginTop: 40 },
  list: { gap: 15 },
  card: { backgroundColor: '#18181B', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#27272A' },
  name: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  type: { fontSize: 14, color: '#A1A1AA', marginBottom: 10 },
  actions: { marginTop: 10, gap: 5 },
  link: { fontSize: 14, color: '#e67e22', textDecorationLine: 'underline' },
  emptyText: { color: '#71717A', textAlign: 'center', marginTop: 50 }
});

export default ContactScreen;