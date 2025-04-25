export const openHourFormatter = (openingTime, closingTime) => {
    const formatTime = (time) => {
      if (time.includes('AM') || time.includes('PM') || time.includes(' AM') || time.includes(' PM')) {
        return time.replace(' ', ''); // fix for any special space character
      }
  
      const [hour, minute] = time.split(':').map(Number);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const adjustedHour = hour % 12 || 12;
      return `${adjustedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    };
  
    return {
      opening: formatTime(openingTime),
      closing: formatTime(closingTime)
    };
  };
  

 export  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return (distance / 1000).toFixed(1).replace(/\.0$/, '') + 'k km';
    } else if (distance % 1 !== 0) {
      return distance.toFixed(1) + ' km';
    } else {
      return distance + ' km';
    }
  };
 