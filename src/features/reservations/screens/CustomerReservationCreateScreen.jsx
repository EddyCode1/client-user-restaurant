import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

import ScreenBackHeader from '../../../shared/components/ScreenBackHeader';
import { useAuthStore } from '../../../shared/store/authStore';
import reservationService from '../../../shared/api/services/reservationService';
import { tableService } from '../../tables/services/tableService';

const LAST_RESTAURANT_KEY = 'customer:lastRestaurant';
const EDITING_RESERVATION_KEY = 'customer:editingReservation';

const toIsoDate = (dateStr) => {
  if (!dateStr) return '';
  const parsed = new Date(`${dateStr}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? dateStr : parsed.toISOString();
};

export default function CustomerReservationCreateScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = useAuthStore((state) => state.user);

  const { restaurantId: routeRestaurantId, reservation: locationReservation } = route.params || {};
  const [editingReservation, setEditingReservation] = useState(locationReservation || null);
  const isEditing = Boolean(editingReservation);

  const [restaurantContext, setRestaurantContext] = useState(null);
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    reservation_date: '',
    reservation_time: '19:00',
    personas: '2',
    table_id: '',
    reservation_type: 'mesa',
    reservation_price: '0',
    notes: '',
  });

  useEffect(() => {
    const initData = async () => {
      if (!editingReservation) {
        const raw = await AsyncStorage.getItem(EDITING_RESERVATION_KEY);
        if (raw) setEditingReservation(JSON.parse(raw));
      }

      if (routeRestaurantId) {
        setRestaurantContext({ id: String(routeRestaurantId), name: '' });
        return;
      }

      const restRaw = await AsyncStorage.getItem(LAST_RESTAURANT_KEY);
      if (restRaw) setRestaurantContext(JSON.parse(restRaw));
    };
    initData();
  }, [routeRestaurantId]);

  useEffect(() => {
    const loadTables = async () => {
      if (!restaurantContext?.id) return;
      setLoadingTables(true);
      try {
        const data = await tableService.getTables({ restaurant_id: restaurantContext.id });
        const list = Array.isArray(data) ? data : [];
        setTables(list);
        if (!formData.table_id && list[0]?._id) {
          setFormData((prev) => ({ ...prev, table_id: list[0]._id || list[0].id }));
        }
      } catch {
        setTables([]);
      } finally {
        setLoadingTables(false);
      }
    };
    loadTables();
  }, [restaurantContext?.id]);

  const filteredTables = useMemo(
    () =>
      tables.filter((t) =>
        ['DISPONIBLE', 'AVAILABLE', 'LIBRE', 'Disponible'].includes(
          String(t.table_state || t.status || '').trim(),
        ),
      ),
    [tables],
  );

  const handleSubmit = async () => {
    if (!user?._id && !user?.id) {
      Alert.alert('Error', 'Debes iniciar sesión');
      return;
    }
    if (!restaurantContext?.id) {
      Alert.alert('Error', 'Selecciona un restaurante desde la lista');
      return;
    }
    if (!formData.reservation_date || !formData.reservation_time) {
      Alert.alert('Error', 'Completa fecha y hora');
      return;
    }
    if (formData.reservation_type === 'mesa' && !formData.table_id) {
      Alert.alert('Error', 'Selecciona una mesa disponible');
      return;
    }

    setSubmitting(true);
    const payload = {
      restaurant_id: restaurantContext.id,
      table_id: formData.reservation_type === 'mesa' ? formData.table_id : undefined,
      reservation_type: formData.reservation_type,
      reservation_date: toIsoDate(formData.reservation_date),
      reservation_time: formData.reservation_time,
      reservation_price: Number(formData.reservation_price || 0),
      reservation_surcharge: 0,
      reservation_history: formData.notes || `Reserva para ${formData.personas} personas`,
    };

    try {
      if (isEditing && editingReservation?._id) {
        await reservationService.updateReservation(editingReservation._id, payload);
        Alert.alert('Éxito', 'Reservación actualizada');
      } else {
        await reservationService.createReservation(payload);
        Alert.alert('Éxito', 'Reservación creada');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo completar la operación');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ScreenBackHeader
        title={isEditing ? 'Editar reservación' : 'Nueva reservación'}
        subtitle={restaurantContext?.name || 'Restaurante seleccionado'}
      />

      <View style={styles.card}>
        <Text style={styles.label}>FECHA (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2026-07-10"
          placeholderTextColor="#6b7280"
          value={formData.reservation_date}
          onChangeText={(val) => setFormData({ ...formData, reservation_date: val })}
        />

        <Text style={styles.label}>HORA (HH:MM)</Text>
        <TextInput
          style={styles.input}
          placeholder="19:00"
          placeholderTextColor="#6b7280"
          value={formData.reservation_time}
          onChangeText={(val) => setFormData({ ...formData, reservation_time: val })}
        />

        <Text style={styles.label}>PERSONAS</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.personas}
          onChangeText={(val) => setFormData({ ...formData, personas: val })}
        />

        <Text style={styles.label}>TIPO</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={formData.reservation_type}
            onValueChange={(val) => setFormData({ ...formData, reservation_type: val })}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Mesa" value="mesa" />
            <Picker.Item label="Para llevar" value="para_llevar" />
            <Picker.Item label="Domicilio" value="domicilio" />
          </Picker>
        </View>

        {formData.reservation_type === 'mesa' ? (
          <>
            <Text style={styles.label}>MESA</Text>
            {loadingTables ? (
              <ActivityIndicator color="#fff" style={{ marginBottom: 12 }} />
            ) : (
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={formData.table_id}
                  onValueChange={(val) => setFormData({ ...formData, table_id: val })}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Selecciona mesa..." value="" />
                  {(filteredTables.length ? filteredTables : tables).map((t) => (
                    <Picker.Item
                      key={t._id || t.id}
                      label={`${t.table_name || 'Mesa'} (${t.table_capacity || '?'} pers.)`}
                      value={t._id || t.id}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </>
        ) : null}

        <Text style={styles.label}>NOTAS</Text>
        <TextInput
          style={[styles.input, styles.notes]}
          multiline
          placeholderTextColor="#6b7280"
          value={formData.notes}
          onChangeText={(val) => setFormData({ ...formData, notes: val })}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.submitButtonText}>
            {submitting ? 'Guardando...' : isEditing ? 'ACTUALIZAR' : 'RESERVAR'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  card: { margin: 20, padding: 20, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
  label: { fontSize: 10, color: '#9ca3af', marginBottom: 5, letterSpacing: 1 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
  },
  notes: { minHeight: 80, textAlignVertical: 'top' },
  pickerWrap: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, marginBottom: 15 },
  picker: { color: '#fff' },
  submitButton: { backgroundColor: '#fff', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { fontWeight: 'bold', color: '#111' },
});
