export const filterStations = (stations, filters) => {
    const distanceRanges = [
      [0, 5],    // Index 0: All distances
      [0, 10],          // Index 1: Less than or equal to 50
      [0, 20],        // Index 2: Between 50 and 150
      [0, 30],       // Index 3: Between 150 and 300
      [30, Infinity],  // Index 4: Greater than 300
    ];
  
    const [minDistance, maxDistance] = distanceRanges[filters.selectedDistanceIndex];
  
    const selectedConnectorIds = filters.connectionTypes.map(item => item.id);
    const selectedPowerRanges = filters.powerRating.map(item => {
      if (item.speed.includes("Standard")) return [0, 3.7];
      if (item.speed.includes("Semi fast")) return [3.7, 20];
      if (item.speed.includes("Fast")) return [20, 43];
      if (item.speed.includes("Ultra")) return [43, Infinity];
    });
  
    const noFiltersApplied =
      selectedConnectorIds.length === 0 &&
      selectedPowerRanges.length === 0 &&
      filters.selectedDistanceIndex === 0;
  
    if (noFiltersApplied) return stations;
  
    return stations.filter(station => {
      if (!(station.distance_km >= minDistance && station.distance_km <= maxDistance)) return false;
  
      let hasConnector = true;
      if (selectedConnectorIds.length > 0) {
        hasConnector = station.chargers.some(charger =>
          charger.connectors.some(connector =>
            selectedConnectorIds.includes(connector.charger_connector_id.toString())
          )
        );
      }
  
      let hasPower = true;
      if (selectedPowerRanges.length > 0) {
        hasPower = station.chargers.some(charger =>
          selectedPowerRanges.some(([min, max]) =>
            charger.max_power_kw >= min && charger.max_power_kw <= max
          )
        );
      }
  
      return hasConnector && hasPower;
    });
  };
  