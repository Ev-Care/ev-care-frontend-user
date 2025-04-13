import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ViewAllStations = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚧 Under Development 🚧</Text>
    </View>
  );
};

export default ViewAllStations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ff5733',
  },
});
