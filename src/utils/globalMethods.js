import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";

/** Format distance in meters or kilometers */
export const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    const meters = Math.round(distanceInKm * 1000);
    return `${meters} m`;
  } else {
    const kilometers = Math.round(distanceInKm);
    return `${kilometers} km`;
  }
};

/** Format operating hours */
export const openHourFormatter = (openingTime, closingTime) => {
  const is24x7 = openingTime === '00:00:00' && closingTime === '23:59:59';

  const formatTime = (time) => {
    const cleanTime = time.replace(/[^\x00-\x7F]/g, '').trim();
    const is12HourFormat = /(?:AM|PM)$/i.test(cleanTime);

    if (is12HourFormat) {
      return cleanTime.toUpperCase();
    } else {
      const [hourStr, minuteStr] = cleanTime.split(':');
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
      return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    }
  };

  if (is24x7) {
    return '24x7';
  }

  const opening = formatTime(openingTime);
  const closing = formatTime(closingTime);

  return `${opening} - ${closing}`;
};

/** Charger label */
export const getChargerLabel = (count) => `${count} ${count === 1 ? 'Charger' : 'Chargers'}`;

/** Cross-platform location permission handler */
export const getLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const { PermissionsAndroid } = await import('react-native');

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "EV Care needs access to your location to show nearby charging stations.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('Location permission granted (Android)');
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          "Permission Denied",
          "You have denied location access permanently. Please enable it manually from settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        // console.log('Location permission denied (Android)');
      }
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        // console.log('Location permission granted (iOS)');
        return true;
      } else {
        Alert.alert(
          "Permission Denied",
          "Please enable location access from iOS settings to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
      }
    }

    return false;
  } catch (err) {
    console.warn("Error requesting location permission:", err);
    return false;
  }
};


export const TimeDelay = (seconds) => {
  return new Promise(resolve => setTimeout(resolve, seconds));
};
export  const openGoogleMaps = (latitude, longitude, label = 'EV Care') => {
  const encodedLabel = encodeURIComponent(label);
  const url = Platform.select({
    ios: `maps://?q=${encodedLabel}&ll=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`,
  });
  Linking.openURL(url);
};
// export const openGoogleMaps = (latitude, longitude, label = 'Selected Location') => {
//   const encodedLabel = encodeURIComponent(label);

//   const url = Platform.select({
//     ios: `maps://?q=${encodedLabel}&ll=${latitude},${longitude}`,
//     android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`,
//   });

//   Linking.openURL(url);
// };
