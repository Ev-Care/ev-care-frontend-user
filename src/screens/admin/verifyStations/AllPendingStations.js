import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  Linking,
  View,
  ScrollView
} from "react-native";
import {
  Colors,
  Fonts,
  Sizes,
  Switch,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import React, { useCallback, useEffect, useState } from "react";
import MyStatusBar from "../../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import imageURL from "../../../constants/baseURL";

import { useDispatch, useSelector } from "react-redux";
import { selectAdminStations } from "../services/selector";
import { useFocusEffect } from "@react-navigation/native";
import { fetchAllPendingStation } from "../services/crudFunctions";
import { RefreshControl } from "react-native";

const AllPendingStations = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const allStationsList = useSelector(selectAdminStations);
  const [refreshing, setRefreshing] = useState(false);
  const filteredStations = allStationsList.filter((station) =>
    station?.station_name?.toLowerCase().includes(searchText.toLowerCase())
  );
  const dispatch = useDispatch(selectAdminStations);
  // Dummy coordinates for the location
  // Called only on first mount
  useEffect(() => {
    console.log("pending station fetched from useEffect");

    dispatch(fetchAllPendingStation());
  }, [dispatch]);

  // Called every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("pending station fetched from useFocusEffect");
      dispatch(fetchAllPendingStation());
    }, [dispatch])
  );


  const trimText = (text, limit) =>
    text.length > limit ? text.substring(0, limit) + "..." : text;

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await dispatch(fetchAllPendingStation());
      if (fetchAllPendingStation.fulfilled.match(response)) {
        // Optional: Show success snackbar or log
        console.log("Pending stations refreshed successfully.");
      } else {
        await dispatch(showSnackbar({ message: "Failed to refresh pending stations.", type: 'error' }));
      }
    } catch (error) {
      console.error("Error refreshing stations:", error);
      await dispatch(showSnackbar({ message: "Something went wrong during refresh.", type: 'error' }));
    } finally {
      setRefreshing(false);
    }
  };


  const openGoogleMaps = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps://app?saddr=&daddr=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });
    Linking.openURL(url);
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {searchBar()}
        {allStationsInfo()}
      </View>
    </View>
  );

  function allStationsInfo() {

    return (

      <ScrollView style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#9Bd35A', '#101942']}  // Android spinner colors
            tintColor="#101942"            // iOS spinner color
          />
        }
      >

        {/* Check if stations is defined and not empty */}
        {filteredStations && filteredStations?.length > 0 ? (
          filteredStations.map((station) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("StationDetailToVerify", { item: station })}
              key={station.id}
              style={styles.card}
            >
              {station?.station_images ? (
                <Image source={{ uri: imageURL.baseURL + station?.station_images }} style={styles.image} />
              ) : (
                <View style={[styles.image, { alignItems: "center", justifyContent: "center", backgroundColor: "gray", opacity: 0.1 }]}>
                  <MaterialIcons
                    name="ev-station"
                    size={50}  // or match your image size
                    color="#a3a3c2"
                  />
                </View>
              )}

              <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                  <Text style={styles.stationName}>
                    {trimText(station?.station_name, 25)}
                  </Text>

                </View>
                <Text style={styles.statusText}>
                  Status:{" "}
                  <Text
                    style={{
                      color: station?.status !== "Active"
                        ? Colors.darOrangeColor
                        : Colors.primaryColor,
                    }}
                  >
                    {station?.status !== "Active" ? "Pending" : "Active"}
                  </Text>
                </Text>

                <Text style={styles.text}>
                  Chargers: {station?.chargers?.length || 0}
                </Text>
                <Text style={styles.addressText}>{trimText(station?.address, 100)}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          // Fallback UI when stations is undefined or empty
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No stations available.
          </Text>
        )}
      </ScrollView>
    );
  }

  function searchBar() {
    return (
      <View style={{ margin: 20.0 }}>
        <MyStatusBar />
        <View style={styles.searchBar}>
          <MaterialIcons
            name="search"
            size={24}
            color="#888"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search Pending Stations...."
            placeholderTextColor="#888"
            style={{
              flex: 1,
              fontSize: 16,
              color: "#000",
            }}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>
    );
  }
};

export default AllPendingStations;

const styles = StyleSheet.create({


  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: Colors.primary,
  },
  addressText: {
    fontSize: 10,
    color: Colors.grayColor,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
});
