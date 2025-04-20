
import React, { useState, useRef, useEffect } from 'react';
import { Overlay } from "@rneui/themed";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  FlatList,
  ActivityIndicator
} from 'react-native';
import {
  Colors,
  screenWidth,
  Fonts,
  Sizes,
  commonStyles,
} from "../../../../constants/styles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { selectToken } from '../../../auth/services/selector';
import { addStation, postStation } from '../../services/crudFunction';
import { selectVendorLoading } from '../../services/selector';

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
  const dispatch = useDispatch(); // Get the dispatch function
  const route = useRoute();
  const { stationData, type, stationImage } = route.params; // Retrieve the passed data
  const isLoading = useSelector(selectVendorLoading);

  console.log('Transformed station data preview:', JSON.stringify(stationData, null, 2));

  const connectorTypeMap = {
    1: { name: "CCS-2", icon: "ev-plug-ccs2" },
    2: { name: "CHAdeMO", icon: "ev-plug-chademo" },
    3: { name: "Type-2", icon: "ev-plug-type2" },
    4: { name: "Wall", icon: "ev-plug-type1" },
    5: { name: "GBT", icon: "ev-plug-type2" },
  };
  const amenityMap = {
    "Restroom": "toilet",
    "Cafe": "coffee",
    "Wifi": "wifi",
    "Store": "cart",
    "Car Care": "car",
    "Lodging": "bed"
  };
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
      if (type === "add") {
        console.log('Submitting station data:', JSON.stringify(stationData));

        // Validate chargers
        if (!stationData.chargers || stationData.chargers.length === 0) {
          Alert.alert('Validation Error', 'At least one charger must be added.');
          return;
        }

        for (let i = 0; i < stationData.chargers.length; i++) {
          const charger = stationData.chargers[i];
          console.log(!charger.charger_type, !charger.power_rating, !charger.connectors, charger.connectors.length === 0);
          if (!charger.charger_type || !charger.power_rating || !charger.connectors || charger.connectors.length === 0) {
            Alert.alert(
              'Validation Error',
              `Charger ${i + 1} details is incomplete. Please ensure all fields are filled.`
            );
            return;
          }

          for (let j = 0; j < charger.connectors.length; j++) {
            const connector = charger.connectors[j];
            // console.log(connector.connectorType.connector_type_id);
            if (!connector?.connector_type_id) {
              Alert.alert(
                'Validation Error',
                `Connector ${j + 1} details of Charger ${i + 1} is incomplete. Please ensure all fields are filled.`
              );
              return;
            }
          }
        }

        // Call the API (replace with your actual API call)
        // const response = await dispatch(addStation(stationData));
        // console.log('after dispatching add response:', response.payload);

        // Show success message

        const response = await dispatch(addStation(stationData));
        if (response.payload.code == 200 || response.payload.code == 201) {
          Alert.alert('Success', 'Station added successfully!');
          navigation.navigate("AllStations"); // Go back to the previous screen
      
        } else {
          Alert.alert('Error', response.payload.message || 'Failed to add station. Please try again.');
        }
      } else {
        Alert.alert('Success', 'Currently, this is a preview. The station will be added to the database soon.');
      }


      // Alert.alert('Success', 'Currently, this is a preview. The station will be added to the database soon.');
      // navigation.navigate('VendorBottomTabBar'); // Navigate back after successful submission
      // navigation.goBack(); // Go back to the previous screen
      // navigation.goBack(); // Go back to the previous screen
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
  function trimName(threshold, str) {
    if (str.length <= threshold) {
      return str;
    }
    return str.substring(0, threshold) + ".....";
  }
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: stationImage || 'https://via.placeholder.com/400x200',
          }}
          style={styles.mapBackground}
        />
        <View style={styles.overlay}>
          <View style={styles.communityBadge}>
            <Text style={styles.communityText}>Public</Text>
          </View>
          <Text style={styles.stationName}>{trimName(30, stationData.station_name)}</Text>
          <Text style={styles.stationAddress}>{trimName(50, stationData.address)}</Text>
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
        {loadingDialog()}
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
    if (type === "add") {
      return (
        <ScrollView style={styles.tabContent}>
          {stationData?.chargers.map((charger, index) => (
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
                {charger?.connectors.map((connector, connectorIndex) => (
                  <View key={connectorIndex} style={styles.connector}>
                    <Text style={styles.connectorTitle}>
                      Connector {connectorIndex + 1} { }
                    </Text>
                    <View style={styles.connectorType}>
                      <Icon
                        name={connectorTypeMap[connector?.connector_type_id]?.icon || "alert-circle"}
                        size={20}
                        color={COLORS.primary}
                      />
                      <Text style={styles.connectorTypeText}>
                        {connectorTypeMap[connector?.connector_type_id]?.name || "Unknown Type"}
                      </Text>
                    </View>

                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      );
    } else {
      return (

        <ScrollView style={styles.tabContent}>
          {stationData?.chargers.map((charger, index) => (
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
                {charger?.connectors.map((connector, connectorIndex) => (
                  <View key={connectorIndex} style={styles.connector}>
                    <Text style={styles.connectorTitle}>
                      Connector {connectorIndex + 1} { }
                    </Text>
                    <View style={styles.connectorType}>
                      <Icon
                        name={connectorTypeMap[connector?.connectorType?.connector_type_id]?.icon || "alert-circle"}
                        size={20}
                        color={COLORS.primary}
                      />
                      <Text style={styles.connectorTypeText}>
                        {connectorTypeMap[connector?.connectorType?.connector_type_id]?.name || "Unknown Type"}
                      </Text>
                    </View>

                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>)
    }
  }

  function loadingDialog() {
    return (
      <Overlay isVisible={isLoading} overlayStyle={styles.dialogStyle}>
        <ActivityIndicator size={50} color={COLORS.primary} style={{ alignSelf: "center" }} />
        <Text style={{ marginTop: Sizes.fixPadding, textAlign: "center", ...Fonts.blackColor16Regular }}>
          Please wait...
        </Text>
      </Overlay>
    );
  }

  //This will be used to show the error dialog in future
  function errorDialog() {
    return (
      <Overlay isVisible={isError} overlayStyle={styles.dialogStyle}>
        <ActivityIndicator
          size={50}
          color={Colors.primaryColor}
          style={{ alignSelf: "center" }}
        />
        <Text
          style={{
            marginTop: 16,
            textAlign: "center",
            color: Colors.red,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {errorMessage || "An error occurred. Please try again."}
        </Text>
      </Overlay>
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
        <Text style={styles.sectionTitle}>Address</Text>
        <View style={styles.landmarkContainer}>
          <Text style={styles.landmarkTitle}>{stationData.address}</Text>
        </View>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {stationData.amenities.split(',').map((amenityName, index) => {
            const trimmedName = amenityName.trim();
            const iconName = amenityMap[trimmedName] || "help-circle";

            return (
              <View key={index} style={styles.amenityItem}>
                <Icon name={iconName} size={24} color={COLORS.primary} />
                <Text style={styles.connectorTypeText}>{trimmedName}</Text>
              </View>
            );
          })}
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
    marginBottom: 10,
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
    fontSize: 10,
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
    flexWrap: 'wrap',
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
    marginBottom: 10,
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