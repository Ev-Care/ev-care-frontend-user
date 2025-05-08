export const filterStations = (stations, filters) => {
  const { connectionTypes, powerRating, selectedDistanceIndex } = filters;

   const powerRangeMap = {
    "1": { min: 0, max: 10 },
    "2": { min: 10, max: 20 },
    "3": { min: 20, max: 40 },
    "4": { min: 50, max: Infinity },
  };

  const distanceRangeMap = {
    1: { min: 0, max: 5 },
    2: { min: 0, max: 10 },
    3: { min: 0, max: 20 },
    4: { min: 0, max: 30 },
    5: { min: 30, max: Infinity },
  };

  return stations.filter(station => {
    const hasDistanceFilter = selectedDistanceIndex != null && selectedDistanceIndex !== 0;
    const hasPowerFilter = powerRating != null;
    const hasConnectionFilter = connectionTypes != null;

    if (hasDistanceFilter) {
      const { min, max } = distanceRangeMap[selectedDistanceIndex];
      if (station.distance_km < min || station.distance_km > max) {
        return false;
      }
    }

     const matchingCharger = station.chargers.find(charger => {
      const matchConnection = hasConnectionFilter
        ? charger.connector_type === connectionTypes.connectionType
        : true;

      const matchPower = hasPowerFilter
        ? (() => {
            const range = powerRangeMap[powerRating.id];
            return charger.max_power_kw >= range.min && charger.max_power_kw <= range.max;
          })()
        : true;

      return matchConnection && matchPower;
    });

    return !!matchingCharger; 
  });
};
