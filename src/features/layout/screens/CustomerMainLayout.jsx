import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomerSidebar from '../components/CustomerSidebar';
import CustomerNavbarBlack from '../components/CustomerNavbarBlack';

/**
 * Layout principal del Cliente adaptado a React Native
 */
const CustomerMainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Sidebar del Cliente */}
      {isSidebarOpen && <CustomerSidebar isOpen={isSidebarOpen} />}

      {/* Contenido principal */}
      <View style={styles.mainContainer}>
        {/* NavbarBlack del Cliente */}
        <CustomerNavbarBlack 
          isSidebarOpen={isSidebarOpen} 
          onToggleSidebar={handleToggleSidebar} 
        />

        {/* Área de renderizado de la página */}
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
    backgroundColor: '#000' 
  },
  mainContainer: { 
    flex: 1, 
    flexDirection: 'column' 
  },
  content: { 
    flex: 1, 
    backgroundColor: '#000' 
  }
});

export default CustomerMainLayout;