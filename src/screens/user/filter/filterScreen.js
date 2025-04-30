import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import MyStatusBar from "../../../components/myStatusBar";
import { Colors, Fonts, Sizes, commonStyles } from "../../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { StackActions } from '@react-navigation/native';

const connectionTypesList = [
  {
    id: "1",
    connectionTypeIcon:"ev-plug-ccs2",
    connectionType: "CCS-2",
    selected: false,
  },
  {
    id: "2",
    connectionTypeIcon: "ev-plug-chademo",
    connectionType: "CHAdeMO",
    selected: false,
  },
  {
    id: "3",
    connectionTypeIcon:"ev-plug-type2",
    connectionType: "Type-2",
    selected: false,
  },
  {
    id: "4",
    connectionTypeIcon: "ev-plug-type1",
    connectionType: "Wall",
    selected: false,
  },
  {
    id: "5",
    connectionTypeIcon: "ev-plug-type2",
    connectionType: "GBT",
    selected: false,
  },
];

const distanceList = ["> 0 Km","<5 km", "<10 km", "<20 km", "<30 km", ">30 km",];

const powerRatingList = [
  {
    id: "1",
    speed: "Standard (<10 kW)",
    selected: false,
  },
  {
    id: "2",
    speed: "Semi fast (10 - 20 kW)",
    selected: false,
  },
  {
    id: "3",
    speed: "Fast (20 - 40 kW)",
    selected: false,
  },
  {
    id: "4",
    speed: "Ultra fast (>50 kW)",
    selected: false,
  },
];

const FilterScreen = ({ navigation,route }) => {
  const [connectionTypes, setconnectionTypes] = useState(connectionTypesList);
  const [selectedDistanceIndex, setselectedDistanceIndex] = useState(0);
  const [powerRating, setPowerRating] = useState(powerRatingList);


  const handleSubmit = () => {
    const selectedFilters = {
      selectedDistanceIndex,
      connectionTypes: connectionTypes.find(item => item.selected),  
      powerRating: powerRating.find(item => item.selected) 
    };
  
    // console.log("selected filters", selectedFilters);
  
    // Check if `connectionTypes` or `powerRating` have a valid selected item before applying
    if (selectedFilters) {
      // Add optional chaining here to avoid potential errors if `route.params` is undefined
      route.params?.onApplyFilter(selectedFilters);
      navigation.dispatch(StackActions.pop(1));
    } else {
      console.log("Please select a valid filter.");
    }
  };
  
  
  const handleCancel = () => {
    setconnectionTypes(connectionTypesList.map(item => ({ ...item, selected: false })));
    setPowerRating(powerRatingList.map(item => ({ ...item, selected: false })));
    setselectedDistanceIndex(0);
    const selectedFilters = {
      selectedDistanceIndex,
      connectionTypes: connectionTypes.find(item => item.selected), 
      powerRating: powerRating.find(item => item.selected) 
    };
    route.params?.onApplyFilter(selectedFilters);
    navigation.dispatch(StackActions.pop(1));
  };
  
  

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
        >
          {connectionTypesInfo()}
          {distanceInfo()}
          {powerInfo()}
        </ScrollView>
      </View>
      {cancelAndApplyButton()}
    </View>
  );

  function cancelAndApplyButton() {
    return (
      <View
        style={{
          ...commonStyles.rowAlignCenter,
          marginVertical: Sizes.fixPadding,
          marginHorizontal: Sizes.fixPadding * 0.5,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={  handleCancel}
          style={{
            ...commonStyles.button,
            marginLeft: Sizes.fixPadding * 2.0,
            flex: 1,
            backgroundColor: Colors.darOrangeColor,
          }}
        >
          <Text style={{ ...Fonts.whiteColor20SemiBold }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={
           handleSubmit
          }
          style={{
            ...commonStyles.button,
            marginLeft: Sizes.fixPadding * 2.0,
            flex: 1,
          }}
        >
          <Text style={{ ...Fonts.whiteColor20SemiBold }}>Apply</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function changePowerSelection({ id }) {
    const copyData = powerRating;
    const newData = copyData.map((item) => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      } else {
        return item;
      }
    });
    setPowerRating(newData);
  }

  function powerInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          changePowerSelection({ id: item.id });
        }}
        style={{
          ...commonStyles.rowAlignCenter,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View
          style={{
            ...styles.checkBoxStyle,
            backgroundColor: item.selected
              ? Colors.primaryColor
              : Colors.bodyBackColor,
          }}
        >
          {item.selected ? (
            <MaterialIcons name="done" color={Colors.whiteColor} size={16} />
          ) : null}
        </View>
        <Text
          numberOfLines={1}
          style={{
            ...Fonts.blackColor18Medium,
            flex: 1,
            marginLeft: Sizes.fixPadding * 1.5,
          }}
        >
          {item.speed}
        </Text>
      </TouchableOpacity>
    );
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            marginBottom: Sizes.fixPadding * 2.0,
          }}
        >
          Power Rating
        </Text>
        <FlatList
          data={powerRating}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function distanceInfo() {
    return (
      <View>
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          By distance
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            padding: Sizes.fixPadding,
          }}
        >
          {distanceList.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setselectedDistanceIndex(index)}
              key={`${index}`}
              style={{
                ...styles.distanceWrapStyle,
                borderColor:
                  index === selectedDistanceIndex
                    ? Colors.primaryColor
                    : Colors.extraLightGrayColor,
              }}
            >
              <Text style={{ ...Fonts.blackColor18Medium }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function changeConnectionTypeSelection({ id }) {
    const copyData = connectionTypes;
    const newData = copyData.map((item) => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      } else {
        return item;
      }
    });
    setconnectionTypes(newData);
  }

  function connectionTypesInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          changeConnectionTypeSelection({ id: item.id });
        }}
        style={{
          ...styles.connectionTypesWrapper,
          backgroundColor: item.selected
            ? Colors.primaryColor
            : Colors.extraLightGrayColor,
        }}
      >
        <Icon
          name={
          item.connectionTypeIcon || "ev-plug-type1"
          }
          size={20}
          color={item.selected ? Colors.whiteColor : Colors.primaryColor}
        />
        {/* <Image
          source={item.connectionTypeImage}
          style={{ width: 40.0, height: 40.0, resizeMode: "contain" }}
        /> */}
        <Text
          style={{
            ...Fonts.blackColor18Medium,
            marginTop: Sizes.fixPadding,
            color: item.selected ? Colors.whiteColor : Colors.blackColor,
          }}
        >
          {item.connectionType}
        </Text>
      </TouchableOpacity>
    );
    return (
      <View>
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          Connection type
        </Text>
        <FlatList
          data={connectionTypes}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: Sizes.fixPadding }}
        />
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          ...commonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={26}
          onPress={() => {
            navigation.pop();
          }}
        />
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            flex: 1,
            marginLeft: Sizes.fixPadding * 2.0,
          }}
        >
          Filter
        </Text>
      </View>
    );
  }
};

export default FilterScreen;

const styles = StyleSheet.create({
  connectionTypesWrapper: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    margin: Sizes.fixPadding,
    padding: Sizes.fixPadding * 2.0,
    borderWidth: 1.5,
    alignItems: "center",
  },
  distanceWrapStyle: {
    paddingHorizontal: Sizes.fixPadding * 1.8,
    paddingVertical: Sizes.fixPadding - 3.0,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    margin: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    borderWidth: 1.5,
  },
  checkBoxStyle: {
    width: 20.0,
    height: 20.0,
    borderRadius: Sizes.fixPadding - 5.0,
    borderColor: Colors.primaryColor,
    borderWidth: 2.0,
    alignItems: "center",
    justifyContent: "center",
  },
});
