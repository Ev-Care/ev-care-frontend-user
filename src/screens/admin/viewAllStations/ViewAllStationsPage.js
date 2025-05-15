import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  ActivityIndicator,
  Linking,
  View,
} from "react-native";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../../constants/styles";
import RNModal from "react-native-modal";
import React, { useEffect, useState } from "react";
import MyStatusBar from "../../../components/myStatusBar";
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import imageURL from "../../../constants/baseURL";

import { useDispatch, useSelector } from "react-redux";
import { selectAllStations } from "../services/selector";
import { fetchAllStations } from "../services/crudFunctions";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

const ViewAllStationsPage = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const allStationsList = useSelector(selectAllStations);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const dispatch = useDispatch();
const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

const filteredStations = allStationsList.filter((station) => {
  const matchesText = station?.station_name?.toLowerCase().includes(searchText.toLowerCase());

  const matchesStatus =
    selectedStatuses.length === 0 || selectedStatuses.includes("All")
      ? true
      : selectedStatuses.includes(station?.status);

  return matchesText && matchesStatus;
});


  const [refreshing, setRefreshing] = useState(false);
  const trimText = (text, limit) =>
    text.length > limit ? text.substring(0, limit) + "..." : text;
  console.log('stations legth', allStationsList.length);
 


  useEffect(() => {
    const loadStations = async () => {
      setIsLoading(true);
      await dispatch(fetchAllStations());
      setIsLoading(false);
    };

    loadStations();
  }, []);


  const handleRefresh = async () => {

    try {
      setRefreshing(true);
      const response = await dispatch(fetchAllStations());
      if (fetchAllStations.fulfilled.match(response)) {
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

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {searchBar()}
        {allStationsInfo()}
        {bottonSheet()}
      </View>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
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
              onPress={() => navigation.navigate("StationDetailPage", { item: station })}
              key={station.id}
              style={styles.card}
            >
              {station?.station_images ? (
                <Image source={{ uri: imageURL.baseURL + station?.station_images }} style={styles.image} />
              ) : (
                <View style={[styles.image, { alignItems: "center", justifyContent: "center" }]}>
                  <MaterialIcons
                    name="ev-station"
                    size={50}  // or match your image size
                    color="#8f8f8f"
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
                    // style={{
                    //   color: station?.status !== "Active"
                    //     ? Colors.darOrangeColor
                    //     : Colors.primaryColor,
                    // }}
                    style={{
                      color: station?.status == "Active"
                        ? Colors.lightGreenColor
                        : station?.status == "Inactive"
                          ? Colors.darOrangeColor : station?.status == "Rejected"
                            ? Colors.redColor : station?.status == "Planned"
                              ? Colors.yellowColor : Colors.primaryColor,
                    }}
                  >
                    {/* {station?.status !== "Active" ? "Pending" : "Active"} */}
                    {station?.status}
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
      <View
        style={{
          margin: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MyStatusBar />

        {/* Wrap SearchBar and give it flex: 1 */}
        <View style={[styles.searchBar, { flex: 1 }]}>
          <MaterialIcons
            name="search"
            size={24}
            color="#888"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search Charging Stations"
            placeholderTextColor="#888"
            style={{
              flex: 1,
              padding: 12,
              fontSize: 12,
            }}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>

        {/* Filter Icon */}
        <MaterialIcons
          name="filter-list"
          color={Colors.blackColor}
          size={26}
          style={{ marginLeft: 12 }} // add some spacing
          onPress={() =>
            setBottomSheetVisible(true)
          }
        />
      </View>
    );
  }
  function bottonSheet() {
    return (
      <RNModal
        isVisible={isBottomSheetVisible}
        onBackdropPress={() => setBottomSheetVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View style={styles.bottomSheet}>
          {/* {roleSelector()} */}
          {statusSection()}
        </View>
      </RNModal>)
  }

  function roleSelector() {
    const roles = ["user", "vendor", "both"];

    return (
      <View style={[styles.section, { marginBottom: 12 }]}>
        <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
          Select Role
        </Text>

        <View style={styles.TypeContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.TypeButton,
                selectedRole === role && styles.selectedButton,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text
                style={[
                  styles.TypebuttonText,
                  selectedRole === role && styles.selectedButtonText,
                ]}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }


function statusSection() {
  const statuses = ['All', 'Planned', 'Inactive', 'Rejected', 'Active'];

  const toggleStatus = (status) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  return (
    <View style={[styles.section, { marginBottom: 12 }]}>
      <Text style={{ marginBottom: 4, fontWeight: 'bold', fontSize: 14 }}>
        Select Status
      </Text>

      <View style={[styles.TypeContainer, { flexWrap: 'wrap' }]}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.TypeButton,
              selectedStatuses.includes(status) && styles.selectedButton,
            ]}
            onPress={() => toggleStatus(status)}
          >
            <Text
              style={[
                styles.TypebuttonText,
                selectedStatuses.includes(status) && styles.selectedButtonText,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

};

export default ViewAllStationsPage;

const styles = StyleSheet.create({
  getDirectionButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  TypeContainer: {
    flexDirection: "row",
    gap: 10,
  }, TypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  TypebuttonText: {
    fontSize: 12,
    color: "#555",
  },
  selectedButton: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  selectedButtonText: {
    color: "white",
  },
  enrouteChargingStationWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    flexDirection: "row",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  enrouteChargingStationImage: {
    width: screenWidth / 3.2,
    height: "100%",
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding,
  },
  enrouteStationOpenCloseWrapper: {
    position: "absolute",
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  primaryColorDot: {
    width: 10.0,
    height: 10.0,
    borderRadius: 5.0,
    backgroundColor: Colors.primaryColor,
  },
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
    backgroundColor: Colors.whiteColor,
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
    borderWidth: 1,
    borderColor: '#e2e2e2 ',
    backgroundColor: '#f5f5f5'
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
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(182, 206, 232, 0.3)",
    zIndex: 999,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  
});
