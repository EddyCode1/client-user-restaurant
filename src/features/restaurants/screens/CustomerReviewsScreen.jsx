import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenBackHeader from '../../../shared/components/ScreenBackHeader';
import { useAuthStore } from '../../../shared/store/authStore';
import reviewService from '../../../shared/api/services/reviewService';
import restaurantService from '../../restaurant/services/restaurantService';

const LAST_RESTAURANT_KEY = 'customer:lastRestaurant';
const MAX_COMMENT = 500;

const formatDate = (value) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
};

const StarPicker = ({ value, onChange }) => (
  <View style={styles.starRow}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => onChange(star)} style={styles.starBtn}>
        <Text style={[styles.star, star <= value && styles.starActive]}>
          {star <= value ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function CustomerReviewsScreen() {
  const route = useRoute();
  const user = useAuthStore((state) => state.user);

  const { restaurantId: routeRestaurantId } = route.params || {};

  const [restaurantContext, setRestaurantContext] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const initContext = async () => {
      if (routeRestaurantId) {
        const id = String(routeRestaurantId);
        setRestaurantContext({ id, name: '' });
        try {
          const result = await restaurantService.getRestaurantById(id);
          if (result.success && result.data) {
            setRestaurantContext({
              id,
              name: result.data.restaurant_name || result.data.name || '',
            });
          }
        } catch {
          // keep id-only context
        }
        return;
      }

      const raw = await AsyncStorage.getItem(LAST_RESTAURANT_KEY);
      if (raw) setRestaurantContext(JSON.parse(raw));
    };

    initContext();
  }, [routeRestaurantId]);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    const params = restaurantContext?.id ? { restaurant_id: restaurantContext.id } : {};
    const result = await reviewService.getReviews(params);
    if (result.success) {
      setReviews(result.data);
    } else {
      setReviews([]);
    }
    setLoading(false);
  }, [restaurantContext?.id]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmit = async () => {
    const userId = user?._id || user?.id;
    if (!userId) {
      Alert.alert('Error', 'Debes iniciar sesión para publicar una reseña');
      return;
    }
    if (!restaurantContext?.id) {
      Alert.alert('Error', 'Selecciona un restaurante desde la lista');
      return;
    }
    if (rating < 1 || rating > 5) {
      Alert.alert('Error', 'Selecciona una calificación de 1 a 5 estrellas');
      return;
    }

    setSubmitting(true);
    const result = await reviewService.createReview({
      user_id: userId,
      restaurant_id: restaurantContext.id,
      rating,
      comment: comment.trim() || undefined,
    });
    setSubmitting(false);

    if (!result.success) {
      Alert.alert('Error', result.error || 'No se pudo crear la reseña');
      return;
    }

    Alert.alert('Éxito', result.message || 'Reseña publicada');
    setRating(0);
    setComment('');
    loadReviews();
  };

  const subtitle = restaurantContext?.name
    ? restaurantContext.name
    : restaurantContext?.id
      ? 'Restaurante seleccionado'
      : 'Todas las reseñas';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenBackHeader title="Reseñas" subtitle={subtitle} />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>NUEVA RESEÑA</Text>
          <Text style={styles.label}>CALIFICACIÓN</Text>
          <StarPicker value={rating} onChange={setRating} />

          <Text style={styles.label}>COMENTARIO (OPCIONAL)</Text>
          <TextInput
            style={[styles.input, styles.notes]}
            multiline
            maxLength={MAX_COMMENT}
            placeholder="Cuéntanos tu experiencia..."
            placeholderTextColor="#6b7280"
            value={comment}
            onChangeText={setComment}
          />
          <Text style={styles.charCount}>
            {comment.length}/{MAX_COMMENT}
          </Text>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Publicando...' : 'PUBLICAR RESEÑA'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>
            RESEÑAS {restaurantContext?.name ? `· ${restaurantContext.name.toUpperCase()}` : ''}
          </Text>

          {loading ? (
            <ActivityIndicator color="#fff" style={styles.loader} />
          ) : reviews.length === 0 ? (
            <Text style={styles.emptyText}>Aún no hay reseñas para mostrar.</Text>
          ) : (
            reviews.map((review) => {
              const reviewId = review._id || review.id;
              const author =
                review.user_id?.nombre || review.user_id?.email || 'Cliente';
              const restaurantName =
                review.restaurant_id?.restaurant_name || review.restaurant_id?.name || '';
              return (
                <View key={reviewId} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewAuthor}>{author}</Text>
                    <Text style={styles.reviewStars}>
                      {'★'.repeat(review.rating || 0)}
                      {'☆'.repeat(5 - (review.rating || 0))}
                    </Text>
                  </View>
                  {!restaurantContext?.id && restaurantName ? (
                    <Text style={styles.reviewRestaurant}>{restaurantName}</Text>
                  ) : null}
                  {review.comment ? (
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  ) : (
                    <Text style={styles.reviewNoComment}>Sin comentario</Text>
                  )}
                  <Text style={styles.reviewDate}>{formatDate(review.created_at)}</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  scrollContent: { paddingBottom: 32 },
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  listSection: { marginHorizontal: 20 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9ca3af',
    letterSpacing: 2,
    marginBottom: 12,
  },
  label: { fontSize: 10, color: '#9ca3af', marginBottom: 5, letterSpacing: 1 },
  starRow: { flexDirection: 'row', marginBottom: 15, gap: 8 },
  starBtn: { padding: 4 },
  star: { fontSize: 28, color: '#52525b' },
  starActive: { color: '#fbbf24' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 8,
  },
  notes: { minHeight: 80, textAlignVertical: 'top' },
  charCount: { fontSize: 10, color: '#6b7280', textAlign: 'right', marginBottom: 12 },
  submitButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitDisabled: { opacity: 0.6 },
  submitButtonText: { fontWeight: 'bold', color: '#111' },
  loader: { marginVertical: 24 },
  emptyText: { color: '#6b7280', fontSize: 14, textAlign: 'center', marginVertical: 24 },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewAuthor: { color: '#fff', fontWeight: '700', fontSize: 14, flex: 1 },
  reviewStars: { color: '#fbbf24', fontSize: 14, letterSpacing: 1 },
  reviewRestaurant: { color: '#a1a1aa', fontSize: 12, marginBottom: 6 },
  reviewComment: { color: '#d4d4d8', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  reviewNoComment: { color: '#52525b', fontSize: 13, fontStyle: 'italic', marginBottom: 8 },
  reviewDate: { color: '#6b7280', fontSize: 11 },
});
