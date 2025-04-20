// AddStations.js this is add station this is ravi
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import MyStatusBar from "../../../../components/myStatusBar";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { selectUser } from '../../../auth/services/selector';

const PRIMARY_COLOR = '#101942';
const amenities = [
  { id: 1, icon: 'toilet', label: 'Restroom' },
  { id: 2, icon: 'coffee', label: 'Cafe' },
  { id: 3, icon: 'wifi', label: 'Wifi' },
  { id: 4, icon: 'cart', label: 'Store' },
  { id: 5, icon: 'car', label: 'Car Care' },
  { id: 6, icon: 'bed', label: 'Lodging' },
];
const connectors = [
  { id: 1, icon: 'ev-plug-ccs2', type: 'CCS-2' },
  { id: 2, icon: 'ev-plug-chademo', type: 'CHAdeMO' },
  { id: 3, icon: 'ev-plug-type2', type: 'Type-2' },
  { id: 4, icon: 'ev-plug-type1', type: 'Wall' },
  { id: 5, icon: 'ev-plug-type2', type: 'GBT' },
];

const mapAmenitiesToIds = (amenitiesLabelString) => {
  // Split the comma-separated string into an array
  const labels = amenitiesLabelString.split(",").map((label) => label.trim());

  // Map the labels to their corresponding IDs
  const selectedIds = labels
    .map((label) => {
      const amenity = amenities?.find((item) => item.label === label);
      return amenity ? amenity.id : null; // Return the ID if found, otherwise null
    })
    .filter((id) => id !== null); // Remove null values

  return selectedIds;
};

const UpdateStation = ({ navigation, route }) => {
  const station = route?.params?.station;
  const user = useSelector(selectUser);
  const [selectedAmenities, setSelectedAmenities] = useState(mapAmenitiesToIds(station?.amenities || ''));
  const [openHours, setOpenHours] = useState(station?.open_hours_opening_time === '00:00:00' && station?.open_hours_closing_time === '23:59:59' ? '24 Hours' : '');
  const [photo, setPhoto] = useState(station?.photo || null);
  const [address, setAddress] = useState(station?.address || '');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [stationName, setStationName] = useState(station?.station_name || '');
  const [chargerType, setchargerType] = useState('');
  const [powerRating, setPowerRating] = useState('');
  const [chargerForms, setChargerForms] = useState(station?.chargers || [{}]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [coordinate, setCoordinate] = useState(station?.coordinates || null);
  
  const addChargerForm = () => setChargerForms(prevForms => [...prevForms, 
    {charger_id: -1,
      charger_type: null,
      max_power_kw: null,
      connectors: [],
    }
  ]);
  
  const [connectorsList, setConnectorsList] = useState([]);

  const incrementConnector = (id, chargerIndex) => {
    setChargerForms((prev) =>
      prev.map((charger, i) => {
        if (i !== chargerIndex) return charger;
  
        const connectorInfo = connectors?.find((c) => c.id === id);
        if (!connectorInfo) return charger;
  
        const newConnector = {
          charger_connector_id: -1, // Or use any unique ID generator
          connectorType: {
            connector_type_id: connectorInfo.id,
            description: connectorInfo.type,
          },
          connector_status: "operational",
        };
  
        return {
          ...charger,
          connectors: [...(charger.connectors || []), newConnector],
        };
      })
    );
  };

  const decrementConnector = (id, chargerIndex) => {
    setChargerForms((prev) =>
      prev.map((charger, i) => {
        if (i !== chargerIndex) return charger;
  
        const updatedConnectors = [...(charger.connectors || [])];
        const indexToRemove = updatedConnectors.findIndex(
          (c) => c.connectorType?.connector_type_id === id
        );
  
        if (indexToRemove !== -1) {
          updatedConnectors.splice(indexToRemove, 1); // remove one occurrence
        }
  
        return {
          ...charger,
          connectors: updatedConnectors,
        };
      })
    );
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const formattedTime = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (selectedField === 'open') {
        setOpenTime(formattedTime);
      } else if (selectedField === 'close') {
        setCloseTime(formattedTime);
      }
    }
  };
  
  const toggleAmenity = (id) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  const handleImagePick = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const selectOnMap = () => {
    navigation.push("PickLocation", {
      addressFor: "stationAddress",
      setAddress: (newAddress) => setAddress(newAddress),
      setCoordinate: (newCoordinate) => setCoordinate(newCoordinate)
    });
  };

  const handlePreview = () => {
    // Transform amenities into a comma-separated string
    const amenitiesString = selectedAmenities
      .map((id) => amenities?.find((amenity) => amenity.id === id)?.label)
      .join(',');

    // Transform chargers and connectors
    const chargers = chargerForms.map((charger, index) => ({
      charger_type: chargerType || null,
      power_rating: parseFloat(charger.max_power_kw) || null,
      connectors: connectorsList
        .filter((connector) => connector.chargerIndex === index)
        .flatMap((connector) =>
          Array(connector.count).fill({
            connector_type_id: connector.id,
            connector_status: 'operational',
          })
        ),
    }));

    // Prepare the final station data
    const stationData = {
      owner_id: user.id, // Replace with the actual owner ID if available
      station_name: stationName,
      address,
      coordinates: {
        latitude: coordinate?.latitude || null,
        longitude: coordinate?.longitude || null,
      },
      amenities: amenitiesString,
      open_hours_opening_time: openHours === '24 Hours' ? '00:00:00' : openTime || '00:00:00',
      open_hours_closing_time: openHours === '24 Hours' ? '23:59:59' : closeTime || '23:59:59',
      chargers: chargerForms,
    };

    console.log('Transformed Station Data in update:', JSON.stringify(stationData, null, 2));

    // Navigate to PreviewPage with the transformed data
    navigation.push('PreviewPage', { stationData, type: "update", stationImage: photo });
  };

  const handleVisibility = (form) => {
    const formKey = String(form);
    if (selectedForm !== formKey) {
      setSelectedForm(formKey);
    }
  };

  const removeChargerForm = (index) => {
    setChargerForms(chargerForms.filter((_, i) => i !== index));
  };



  return (
    <ScrollView style={styles.container}>
      <MyStatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Station</Text>
        <View style={{ width: 24 }} />
      </View>

      {locationDetail()}
      {additionalDetail()}
      {chargerForms.map((charger, index) => (
        <View key={`charger-${index}`}>
          {chargerDetail(charger, index)}
        </View>
      ))}
      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity onPress={handlePreview} style={styles.previewButton}>
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
  function locationDetail() {
    const [networkType, setNetworkType] = useState('');
    const networkTypes = ['Type-1', 'Type-2', 'Type-3', 'Self'];
  
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleVisibility("locationdetail")}
      >
        <Text style={styles.sectionTitle}>Location Details</Text>
        {selectedForm === "locationdetail" && (<>
          {/* Select Coordinate and Address on Map */}
          <TouchableOpacity style={styles.mapButton} onPress={selectOnMap}>
            <Text style={styles.mapButtonText}>Select on Map (required)</Text>
          </TouchableOpacity>
  
          {/* Display Address */}
          {address && (
            <TextInput
              style={[styles.input, styles.textArea, { marginBottom: 20 }]}
              placeholder="Home/Street/Locality, City, State, Pincode"
              placeholderTextColor="gray"
              multiline
              value={address}
              onChangeText={setAddress}
            />
          )}
  
        </>)}
      </TouchableOpacity>
    );
  }
  
  function additionalDetail() {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleVisibility("additionaldetail")}
      >
        <Text style={styles.sectionTitle}>Additional Details</Text>
        {selectedForm === "additionaldetail" && (<>
          {/* stationName */}
          {stationNameSection()}
          {/* Amenities Section */}
          {amenitiesSection()}
          {/* Open Hours Section */}
          {openHoursSection()}
  
          {/* Upload Photo Section */}
          {uploadPhotoSection()}
  
        </>)}
      </TouchableOpacity>
    );
  }
  
  function chargerDetail(charger, index) {
    console.log("charger details", chargerForms[index]);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleVisibility(index)}
      >
        <View style={styles.chagerTitle}>
          <Text style={styles.sectionTitle}>Charger Details {index + 1}</Text>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => removeChargerForm(index)}
              style={styles.deleteButton}
            >
              <Icon name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          )}
        </View>
  
        {selectedForm === String(index) && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Charger Type</Text>
              <View style={styles.hoursContainer}>
                <TouchableOpacity
                  style={[
                    styles.hoursButton,
                    chargerForms[index]?.charger_type === "AC" &&
                      styles.selectedButton,
                  ]}
                  onPress={() => {
                    setChargerForms((prev) =>
                      prev.map((charger, i) =>
                        i === index ? { ...charger, charger_type: "AC" } : charger
                      )
                    );
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      chargerForms[index]?.charger_type === "AC" &&
                        styles.selectedButtonText,
                    ]}
                  >
                    AC
                  </Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[
                    styles.hoursButton,
                    chargerForms[index]?.charger_type === "DC" &&
                      styles.selectedButton,
                  ]}
                  onPress={() => {
                    setChargerForms((prev) =>
                      prev.map((charger, i) =>
                        i === index ? { ...charger, charger_type: "DC" } : charger
                      )
                    );
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      chargerForms[index]?.charger_type === "DC" &&
                        styles.selectedButtonText,
                    ]}
                  >
                    DC
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
  
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Power Rating <Text style={styles.optional}>(in kW)</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Power Rating In kW"
                keyboardType="numeric"
                value={String(chargerForms[index]?.max_power_kw ?? "")}
                onChangeText={(text) =>
                  setChargerForms((prev) =>
                    prev.map((charger, i) =>
                      i === index ? { ...charger, max_power_kw: text } : charger
                    )
                  )
                }
              />
            </View>
  
            {connectorsInfo(charger?.connectors, index)}
  
            {index === chargerForms.length - 1 && (
              <View style={styles.nextButtonContainer}>
                <TouchableOpacity
                  onPress={addChargerForm}
                  style={styles.nextButton}
                >
                  <Text style={styles.nextButtonText}>+ Add more</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  }
  
  function connectorsInfo(connectorsdetails, chargerIndex) {
    // Group connectors by their type and calculate counts
    const connectorTypeCounts = connectors?.reduce((acc, connector) => {
      const count = connectorsdetails?.filter(
        (c) => c.connectorType?.connector_type_id === connector.id
      ).length;
      acc[connector.id] = count;
      return acc;
    }, {});
  
    return (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Connectors</Text>
        <View style={styles.connectorsBox}>
          {connectors?.map((connector) => {
            const count = connectorTypeCounts?.[connector.id] || 0; // Get the count for the current connector type
            console.log(`count of connectors for ${connector.type}:`, count);
  
            return (
              <View key={`connector-${connector.id}`} style={styles.connectorsItem}>
                <View style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
                  <Icon name={connector.icon} size={24} color="#101942" />
                  <Text style={[styles.optional]}>{connector.type}</Text>
                </View>
  
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => decrementConnector(connector.id, chargerIndex)}
                    style={[styles.incDecButton, { backgroundColor: "#FF5722" }]}
                  >
                    <Text style={{ color: "#fff", fontSize: 14 }}>−</Text>
                  </TouchableOpacity>
  
                  <Text style={styles.countText}>{count}</Text>
  
                  <TouchableOpacity
                    onPress={() => incrementConnector(connector.id, chargerIndex)}
                    style={[styles.incDecButton, { backgroundColor: "#101942" }]}
                  >
                    <Text style={{ color: "#fff", fontSize: 14 }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  

  function connectorsInfo1(chargerIndex) {
    console.log("connectorsList", chargerForms[chargerIndex]?.connectors);
    console.log("connectors", connectors);
    return (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Connectors</Text>
        <View style={styles.connectorsBox}>
          {connectors.map((connector) => {
            // Find the count for the current connector in connectorsList
            const connectorData = chargerForms[chargerIndex]?.connectors.find(
              (c) => c.connectorType.connector_type_id === connector.id && c.chargerIndex === chargerIndex
            );
            console.log("connectorData", connectorData);
            const count = connectorData ? connectorData.count : 0;

            return (
              <View
                key={`connector-${connector.id}`}
                style={[styles.connectorsItem]}
              >
                {/* Connector Icon */}
                <View style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
                  <Icon name={connector.icon} size={24} color="#101942" />
                  <Text style={[styles.optional]}>{connector.type}</Text>
                </View>

                {/* Increment Decrement Counter */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => decrementConnector(connector.id, chargerIndex)}
                    style={[styles.incDecButton, { backgroundColor: "#FF5722" }]}
                  >
                    <Text style={{ color: "#fff", fontSize: 14 }}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.countText}>{count}</Text>

                  <TouchableOpacity
                    onPress={() => incrementConnector(connector.id, chargerIndex)}
                    style={[styles.incDecButton, { backgroundColor: "#101942" }]}
                  >
                    <Text style={{ color: "#fff", fontSize: 14 }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  function amenitiesSection() {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          Amenities <Text style={styles.optional}>(Optional)</Text>
        </Text>
        <View style={styles.amenitiesContainer}>
          {amenities.map((amenity) => (
            <TouchableOpacity
              key={amenity.id}
              style={[
                styles.amenityItem,
                selectedAmenities.includes(amenity.id) && styles.selectedAmenity,
              ]}
              onPress={() => toggleAmenity(amenity.id)}
            >
              <Icon
                name={amenity.icon}
                size={24}
                color={selectedAmenities.includes(amenity.id) ? '#fff' : PRIMARY_COLOR}
              />
              <Text
                style={[
                  styles.amenityLabel,
                  selectedAmenities.includes(amenity.id) && styles.selectedAmenityText,
                ]}
              >
                {amenity.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  function openHoursSection() {
    {/* Open Hours Section */ }
    return (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          Open Hours
        </Text>
        <View style={styles.hoursContainer}>
          <TouchableOpacity
            style={[styles.hoursButton, openHours === '24 Hours' && styles.selectedButton]}
            onPress={() => {
              setOpenHours('24 Hours');
              setOpenTime('');
              setCloseTime('');
            }}
          >
            <Text style={[styles.buttonText, openHours === '24 Hours' && styles.selectedButtonText]}>
              24 Hours
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.hoursButton, openHours === 'Custom' && styles.selectedButton]}
            onPress={() => setOpenHours('Custom')}
          >
            <Text style={[styles.buttonText, openHours === 'Custom' && styles.selectedButtonText]}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>

        {/* Show Time Inputs when "Custom" is selected */}
        {openHours === 'Custom' && (
          <View style={styles.customTimeContainer}>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => {
                setSelectedField('open');
                setShowPicker(true);
              }}
            >
              <Text>{openTime || 'Opening Time'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => {
                setSelectedField('close');
                setShowPicker(true);
              }}
            >
              <Text>{closeTime || 'Closing Time'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Time Picker (only shown when needed) */}
        {showPicker && (
          <DateTimePicker
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={new Date()}
            onChange={handleTimeChange}
          />
        )}
      </View>)

  }
  function uploadPhotoSection() {
    return (<View style={styles.section}>
      <Text style={styles.sectionLabel}>
        Upload Photo <Text style={styles.optional}>(Optional)</Text>
      </Text>
      <Text style={styles.photoDescription}>
        Contribute to smoother journeys; include a location/charger photo.
      </Text>
      <TouchableOpacity style={styles.photoUpload} onPress={handleImagePick}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.previewImage} />
        ) : (
          <Icon name="camera-plus-outline" size={40} color="#ccc" />
        )}
      </TouchableOpacity>
    </View>);
  }

  function stationNameSection() {
    return (<View style={styles.section}>
      <Text style={styles.sectionLabel}>
        Station Name
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Station Name"
        value={stationName}
        onChangeText={setStationName}
      />
    </View>)
  }

};
// export default  AddStations ;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 16,
  },
  chagerTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  picker: {
    fontSize: 12,
    height: 50,
    width: '100%',
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 12,
  },
  networkType: {
    fontWeight: 'bold',
  },
  optional: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#888',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  connectorsContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 10,

  },
  incDecButton: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    marginHorizontal: 10,
    fontSize: 14,
    borderColor: "#e0e0e0",
    color: "gray",
    borderRadius: 4,
    borderWidth: 0.8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    textAlign: "center",
  },
  amenityItem: {
    width: '18%',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
  },
  connectorsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 4,
    borderRadius: 6,
  }
  ,
  connectorsBox: {
    width: '100%',
    // alignItems: 'center',
    marginBottom: 4,
  },
  selectedAmenity: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  amenityLabel: {
    marginTop: 4,
    fontSize: 10,
    color: PRIMARY_COLOR,
    textAlign: 'center',
  },
  connectorLabel: {
    marginTop: 4,
    fontSize: 10,
    color: PRIMARY_COLOR,
    textAlign: 'center',
  },
  selectedAmenityText: {
    color: 'white',
  },
  hoursContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  hoursButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  buttonText: {
    fontSize: 12,
    color: '#555',
  },
  selectedButtonText: {
    color: 'white',
  },
  photoDescription: {
    fontSize: 10,
    color: '#666',
    marginBottom: 12,
  },
  photoUpload: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    color: 'black',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  nextButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  nextButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 20,
  },
  addNewButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addNewButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  previewButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FF5722",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%'
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  customTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    width: '48%',
  },
  mapButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F4721E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  mapButtonText: {
    color: "#F4721E",
    fontSize: 12,
  },

});

export default UpdateStation;