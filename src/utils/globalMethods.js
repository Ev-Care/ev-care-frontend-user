
 export  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return (distance / 1000).toFixed(1).replace(/\.0$/, '') + 'k km';
    } else if (distance % 1 !== 0) {
      return distance.toFixed(1) + ' km';
    } else {
      return distance + ' km';
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
