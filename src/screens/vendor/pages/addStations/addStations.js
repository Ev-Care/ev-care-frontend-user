// AddStations.js
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

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
const PRIMARY_COLOR = '#101942';

const AddStations = () => {
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [openHours, setOpenHours] = useState('24 Hours');
  const [photo, setPhoto] = useState(null);
  const [landmark, setLandmark] = useState('');
  const [comments, setComments] = useState('');
  const [address, setAddress] = useState("");
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [accessType , setAccessType] = useState(null);
  const [networkType, setNetworkType] = useState(''); 
  const [chargerType , setchargerType] = useState(null);
  const [powerRating, setPowerRating] = useState (0);
  const [chargerForms, setChargerForms] = useState([{}]);

  const[selectedForm , setSelectedForm]=useState(null);
  const [selectedConnectors , setSelectedConnectors] = useState ([]);
  const networkTypes = ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5']; 
  const addChargerForm = () => setChargerForms(prevForms => [...prevForms, {}]);
  const navigation = useNavigation();
  const amenities = [
    { id: 'restroom', icon: 'toilet', label: 'Restroom' },
    { id: 'cafe', icon: 'coffee', label: 'Cafe' },
    { id: 'store', icon: 'cart', label: 'Store' },
    { id: 'carcare', icon: 'car', label: 'Car Care' },
    { id: 'lodging', icon: 'bed', label: 'Lodging' },
  ];
  const connectors = [
    { id: 'css2', icon: 'ev-plug-ccs2', label: 'CCS-2' },
    { id: 'chademo', icon: 'ev-plug-chademo', label: 'CHAdeMO' },
    { id: 'type2', icon: 'ev-plug-type2', label: 'Type-2' },
    { id: 'wall', icon: 'ev-plug-type1', label: 'Wall' },
    { id: 'gbt', icon: 'ev-plug-type2', label: 'GBT' },
    { id: 'tesla', icon: 'ev-plug-tesla', label: 'Tesla' },
  ];
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
  const addConnector = (id) => {
    if (selectedConnectors.includes(id)) {
      setSelectedConnectors(selectedConnectors.filter(item => item !== id));
    } else {
      setSelectedConnectors([...selectedConnectors, id]);
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
    });
  };
  
  const handleVisibility = (form) => {
    if (selectedForm !== form) {
      setSelectedForm(form);
    }
  };
  const removeChargerForm = (index) => {
    setChargerForms(chargerForms.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List a Station</Text>
        <View style={{ width: 24 }} />
      </View>

      {locationDetail()}
      {additionalDetail ()}
      {chargerForms.map((_, index) => ( chargerDetail(index)))}
      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>     
        <TouchableOpacity style={styles.previewButton}>
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
  function locationDetail() {
    const [networkType, setNetworkType] = useState(''); 
    const networkTypes = ['self']; 
  
    return (
      <TouchableOpacity
      style={styles.card}
      onPress={() =>handleVisibility("locationdetail")}
    >
        <Text style={styles.sectionTitle}>Location Details</Text>
     

      {selectedForm==="locationdetail"&&(<>
       {/* Select Coordinate and Address on Map */}
        <TouchableOpacity style={styles.mapButton} onPress={selectOnMap}>
          <Text style={styles.mapButtonText}>Select on Map (required)</Text>
        </TouchableOpacity>
  
        {/* Display Address */}
        {address && (
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Home/Street/Locality, City, State, Pincode"
            placeholderTextColor="gray"
            multiline
            value={address}
            onChangeText={setAddress}
          />
        )}
          
        {/* Network Type Dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Network Type</Text>
          <Picker
            selectedValue={networkType}
            onValueChange={(itemValue) => setNetworkType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Network Type" value="" />
            {networkTypes.map((type, index) => (
              <Picker.Item key={index} label={type} value={type} />
            ))}
          </Picker>
        </View>
        {/* access Type  */}
        <View style={styles.section}>
      <Text style={styles.sectionLabel}>
         Access Type 
      </Text>
      <View style={styles.hoursContainer}>
        <TouchableOpacity
          style={[styles.hoursButton,accessType === 'public' && styles.selectedButton]}
          onPress={() => {
            setAccessType('public');
          }}
        >
          <Text style={[styles.buttonText, accessType === 'public' && styles.selectedButtonText]}>
           Public
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.hoursButton, accessType === 'captive' && styles.selectedButton]}
          onPress={() => {
            setAccessType('captive');
          }}
        >
          <Text style={[styles.buttonText, accessType === 'captive' && styles.selectedButtonText]}>
            Captive
          </Text>
        </TouchableOpacity>
      </View>

    </View>
        {/* Next Button */}
        {/* <View style={styles.nextButtonContainer}>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View> */}
      </>)}
        </TouchableOpacity>
    );
  }
 function additionalDetail (){
    return(
      <TouchableOpacity
      style={styles.card}
      onPress={() =>handleVisibility("additionaldetail")}
    >
        <Text style={styles.sectionTitle}>Additional Details</Text>
        {selectedForm ==="additionaldetail"&&(<>
        {/* Amenities Section  */}
         {amenitiesSection()}
        {/* Open Hours Section */}
        {openHoursSection()}
      
        {/* Upload Photo Section */}
        {uploadPhotoSection()}

        {/* Landmark Section */}
        {landmarkSection()}
        {/* Additional Comments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Additional Comments <Text style={styles.optional}>(Optional)</Text>
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Add your thoughts here"
            multiline
            numberOfLines={4}
            value={comments}
            onChangeText={setComments}
          />
        </View>

        {/* Next Button */}
        {/* <View style={styles.nextButtonContainer}>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View> */}
        </>)}
        </TouchableOpacity>)
  }
  function chargerDetail(index) {
  
    return (
       <TouchableOpacity
      style={styles.card}
      onPress={() =>handleVisibility("chargerdetail")}
       >
        <View style={styles.chagerTitle}>
        <Text style={styles.sectionTitle}>Charger Details {index+1}</Text>
        {index > 0 && (
        <TouchableOpacity onPress={() => removeChargerForm(index)} style={styles.deleteButton}>
          <Icon name="close-circle" size={24} color="red" />
        </TouchableOpacity>
      )}
        </View>
        {/* Charger Type  */}
        {selectedForm==="chargerdetail"&&(
          <>
        <View style={styles.section}>
      <Text style={styles.sectionLabel}>
         Charger Type 
      </Text>
      <View style={styles.hoursContainer}>
        <TouchableOpacity
          style={[styles.hoursButton,chargerType === 'AC' && styles.selectedButton]}
          onPress={() => {
            setchargerType('AC');
          }}
        >
          <Text style={[styles.buttonText, chargerType === 'AC' && styles.selectedButtonText]}>
           AC
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.hoursButton, chargerType === 'DC' && styles.selectedButton]}
          onPress={() => {
           setchargerType('DC');
          }}
        >
          <Text style={[styles.buttonText, chargerType === 'DC' && styles.selectedButtonText]}>
           DC
          </Text>
        </TouchableOpacity>
      </View>

        </View>
          {/* power Rating  */}
          <View style={styles.section}>
      <Text style={styles.sectionLabel}>
        Power Rating <Text style={styles.optional}>(in kW)</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Power Rating In kW"
        value={powerRating}
        onChangeText={setPowerRating}
      />
         </View>
         {/* connectors  */}
         <View style={styles.section}>
      <Text style={styles.sectionLabel}>
       Connectors <Text style={styles.optional}> 1 </Text>
      </Text>
      <View style={styles.connectorsContainer}>
        {connectors.map((connectors) => (
          <TouchableOpacity
            key={connectors.id}
            style={[
              styles.connectorsItem,
              selectedConnectors.includes(connectors.id) && styles.selectedAmenity,
            ]}
            onPress={() => addConnector(connectors.id)}
          >
            <Icon
              name={connectors.icon}
              size={24}
              color={ selectedConnectors.includes(connectors.id) ? '#fff' : PRIMARY_COLOR}
            />
            <Text
              style={[
                styles.connectorLabel,
                selectedConnectors.includes(connectors.id) && styles.selectedAmenityText,
              ]}
            >
              {connectors.label}
            </Text>
           
          </TouchableOpacity>
        ))}
      </View>
    </View>
        {/* Next Button */}
        {index === chargerForms.length - 1 && (  <View style={styles.nextButtonContainer}>
          <TouchableOpacity onPress={addChargerForm} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Add more</Text>
          </TouchableOpacity>
        </View>)}
        </>)}
        </TouchableOpacity>
    );
  }
 
  
  function amenitiesSection(){
    return( 
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
  function openHoursSection(){
    {/* Open Hours Section */}
    return(
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
  function uploadPhotoSection(){
    return(<View style={styles.section}>
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
  function landmarkSection(){
    return (<View style={styles.section}>
      <Text style={styles.sectionLabel}>
        Landmark <Text style={styles.optional}>(Optional)</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Add a landmark"
        value={landmark}
        onChangeText={setLandmark}
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
  card:{
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    paddingBottom :5,
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
    borderColor :PRIMARY_COLOR,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap :10,
    
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
    width: '30%',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  previewButton: {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#ff9e80',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%'
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },customTimeContainer: {
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