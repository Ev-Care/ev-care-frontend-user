
import React, { useState, useRef } from 'react';
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

const PreviewPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollViewRef = useRef(null);

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

  // Sample review data
  const reviews = [
    {
      id: '1',
      name: 'Andrew Anderson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      comment: 'Lorem ipsum dolor sit amet consectetur. Vitae turpissimus viverra eget pulvinar. Vestibulum ut core eleifend natoque nec. Sed eget gravida phasellus viverra vel sit id. Placerat et lacus tellus. Facilisis et id a eros tincidunt egestas in faucibus viverra.',
    },
    {
      id: '2',
      name: 'Peter Jones',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      rating: 3,
      comment: 'Lorem ipsum dolor sit amet consectetur. Vitae turpissimus viverra eget pulvinar. Vestibulum ut core eleifend natoque nec. Sed eget gravida phasellus viverra vel sit id. Placerat et lacus tellus. Facilisis et id a eros tincidunt egestas in faucibus viverra.',
    },
    {
      id: '3',
      name: 'Emily Wood',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 4,
      comment: 'Lorem ipsum dolor sit amet consectetur. Vitae turpissimus viverra eget pulvinar. Vestibulum ut core eleifend natoque nec. Sed eget gravida phasellus viverra vel sit id. Placerat et lacus tellus. Facilisis et id a eros tincidunt egestas in faucibus viverra.',
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={COLORS.yellow}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

 

  return (
    <View style={styles.container}>
      {/* Header with map background */}
      <View style={styles.header}>
        <Image
          source={{ uri:'https://plus.unsplash.com/premium_photo-1664283228670-83be9ec315e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.mapBackground}
        />
        <View style={styles.overlay}>
          <View style={styles.communityBadge}>
            <Text style={styles.communityText}>Community Listed</Text>
          </View>
          <Text style={styles.stationName}>Gurukul apartment near cafe paramour</Text>
          <Text style={styles.stationAddress}>Pune Vadgaon Budruk, Sinhgad College Rd</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusClosed}>Closed</Text>
            <Text style={styles.statusTime}>• 04:05 - 06:09</Text>
            <View style={styles.newBadge}>
              <Text style={styles.newText}>4.5 ⭐</Text>
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
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>Charger</Text>
          {activeTab === 0 && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 1 && styles.activeTabButton]}
          onPress={() => handleTabPress(1)}
        >
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>Details</Text>
          {activeTab === 1 && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 2 && styles.activeTabButton]}
          onPress={() => handleTabPress(2)}
        >
          <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>Reviews</Text>
          {activeTab === 2 && <View style={styles.activeTabIndicator} />}
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
        {/* Reviews Tab */}
       {reviewsTab()}
      </ScrollView>



      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  function chargerTab(){
    return( <ScrollView style={styles.tabContent}>
      <View style={styles.chargerCard}>
        <Text style={styles.chargerTitle}>Sunfuel AC 1</Text>
        <View style={styles.chargerSpecs}>
          <Text style={styles.chargerSpecText}>AC</Text>
          <Text style={styles.chargerSpecText}>|</Text>
          <Text style={styles.chargerSpecText}>60kW</Text>
        </View>
  
        <View style={styles.connectorContainer}>
          <View style={styles.connector}>
            <Text style={styles.connectorTitle}>Connector 1</Text>
            <View style={styles.connectorType}>
              <Icon name="ev-plug-type1" size={20} color={COLORS.primary} />
              <Text style={styles.connectorTypeText}>Wall</Text>
            </View>
          </View>
  
          <View style={styles.connector}>
            <Text style={styles.connectorTitle}>Connector 2</Text>
            <View style={styles.connectorType}>
              <Icon name="ev-plug-chademo" size={20} color={COLORS.primary} />
              <Text style={styles.connectorTypeText}>CHAdeMO</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.chargerCard}>
        <Text style={styles.chargerTitle}>Sunfuel AC 1</Text>
        <View style={styles.chargerSpecs}>
          <Text style={styles.chargerSpecText}>AC</Text>
          <Text style={styles.chargerSpecText}>|</Text>
          <Text style={styles.chargerSpecText}>60kW</Text>
        </View>
  
        <View style={styles.connectorContainer}>
          <View style={styles.connector}>
            <Text style={styles.connectorTitle}>Connector 1</Text>
            <View style={styles.connectorType}>
              <Icon name="ev-plug-type1" size={20} color={COLORS.primary} />
              <Text style={styles.connectorTypeText}>Wall</Text>
            </View>
          </View>
  
          <View style={styles.connector}>
            <Text style={styles.connectorTitle}>Connector 2</Text>
            <View style={styles.connectorType}>
              <Icon name="ev-plug-chademo" size={20} color={COLORS.primary} />
              <Text style={styles.connectorTypeText}>CHAdeMO</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>);
  };
  function detailTab(){
    return(<ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Location Details</Text>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 18.4575,
            longitude: 73.8508,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{ latitude: 18.4575, longitude: 73.8508 }}
            title="Sinhgad College"
            description="Wadgaon Campus"
          />
        </MapView>
      </View>

      <View style={styles.landmarkContainer}>
        <Text style={styles.landmarkTitle}>Landmark - Cafe Paramour</Text>
      </View>

      <Text style={styles.sectionTitle}>Amenities</Text>
      <View style={styles.amenitiesContainer}>
        <View style={styles.amenityItem}>
          <Icon name="coffee" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.amenityItem}>
          <Icon name="wifi" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.amenityItem}>
          <Icon name="cart" size={24} color={COLORS.primary} />
        </View>
      
      </View>
    </ScrollView>);
  };
  function reviewsTab() {
    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
        </View>
        {reviews.map((item) => renderReviewItem({ item }))}
      </ScrollView>
    );
  };
  
  function renderReviewItem ({ item }){return(
    <View style={styles.reviewItem}>
      <Image source={{ uri: item.avatar }} style={styles.reviewAvatar} />
      <View style={styles.reviewContent}>
        <Text style={styles.reviewName}>{item.name}</Text>
        {renderStars(item.rating)}
        <Text style={styles.reviewText}>{item.comment}</Text>
      </View>
    </View>
  );};
  
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
  statusClosed: {
    color: COLORS.red,
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
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
  },
  reviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 8,
    lineHeight: 20,
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