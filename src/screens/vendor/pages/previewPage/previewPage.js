
import React, { useState, useRef,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';

// Define colors at the top for easy customization
const COLORS = {
  primary: '#101942',
  accent: '#FF5722', // Orange
  lightPurple: '#E6D8F2',
  white: '#FFFFFF',
  gray: '#8A94A6',
  lightGray: '#F5F7FA',
  red: '#FF3B30',
  green: '#4CAF50',
  yellow: '#FFC107',
  black: '#333333',
};

const { width } = Dimensions.get('window');

const PreviewPage = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollViewRef = useRef(null);
  const mapRef = useRef(null); 

  const route = useRoute();
  const { stationData } = route.params; // Retrieve the passed data

  console.log('Station Data:', stationData); // Log the station data for debugging
  console.log('Chargers:', JSON.stringify(stationData.chargers, null, 2));

  useEffect(() => {
    if (mapRef.current && stationData.coordinates) {
      const { latitude, longitude } = stationData.coordinates;
      mapRef.current.animateCamera({
        center: {
          latitude: latitude || 0,
          longitude: longitude || 0,
        },
        zoom: 15, // Adjust zoom level as needed
      });
    }
  }, [stationData.coordinates]); // Trigger whenever coordinates change

  const handleSubmit = async () => {
    try {
      console.log('Submitting station data:', stationData);

      // Call the API (replace with your actual API call)
      const response = await fakeApiCall(stationData); // Replace `fakeApiCall` with your API function
      console.log('Station added successfully:', response);

      // Show success message
      Alert.alert('Success', 'Station added successfully!');
      navigation.goBack(); // Navigate back after successful submission
    } catch (error) {
      console.error('Error adding station:', error);
      Alert.alert('Error', 'Failed to add station. Please try again.');
    }
  };

  const handleTabPress = (index) => {
    setActiveTab(index);
    scrollViewRef.current.scrollTo({ x: index * width, animated: true });
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (activeTab !== index) {
      setActiveTab(index);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: stationData.photo || 'https://via.placeholder.com/400x200',
          }}
          style={styles.mapBackground}
        />
        <View style={styles.overlay}>
          <View style={styles.communityBadge}>
            <Text style={styles.communityText}>Community Listed</Text>
          </View>
          <Text style={styles.stationName}>{stationData.station_name}</Text>
          <Text style={styles.stationAddress}>{stationData.address}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.openHour}>Open Hours</Text>
            <Text style={styles.statusTime}>
              • {stationData.open_hours_opening_time} -{' '}
              {stationData.open_hours_closing_time}
            </Text>
            <View style={styles.newBadge}>
              <Text style={styles.newText}>New</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 0 && styles.activeTabButton]}
          onPress={() => handleTabPress(0)}
        >
          <Text
            style={[styles.tabText, activeTab === 0 && styles.activeTabText]}
          >
            Charger
          </Text>
          {activeTab === 0 && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 1 && styles.activeTabButton]}
          onPress={() => handleTabPress(1)}
        >
          <Text
            style={[styles.tabText, activeTab === 1 && styles.activeTabText]}
          >
            Details
          </Text>
          {activeTab === 1 && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Swipeable Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Charger Tab */}
        {chargerTab()}
        {/* Details Tab */}
        {detailTab()}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  function chargerTab() {
    return (
      <ScrollView style={styles.tabContent}>
        {stationData.chargers.map((charger, index) => (
          <View key={index} style={styles.chargerCard}>
            <Text style={styles.chargerTitle}>
              Charger {index + 1} - {charger.charger_type}
            </Text>
            <View style={styles.chargerSpecs}>
              <Text style={styles.chargerSpecText}>
                {charger.charger_type}
              </Text>
              <Text style={styles.chargerSpecText}>|</Text>
              <Text style={styles.chargerSpecText}>
                {charger.power_rating || charger.max_power_kw} kW
              </Text>
            </View>

            <View style={styles.connectorContainer}>
              {charger.connectors.map((connector, connectorIndex) => (
                <View key={connectorIndex} style={styles.connector}>
                  <Text style={styles.connectorTitle}>
                    Connector {connectorIndex + 1}
                  </Text>
                  <View style={styles.connectorType}>
                    <Icon
                      name="ev-plug-type1"
                      size={20}
                      color={COLORS.primary}
                    />
                    <Text style={styles.connectorTypeText}>
                      Type {connector.connector_type_id}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  function detailTab() {
    return (
      <ScrollView style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Location Details</Text>
        <View style={styles.mapContainer}>
        <MapView
        ref={mapRef} // Attach the ref to the MapView
        style={styles.map}
        initialRegion={{
          latitude: stationData.coordinates.latitude || 0,
          longitude: stationData.coordinates.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: stationData.coordinates.latitude || 0,
            longitude: stationData.coordinates.longitude || 0,
          }}
          title={stationData.station_name}
          description={stationData.address}
        />
      </MapView>
        </View>

        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {stationData.amenities.split(',').map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <Icon name="check-circle" size={24} color={COLORS.primary} />
              <Text style={styles.connectorTypeText}>{amenity.trim()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    height: 200,
    position: 'relative',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 1,
  },
  overlay: {
    padding: 16,
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(230, 216, 242, 0.6)', // Light purple with opacity
  },
  communityBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  communityText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 12,
    color: COLORS.black,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openHour: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusTime: {
    color: COLORS.black,
    fontSize: 12,
    marginLeft: 4,
  },
  newBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  newText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTabButton: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.accent,
  },
  tabContent: {
    width,
    padding: 16,
  },
  chargerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom:10,
  },
  chargerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  chargerSpecs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chargerSpecText: {
    fontSize: 12,
    color: COLORS.gray,
    marginRight: 8,
  },
  connectorContainer: {
    marginBottom: 16,
  },
  connector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  connectorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  connectorType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectorTypeText: {
    marginLeft: 8,
    color: COLORS.gray,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  landmarkContainer: {
    marginBottom: 24,
  },
  landmarkTitle: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 8,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  amenityItem: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  seeAllText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
 
  bottomButtons: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  editButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PreviewPage;