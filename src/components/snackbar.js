import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearSnackbar } from '../redux/snackbar/snackbarSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Snackbar = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.snackbar);
  // console.log("Snackbar message:", message); // Debugging line

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearSnackbar());
      }, 2000); // Auto close after 4 sec
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  const bgColor = type === 'error' ? '#FF5722' : '#4caf50'; 
//bgColor
  return (
    <View style={[styles.snackbarContainer]}>
    <View style={[styles.snackbarInnerContainer ,{  backgroundColor: bgColor ,justifyContent:"center" }]}>
      <Text style={styles.snackbarMessage}>{message}</Text>
      <TouchableOpacity style={styles.Icon} onPress={() => dispatch(clearSnackbar())}>
      <Ionicons name="close" size={15} color="white" />
     </TouchableOpacity>

    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    top: 60,
    justifyContent:"center",
    flexDirection: 'row',
    alignItems: 'center',
  
    width: '100%',
    zIndex: 9999,
    paddingHorizontal:"10%",
    
  },
  snackbarInnerContainer:{
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,  
    
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingRight:30
  },
  snackbarMessage: {
    color: 'white',
    fontSize: 12,
    flexWrap:"wrap"
  },
  Icon:{
  position:"absolute",
  top:"5",
  right:"5"
  },

});

export default Snackbar;