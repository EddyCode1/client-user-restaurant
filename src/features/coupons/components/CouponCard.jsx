import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CouponCard = ({ coupon }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.label}>CUPÓN</Text>
        <Text style={styles.code}>{coupon.code}</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {coupon.description && <Text style={styles.description}>{coupon.description}</Text>}
        
        <View style={styles.grid}>
          <InfoBox label="Tipo" value={coupon.discount_type === 'percentage' ? '%' : '$'} />
          <InfoBox label="Valor" value={coupon.discount_value} />
          <InfoBox label="Expira" value={formatDate(coupon.expiration_date)} />
          <InfoBox label="Máx" value={coupon.max_uses || '∞'} />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={coupon.active ? styles.activeText : styles.inactiveText}>
          {coupon.active ? '● Activo' : '● Inactivo'}
        </Text>
        <Text style={styles.uses}>{coupon.current_uses || 0} / {coupon.max_uses || '∞'} usos</Text>
      </View>
    </View>
  );
};

// Componente auxiliar para el grid
const InfoBox = ({ label, value }) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    marginVertical: 8, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8D8B5'
  },
  header: { backgroundColor: '#111111', padding: 20 },
  label: { fontSize: 10, fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  code: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginTop: 4 },
  body: { padding: 15 },
  description: { fontSize: 14, color: '#1f2937', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoBox: { width: '47%', backgroundColor: '#f8fafc', padding: 10, borderRadius: 10 },
  infoLabel: { fontSize: 9, fontWeight: 'bold', color: '#1f2937' },
  infoValue: { fontSize: 13, fontWeight: '600', color: '#111111', marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#f9fafb', borderTopWidth: 1, borderColor: '#E8D8B5' },
  activeText: { fontSize: 12, fontWeight: '600', color: '#059669' },
  inactiveText: { fontSize: 12, fontWeight: '600', color: '#dc2626' },
  uses: { fontSize: 12, color: '#1f2937' }
});

export default CouponCard;