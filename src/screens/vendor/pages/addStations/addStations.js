// AddStations.js this is add station this is ravi
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import MyStatusBar from "../../../../components/myStatusBar";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setupImagePicker } from "../../CompleteProfileDetail/vendorDetailForm";
import { postSingleFile } from "../../../auth/services/crudFunction";
import { selectToken, selectUser } from "../../../auth/services/selector";



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
const AddStations = () => {
  const navigation = useNavigation();
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [openHours, setOpenHours] = useState('24 Hours');
  const [photo, setPhoto] = useState(null);
  const [address, setAddress] = useState("");
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [stationName, setStationName] = useState(null);
  const [chargerType, setchargerType] = useState(null);
  const [powerRating, setPowerRating] = useState(0);
  const [chargerForms, setChargerForms] = useState([{}]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [coordinate, setCoordinate] = useState(null);
  const addChargerForm = () => setChargerForms(prevForms => [...prevForms, {}]);
  const [connectorsList, setConnectorsList] = useState([]);
  const accessToken = useSelector(selectToken); // Get access token from Redux store
  const dispatch = useDispatch(); // Get the dispatch function
  const [imageloading, setImageLoading] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const user = useSelector(selectUser); // Get user data
  const [selectedConnectors, setSelectedConnectors] = useState({});

  const incrementConnector = (id, chargerIndex) => {
    setConnectorsList((prev) => {
      const exists = prev.find((c) => c.id === id && c.chargerIndex === chargerIndex);
      if (exists) {
        return prev.map((c) =>
          c.id === id && c.chargerIndex === chargerIndex
            ? { ...c, count: c.count + 1 }
            : c
        );
      } else {
        return [...prev, { id, count: 1, chargerIndex }];
      }
    });
  };

  const decrementConnector = (id, chargerIndex) => {
    setConnectorsList((prev) =>
      prev
        .map((c) =>
          c.id === id && c.chargerIndex === chargerIndex && c.count > 0
            ? { ...c, count: c.count - 1 }
            : c
        )
        .filter((c) => c.count > 0)
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets?.[0]?.uri;
      if (!imageUri) return;

      setImageLoading(true);
      const file = await setupImagePicker(imageUri);
      console.log("File selected", file);

      try {
        const response = await dispatch(
          postSingleFile({ file: file, accessToken: accessToken })
        );

        if (response?.payload?.code === 200 || response?.payload?.code === 201) {
          setPhoto(response?.payload?.data?.filePathUrl);
          setViewImage(imageUri);
          console.log("Station image uploaded:", response?.payload?.data?.filePathUrl);
        } else {
          Alert.alert("Error", "File Should be less than 5 MB");
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong while uploading.");
      } finally {
        setImageLoading(false);
      }
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
    console.log("in the preview page");
    const amenitiesString = selectedAmenities
      .map((id) => amenities.find((amenity) => amenity.id === id)?.label)
      .join(',');

    const chargers = chargerForms.map((charger, index) => ({
      charger_type: charger.chargerType || null,
      power_rating: parseFloat(charger.powerRating) || null,

      connector_type: charger.connector_type || null,

    }));

    const stationData = {
      owner_id: user?.id || null,
      station_name: stationName,
      address,
      coordinates: {
        latitude: coordinate?.latitude || null,
        longitude: coordinate?.longitude || null,
      },
      amenities: amenitiesString,
      open_hours_opening_time: openHours === '24 Hours' ? '00:00:00' : openTime || '00:00:00',
      open_hours_closing_time: openHours === '24 Hours' ? '23:59:59' : closeTime || '23:59:59',
      chargers,
      station_images: photo ? photo : "",
    };

    console.log('Transformed Station Data:', JSON.stringify(stationData, null, 2));

    navigation.push('PreviewPage', { stationData, type: "add", stationImage: viewImage });
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
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Icon name="arrow-left" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List a Station</Text>
        <View style={{ width: 24 }} />
      </View>

      {locationDetail()}
      {additionalDetail()}
      {chargerForms.map((_, index) => (
        <View key={`charger-${index}`}>
          {chargerDetail(index)}
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
    return (
      <TouchableOpacity
        style={styles?.card}
        onPress={() => handleVisibility("locationdetail")}
      >
        <Text style={styles?.sectionTitle}>Location Details</Text>
        {selectedForm === "locationdetail" && (<>
          <TouchableOpacity style={styles?.mapButton} onPress={selectOnMap}>
            <Text style={styles?.mapButtonText}>Select on Map (required)</Text>
          </TouchableOpacity>

          {address ? (
            <TextInput
              style={[styles?.input, styles?.textArea, { marginBottom: 20 }]}
              placeholder="Home/Street/Locality, City, State, Pincode"
              placeholderTextColor="gray"
              multiline
              value={address}
              onChangeText={setAddress}
            />
          ) : null}
        </>)}
      </TouchableOpacity>
    );
  }

  function additionalDetail() {
    return (
      <TouchableOpacity
        style={styles?.card}
        onPress={() => handleVisibility("additionaldetail")}
      >
        <Text style={styles?.sectionTitle}>Additional Details</Text>
        {selectedForm === "additionaldetail" && (<>
          {stationNameSection?.()}
          {amenitiesSection?.()}
          {openHoursSection?.()}
          {uploadPhotoSection?.()}
        </>)}
      </TouchableOpacity>
    );
  }

  function chargerDetail(index) {
    return (
      <TouchableOpacity
        style={styles?.card}
        onPress={() => handleVisibility(index)}
      >
        <View style={styles?.chagerTitle}>
          <Text style={styles?.sectionTitle}>Charger Details {index + 1}</Text>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => removeChargerForm(index)}
              style={styles?.deleteButton}
            >
              <Icon name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          )}
        </View>

        {selectedForm === String(index) && (
          <>
            <View style={styles?.section}>
              <Text style={styles?.sectionLabel}>Charger Type</Text>
              <View style={styles?.hoursContainer}>
                <TouchableOpacity
                  style={[
                    styles?.hoursButton,
                    chargerForms?.[index]?.chargerType === "AC" && styles?.selectedButton,
                  ]}
                  onPress={() => {
                    setChargerForms((prev) =>
                      prev.map((charger, i) =>
                        i === index
                          ? { ...charger, chargerType: "AC" }
                          : charger
                      )
                    );
                  }}
                >
                  <Text
                    style={[
                      styles?.buttonText,
                      chargerForms?.[index]?.chargerType === "AC" &&
                      styles?.selectedButtonText,
                    ]}
                  >
                    AC
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles?.hoursButton,
                    chargerForms?.[index]?.chargerType === "DC" && styles?.selectedButton,
                  ]}
                  onPress={() => {
                    setChargerForms((prev) =>
                      prev.map((charger, i) =>
                        i === index
                          ? { ...charger, chargerType: "DC" }
                          : charger
                      )
                    );
                  }}
                >
                  <Text
                    style={[
                      styles?.buttonText,
                      chargerForms?.[index]?.chargerType === "DC" &&
                      styles?.selectedButtonText,
                    ]}
                  >
                    DC
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles?.section}>
              <Text style={styles?.sectionLabel}>
                Power Rating <Text style={styles?.optional}>(in kW)</Text>
              </Text>
              <TextInput
                style={styles?.input}
                placeholder="Power Rating In kW"
                value={chargerForms?.[index]?.powerRating || ""}
                onChangeText={(text) =>
                  setChargerForms((prev) =>
                    prev.map((charger, i) =>
                      i === index ? { ...charger, powerRating: text } : charger
                    )
                  )
                }
              />
            </View>

            {connectorsInfo(index)}

            {index === chargerForms?.length - 1 && (
              <View style={styles?.nextButtonContainer}>
                <TouchableOpacity
                  onPress={addChargerForm}
                  style={styles?.nextButton}
                >
                  <Text style={styles?.nextButtonText}>+ Add more</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  }

  function connectorsInfo(chargerIndex) {
    return (
      <View style={styles?.section}>
        <Text style={styles?.sectionLabel}>Connectors</Text>
        <View style={styles?.connectorsBox}>
          {connectors?.map((connector) => {
            const connectorData = connectorsList?.find(
              (c) => c?.id === connector?.id && c?.chargerIndex === chargerIndex
            );
            const count = connectorData?.count || 0;

            const isSelected =
              selectedConnectors[chargerIndex] === connector?.id;

            return (
              <View
                key={`connector-${connector?.id}`}
                style={styles?.connectorsItem}
              >
                <View
                  style={{ alignItems: "center", flexDirection: "row", gap: 4 }}
                >
                  <Icon name={connector?.icon} size={24} color="#101942" />
                  <Text style={styles?.optional}>{connector?.type}</Text>
                </View>

                {/* Radio Button */}
                <TouchableOpacity
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "#101942",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 6,
                  }}
                  onPress={() => {
                    setChargerForms((prev) =>
                      prev.map((charger, index) =>
                        index === chargerIndex
                          ? { ...charger, connector_type: connector?.type }
                          : charger
                      )
                    );
                    setSelectedConnectors((prev) => ({
                      ...prev,
                      [chargerIndex]: connector?.id,
                    }))
                  }
                  }
                >
                  {isSelected && (
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: "#101942",
                      }}
                    />
                  )}
                </TouchableOpacity>

                {/* Count Buttons (if needed) */}
                {/* Add your inc/dec logic here */}
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
        <Text style={styles.questionText}>What amenities are available at your station?</Text>
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
    return (
      <View style={styles.section}>
        <Text style={styles.questionText}>What are your station's operating hours?</Text>
        <Text style={styles.sectionLabel}>Open Hours</Text>
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

        {showPicker && (
          <DateTimePicker
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={new Date()}
            onChange={handleTimeChange}
          />
        )}
      </View>
    )
  }

  function stationNameSection() {
    return (
      <View style={styles.section}>
        <Text style={styles.questionText}>What is the name of your charging station?</Text>
        <Text style={styles.sectionLabel}>
          Station Name
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Station Name"
          value={stationName}
          onChangeText={setStationName}
        />
      </View>
    )
  }
  function uploadPhotoSection() {
    return (
      <View style={styles.section}>
        <Text style={styles.questionText}>Can you upload a clear photo of the station or charger?</Text>
        <Text style={styles.sectionLabel}>
          Upload Photo <Text style={styles.optional}>(Required)</Text>
        </Text>
        <Text style={styles.photoDescription}>
          Contribute to smoother journeys; include a location/charger photo.
        </Text>
        <TouchableOpacity style={styles.photoUpload} onPress={handleImagePick}>
          {imageloading ? (
            <ActivityIndicator size={40} color="#ccc" />
          ) : viewImage ? (
            <Image source={{ uri: viewImage }} style={styles.previewImage} />
          ) : (
            <Icon name="camera-plus-outline" size={40} color="#ccc" />
          )}
        </TouchableOpacity>
      </View>
    );
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

export default AddStations;