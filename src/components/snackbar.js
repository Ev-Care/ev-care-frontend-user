import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearSnackbar } from '../redux/snackbar/snackbarSlice';

const Snackbar = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.snackbar);
  console.log("Snackbar message:", message); // Debugging line

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearSnackbar());
      }, 4000); // Auto close after 4 sec
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  const bgColor = type === 'error' ? '#f44336' : '#4caf50'; // red / green

  return (
    <View style={[styles.snackbarContainer, { backgroundColor: bgColor }]}>
      <Text style={styles.snackbarMessage}>{message}</Text>
      <TouchableOpacity onPress={() => dispatch(clearSnackbar())}>
        <Text style={styles.closeButton}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -150 }], // Adjust based on snackbar width
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 200,
    maxWidth: '80%',
    zIndex: 9999,
    elevation: 5, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  snackbarMessage: {
    color: 'white',
    flex: 1,
    fontSize: 16,
  },
  closeButton: {
    color: 'white',
    fontSize: 18,
    marginLeft: 16,
  },
});

export default Snackbar;