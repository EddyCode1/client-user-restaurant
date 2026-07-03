import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { useCart } from '../hooks/useCart';

export const MenuScreen = ({ isOpen, menu, onClose, onSaveOrder }) => {
  const { cart, updateQuantity, removeItem, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{menu?.name || 'Menú'}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Cerrar</Text>
          </TouchableOpacity>
        </View>

        {/* Cart List */}
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              
              <View style={styles.controls}>
                <TouchableOpacity 
                  onPress={() => updateQuantity(item.id, -1)}
                  style={styles.controlButton}
                >
                  <Text style={styles.controlText}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{item.quantity}</Text>
                
                <TouchableOpacity 
                  onPress={() => updateQuantity(item.id, 1)}
                  style={styles.controlButton}
                >
                  <Text style={styles.controlText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Text style={styles.delete}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.total}>Total: Q{subtotal.toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={() => onSaveOrder(cart)}
          >
            <Text style={styles.saveText}>GUARDAR PEDIDO</Text>
          </TouchableOpacity>
        </View>
        
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121214' },
  header: { 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: '#333' 
  },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  closeButton: { color: '#aaa', fontSize: 14 },
  cartItem: { 
    flexDirection: 'row', 
    padding: 15, 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#222'
  },
  itemName: { color: '#ccc', flex: 1, fontSize: 16 },
  controls: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  controlButton: { padding: 8, backgroundColor: '#222', borderRadius: 5, marginHorizontal: 5 },
  controlText: { color: '#fff', fontWeight: 'bold' },
  quantityText: { color: '#fff', width: 25, textAlign: 'center' },
  delete: { color: '#ef4444', fontSize: 18, marginLeft: 15 },
  footer: { padding: 20, backgroundColor: '#18181c', borderTopWidth: 1, borderTopColor: '#333' },
  total: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  saveButton: { backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#000', fontWeight: 'bold', letterSpacing: 1 }
});