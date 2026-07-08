import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import CustomerSidebar from '../../navbar/components/CustomerSidebar';
import CustomerNavbarBlack from '../../navbar/components/CustomerNavbarBlack';

const CustomerMainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Sidebar del Cliente (animado) */}
      <CustomerSidebar isOpen={isSidebarOpen} />

      {/* Backdrop para cerrar sidebar al tocar fuera */}
      {isSidebarOpen && (
        <TouchableWithoutFeedback onPress={handleCloseSidebar}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}

      {/* Contenido principal */}
      <View style={styles.mainContainer}>
        <CustomerNavbarBlack
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 50,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default CustomerMainLayout;
