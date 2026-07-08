import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../shared/store/authStore';
import reservationService from '../../../shared/api/services/reservationService';
import CustomerReservationList from '../components/CustomerReservationList';
import ReservationViewModal from '../components/ReservationViewModal';
import { getReservationDisplayStatus } from '../utils/reservationStatus';

export default function CustomerReservationListScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationService.getReservations({ user_id: user?._id || user?.id });
      setReservations(Array.isArray(data) ? data : []);
    } catch {
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [user?._id, user?.id]);

  const filteredReservations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return reservations
      .map((r) => ({
        ...r,
        displayStatus: getReservationDisplayStatus(r, now),
      }))
      .filter((r) => {
        const restaurantName = (r.restaurant_name || r.restaurant?.name || '').toLowerCase();
        return restaurantName.includes(q) || r.displayStatus?.toLowerCase().includes(q);
      });
  }, [reservations, searchQuery, now]);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=1600&q=80' }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.headerTitle}>MIS RESERVACIONES</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar restaurante..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <CustomerReservationList
          reservations={filteredReservations}
          loading={loading}
          onView={(item) => {
            setSelectedReservation(item);
            setIsViewModalOpen(true);
          }}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateReservation')}
        >
          <Text style={styles.fabText}>+ NUEVA RESERVA</Text>
        </TouchableOpacity>
      </View>

      <ReservationViewModal
        visible={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        reservation={selectedReservation}
        onReservationUpdated={loadReservations}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  container: { flex: 1, padding: 20, paddingTop: 60 },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  fabText: { fontWeight: '900', color: '#111', letterSpacing: 1, fontSize: 12 },
});
