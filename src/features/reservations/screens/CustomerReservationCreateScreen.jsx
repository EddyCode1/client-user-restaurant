import React, { useEffect, useMemo, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  StyleSheet, Modal, ActivityIndicator, Alert 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importa tus servicios (asegúrate de que sean compatibles con RN)
import { useAuthStore } from '../../../shared/store/authStore';
import reservationService from '../../../shared/api/services/reservationService';
import { tableService } from '../../tables/services/tableService';

const LAST_RESTAURANT_KEY = 'customer:lastRestaurant';
const EDITING_RESERVATION_KEY = 'customer:editingReservation';

export default function CustomerReservationCreateView() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = useAuthStore((state) => state.user);

  // Adaptación de params/state de navegación
  const { reservation: locationReservation } = route.params || {};
  const [editingReservation, setEditingReservation] = useState(locationReservation || null);
  const isEditing = Boolean(editingReservation);

  const [restaurantContext, setRestaurantContext] = useState(null);
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [isTablePlanOpen, setIsTablePlanOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    reservation_date: '',
    reservation_time: '',
    personas: '1',
    table_id: '',
    notes: '',
  });

  // Carga inicial y datos de edición
  useEffect(() => {
    const initData = async () => {
      // Si no viene en params, intentar recuperar de Storage
      if (!editingReservation) {
        const raw = await AsyncStorage.getItem(EDITING_RESERVATION_KEY);
        if (raw) setEditingReservation(JSON.parse(raw));
      }

      const restRaw = await AsyncStorage.getItem(LAST_RESTAURANT_KEY);
      if (restRaw) setRestaurantContext(JSON.parse(restRaw));
    };
    initData();
  }, []);

  // Lógica de disponibilidad y filtros (se mantiene similar)
  const filteredTables = useMemo(() => {
    // ... mantén tu lógica de filtrado exacta aquí ...
    return tables.filter(t => ['DISPONIBLE', 'AVAILABLE', 'LIBRE'].includes(t.status?.toUpperCase()));
  }, [tables]);

  const handleSubmit = async () => {
    if (!user?._id || !restaurantContext?.id) {
      Alert.alert('Error', 'Faltan datos requeridos');
      return;
    }

    setSubmitting(true);
    // Lógica de creación igual a la web
    const payload = { ...formData, user_id: user._id, restaurant_id: restaurantContext.id };
    
    try {
      await reservationService.createReservation(payload);
      Alert.alert('Éxito', isEditing ? 'Reservación actualizada' : 'Reservación creada');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la operación');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>{isEditing ? 'EDITAR RESERVACIÓN' : 'NUEVA RESERVACIÓN'}</Text>
        <Text style={styles.title}>{isEditing ? 'Editar' : 'Tu Reservación'}</Text>
      </View>

      <View style={styles.card}>
        {/* Inputs adaptados a TextInput de RN */}
        <Text style={styles.label}>FECHA</Text>
        <TextInput 
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={formData.reservation_date}
          onChangeText={(val) => setFormData({...formData, reservation_date: val})}
        />

        <Text style={styles.label}>PERSONAS</Text>
        <TextInput 
          style={styles.input}
          keyboardType="numeric"
          value={formData.personas}
          onChangeText={(val) => setFormData({...formData, personas: val})}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{submitting ? 'Guardando...' : 'RESERVAR'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para Plan de Mesas */}
      <Modal visible={isTablePlanOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Selecciona una mesa</Text>
          {/* Aquí mapearías tus mesas */}
          <TouchableOpacity onPress={() => setIsTablePlanOpen(false)}>
            <Text style={{color: 'white'}}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 40, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: '#fff' },
  subtitle: { fontSize: 10, letterSpacing: 2, color: '#9ca3af' },
  card: { margin: 20, padding: 20, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
  label: { fontSize: 10, color: '#9ca3af', marginBottom: 5 },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, color: '#fff', marginBottom: 15 },
  submitButton: { backgroundColor: '#fff', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: '#0f172a', padding: 40 }
});