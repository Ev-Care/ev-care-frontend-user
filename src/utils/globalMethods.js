export const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    const meters = Math.round(distanceInKm * 1000);
    return `${meters} m`;
  } else {
    const kilometers = Math.round(distanceInKm);
    return `${kilometers} km`;
  }
};


  export const openHourFormatter = (openingTime, closingTime) => {
    const is24x7 = openingTime === '00:00:00' && closingTime === '23:59:59';
  
    const formatTime = (time) => {
      // Remove any special characters and trim the string
      const cleanTime = time.replace(/[^\x00-\x7F]/g, '').trim();
  
      // Check if the time is in 12-hour format with AM/PM
      const is12HourFormat = /(?:AM|PM)$/i.test(cleanTime);
  
      if (is12HourFormat) {
        // Normalize the time string to ensure consistent formatting
        return cleanTime.toUpperCase();
      } else {
        // Assume the time is in 24-hour format (e.g., "14:30" or "14:30:00")
        const [hourStr, minuteStr] = cleanTime.split(':');
        let hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
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
  
  export const getChargerLabel = (count) => `${count} ${count === 1 ? 'Charger' : 'Chargers'}`;
