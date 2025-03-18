import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  FontFamily,
  commonStyles,
  screenHeight,
  screenWidth,
} from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BottomSheet, Overlay } from "@rneui/themed";
import { CalendarList } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Slider } from "@rneui/themed";
import MyStatusBar from "../../components/myStatusBar";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "Jun",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const vehicalTypesList = [
  {
    id: "1",
    wheelsInVehical: 2,
  },
  {
    id: "2",
    wheelsInVehical: 3,
  },
  {
    id: "3",
    wheelsInVehical: 4,
  },
];

const carModelList = [
  {
    id: "1",
    model: "Mercedes Benz EQS",
    modelImage: require("../../assets/images/cars/car1.png"),
  },
  {
    id: "2",
    model: "Audi Q8 e-tron",
    modelImage: require("../../assets/images/cars/car2.png"),
  },
  {
    id: "3",
    model: "Hyundai Ioniq 5",
    modelImage: require("../../assets/images/cars/car3.png"),
  },
  {
    id: "4",
    model: "BMW i7",
    modelImage: require("../../assets/images/cars/car4.png"),
  },
  {
    id: "5",
    model: "BYD Atto 3",
    modelImage: require("../../assets/images/cars/car5.png"),
  },
  {
    id: "6",
    model: "TATA Nexon EV",
    modelImage: require("../../assets/images/cars/car6.png"),
  },
  {
    id: "7",
    model: "Tesla Model X",
    modelImage: require("../../assets/images/cars/car7.png"),
  },
];

const connectionTypesList = [
  {
    id: "1",
    connectionTypeIcon: require("../../assets/images/connectionTypes/connection_type1.png"),
    connectionType: "CCS2",
    capacity: "150kw",
    amountPerKw: 0.05,
    totalSlot: 2,
    takenSlot: 0,
  },
  {
    id: "2",
    connectionTypeIcon: require("../../assets/images/connectionTypes/connection_type2.png"),
    connectionType: "CCS",
    capacity: "120kw",
    amountPerKw: 0.05,
    totalSlot: 3,
    takenSlot: 3,
  },
  {
    id: "3",
    connectionTypeIcon: require("../../assets/images/connectionTypes/connection_type3.png"),
    connectionType: "Mennekers",
    capacity: "22kw",
    amountPerKw: 0.02,
    totalSlot: 2,
    takenSlot: 0,
  },
];

var todayDay = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();

const BookSlotScreen = ({ navigation }) => {
  const [vehicleType, setvehicleType] = useState("");
  const [showVehicleTypeSheet, setshowVehicleTypeSheet] = useState(false);
  const [vehicleModel, setvehicleModel] = useState("");
  const [showVehicleModelSheet, setshowVehicleModelSheet] = useState(false);
  const [selectedVehicleModelIndex, setselectedVehicleModelIndex] = useState();
  const [connectionType, setconnectionType] = useState("");
  const [showConnectionTypeSheet, setshowConnectionTypeSheet] = useState(false);
  const [selectedConnectionTypeIndex, setselectedConnectionTypeIndex] =
    useState();
  const [showDatePicker, setshowDatePicker] = useState(false);
  const [bookingDate, setbookingDate] = useState("");
  const [selectedDate, setselectedDate] = useState("");
  const [dateSelected, setdateSelected] = useState({});
  const [showTimePicker, setshowTimePicker] = useState(false);
  const [bookingTime, setbookingTime] = useState("");
  const [bookingPrice, setbookingPrice] = useState(0.0);
  const [showPriceSheet, setshowPriceSheet] = useState(false);
  const [fixPrice, setfixPrice] = useState(0);
  const [selectedFullCharge, setselectedFullCharge] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{}}
        >
          {vehicleTypeInfo()}
          {vehicleModelInfo()}
          {connectionTypeInfo()}
          {dateInfo()}
          {timeInfo()}
          {amountInfo()}
        </ScrollView>
      </View>
      {continutButton()}
      {vehicleTypeSheet()}
      {vehicleModelSheet()}
      {connectionTypeSheet()}
      {datePickerInfo()}
      {timePicker()}
      {priceSheet()}
    </View>
  );

  function continutButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("ConfirmDetail");
        }}
        style={{ ...commonStyles.button, borderRadius: 0 }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Continue</Text>
      </TouchableOpacity>
    );
  }

  function priceSheet() {
    return (
      <BottomSheet
        isVisible={showPriceSheet}
        onBackdropPress={() => setshowPriceSheet(false)}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
      >
        <View style={{ ...styles.sheetStyle }}>
          <Text style={{ textAlign: "center", ...Fonts.blackColor18SemiBold }}>
            Amount
          </Text>
          <View style={styles.fixAmountInfoWrapStyle}>
            <Text style={{ textAlign: "center", ...Fonts.blackColor16Medium }}>
              Set fix amount of charging
            </Text>
            <Slider
              value={fixPrice}
              onValueChange={(value) => {
                setfixPrice(value);
                setselectedFullCharge(false);
                setbookingPrice(value);
              }}
              maximumValue={50}
              minimumValue={0}
              step={1}
              allowTouchTrack
              trackStyle={{
                height: 5,
                backgroundColor: Colors.primaryColor,
                borderRadius: Sizes.fixPadding,
              }}
              thumbStyle={styles.sliderThumbStyle}
              maximumTrackTintColor={"#E6E6E6"}
              minimumTrackTintColor={Colors.primaryColor}
            />
            <Text
              style={{
                marginTop: Sizes.fixPadding,
                textAlign: "center",
                ...Fonts.primaryColor18SemiBold,
              }}
            >
              ${fixPrice.toFixed(1)}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setselectedFullCharge(true);
              setfixPrice(0.0);
              setbookingPrice("According To Full Charge");
            }}
            style={{
              borderColor: selectedFullCharge
                ? Colors.primaryColor
                : "transparent",
              ...styles.fullChargeInfoWrapStyle,
            }}
          >
            <Text style={{ ...Fonts.blackColor16Medium }}>Full Charge</Text>
            {selectedFullCharge ? (
              <MaterialIcons
                name="check"
                color={Colors.primaryColor}
                size={25}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  }

  function timePicker() {
    const handleConfirm = (e, time) => {
      setbookingTime(
        `${((time.getHours() + 11) % 12) + 1}:${time.getMinutes()} ${
          time.getHours() >= 12 ? "PM" : "AM"
        }`
      );
      setshowTimePicker(false);
    };

    return (
      showTimePicker && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          onChange={handleConfirm}
        />
      )
    );
  }

  function datePickerInfo() {
    return (
      <Overlay
        isVisible={showDatePicker}
        onBackdropPress={() => setshowDatePicker(false)}
        overlayStyle={styles.calenderPickerStyle}
      >
        <CalendarList
          horizontal={true}
          calendarWidth={screenWidth - 40}
          minDate={Date()}
          monthFormat={`MMMM yyyy`}
          onMonthChange={(month) => {}}
          pastScrollRange={0}
          futureScrollRange={6}
          scrollEnabled={true}
          pagingEnabled={true}
          markedDates={dateSelected}
          onDayPress={(day) => {
            setdateSelected({
              [day.dateString]: {
                selected: true,
                selectedColor: Colors.primaryColor,
                disabled: false,
              },
            });
            setselectedDate(
              `${day.day} ${monthNames[day.month - 1]} ${day.year}`
            );
          }}
          theme={{
            calendarBackground: Colors.whiteColor,
            textSectionTitleColor: Colors.grayColor,
            todayTextColor: Colors.primaryColor,
            monthTextColor: Colors.blackColor,
            dayTextColor: Colors.blackColor,
            textDisabledColor: "#d9e1e8",
            selectedDayTextColor: Colors.whiteColor,
            textDayFontFamily: FontFamily.SemiBold,
            textMonthFontFamily: FontFamily.SemiBold,
            textDayHeaderFontFamily: FontFamily.Medium,
          }}
        />
        <View style={{ ...styles.cancelAndOkButtonWrapStyle }}>
          <Text
            onPress={() => setshowDatePicker(false)}
            style={{
              ...Fonts.primaryColor16SemiBold,
              marginHorizontal: Sizes.fixPadding,
            }}
          >
            Cancel
          </Text>
          <Text
            onPress={() => {
              var todayDate = `${todayDay} ${monthNames[month - 1]} ${year}`;
              setbookingDate(selectedDate ? selectedDate : todayDate);
              setshowDatePicker(false);
            }}
            style={{
              ...Fonts.primaryColor16SemiBold,
              marginHorizontal: Sizes.fixPadding,
            }}
          >
            Ok
          </Text>
        </View>
      </Overlay>
    );
  }

  function connectionTypeSheet() {
    const renderItem = ({ item, index }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          setselectedConnectionTypeIndex(index);
          setconnectionType(item.connectionType);
          setshowConnectionTypeSheet(false);
        }}
        style={{
          ...styles.connectionTypeWrapStyle,
          borderColor:
            selectedConnectionTypeIndex == index
              ? Colors.primaryColor
              : Colors.extraLightGrayColor,
        }}
      >
        <Image
          source={item.connectionTypeIcon}
          style={{ width: 40.0, height: 40.0, resizeMode: "contain" }}
        />
        <Text
          style={{
            marginTop: Sizes.fixPadding - 5.0,
            ...Fonts.primaryColor16SemiBold,
          }}
        >
          {item.connectionType}
        </Text>
        <Text style={{ ...Fonts.blackColor14Medium }}>{item.capacity}</Text>
        <Text style={{ ...Fonts.blackColor14Medium }}>
          {`($${item.amountPerKw}/kw)`}
        </Text>
      </TouchableOpacity>
    );
    return (
      <BottomSheet
        isVisible={showConnectionTypeSheet}
        onBackdropPress={() => setshowConnectionTypeSheet(false)}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
      >
        <View style={{...styles.sheetStyle,paddingBottom:Sizes.fixPadding}}>
          <Text style={{ textAlign: "center", ...Fonts.blackColor18SemiBold }}>
            Connection type
          </Text>
          <FlatList
            horizontal
            data={connectionTypesList}
            keyExtractor={(item) => `${item.id}`}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: Sizes.fixPadding * 2.0,
              paddingTop: Sizes.fixPadding * 1.5,
            }}
          />
        </View>
      </BottomSheet>
    );
  }

  function vehicleModelSheet() {
    return (
      <BottomSheet
        isVisible={showVehicleModelSheet}
        onBackdropPress={() => {
          setshowVehicleModelSheet(false);
        }}
      >
        <View
          style={{
            ...styles.sheetStyle,
            maxHeight: screenHeight - 100,
            paddingBottom: 0.0,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              ...Fonts.blackColor18SemiBold,
              marginBottom: Sizes.fixPadding * 2.0,
            }}
          >
            Vehicle model
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {carModelList.map((item, index) => (
              <TouchableOpacity
                key={`${index}`}
                activeOpacity={0.8}
                onPress={() => {
                  setvehicleModel(item.model);
                  setselectedVehicleModelIndex(index);
                  setshowVehicleModelSheet(false);
                }}
                style={{
                  borderColor:
                    selectedVehicleModelIndex == index
                      ? Colors.primaryColor
                      : Colors.extraLightGrayColor,
                  ...styles.vehicleModelWrapStyle,
                }}
              >
                <View style={{ flex: 1, ...commonStyles.rowAlignCenter }}>
                  <Image
                    source={item.modelImage}
                    style={{ width: 50.0, height: 25.0, resizeMode: "stretch" }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      marginHorizontal: Sizes.fixPadding,
                      ...Fonts.blackColor16Medium,
                    }}
                  >
                    {item.model}
                  </Text>
                </View>
                {selectedVehicleModelIndex == index ? (
                  <MaterialIcons
                    name="check"
                    color={Colors.primaryColor}
                    size={25}
                  />
                ) : null}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>
    );
  }

  function vehicleTypeSheet() {
    return (
      <BottomSheet
        isVisible={showVehicleTypeSheet}
        onBackdropPress={() => setshowVehicleTypeSheet(false)}
      >
        <View style={styles.sheetStyle}>
          <Text style={{ textAlign: "center", ...Fonts.blackColor18SemiBold }}>
            Vehicle type
          </Text>
          <View style={{ ...styles.vehicleTypesInfoOuterWrapStyle }}>
            {vehicalTypesList.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  setvehicleType(item.wheelsInVehical);
                  setshowVehicleTypeSheet(false);
                }}
                key={`${index}`}
                style={{
                  ...styles.vehicleTypeInfoWrapStyle,
                  borderColor:
                    vehicleType == item.wheelsInVehical
                      ? Colors.primaryColor
                      : Colors.extraLightGrayColor,
                }}
              >
                <Text style={{ ...Fonts.blackColor16Medium }}>
                  {item.wheelsInVehical} Wheeler
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BottomSheet>
    );
  }

  function amountInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor18SemiBold }}>Amount</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setshowPriceSheet(true);
          }}
          style={styles.infoWrapStyle}
        >
          <Text
            numberOfLines={1}
            style={{
              ...(bookingPrice
                ? { ...Fonts.blackColor14Medium }
                : { ...Fonts.grayColor14Medium }),
              flex: 1,
            }}
          >
            {bookingPrice
              ? `${typeof bookingPrice == "string" ? "" : "$"}${bookingPrice}`
              : "Choose amount"}
          </Text>
          <MaterialIcons
            name={"arrow-forward-ios"}
            color={Colors.grayColor}
            size={15}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function timeInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor18SemiBold }}>Time</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setshowTimePicker(true);
          }}
          style={styles.infoWrapStyle}
        >
          <Text
            numberOfLines={1}
            style={{
              ...(bookingTime
                ? { ...Fonts.blackColor14Medium }
                : { ...Fonts.grayColor14Medium }),
              flex: 1,
            }}
          >
            {bookingTime ? bookingTime : "Choose time"}
          </Text>
          <MaterialIcons
            name={"arrow-forward-ios"}
            color={Colors.grayColor}
            size={15}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function dateInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor18SemiBold }}>Date</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setshowDatePicker(true);
          }}
          style={styles.infoWrapStyle}
        >
          <Text
            numberOfLines={1}
            style={{
              ...(bookingDate
                ? { ...Fonts.blackColor14Medium }
                : { ...Fonts.grayColor14Medium }),
              flex: 1,
            }}
          >
            {bookingDate ? bookingDate : "Choose date"}
          </Text>
          <MaterialIcons
            name={"arrow-forward-ios"}
            color={Colors.grayColor}
            size={15}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function connectionTypeInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor18SemiBold }}>Connection type</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setshowConnectionTypeSheet(true);
          }}
          style={styles.infoWrapStyle}
        >
          <Text
            numberOfLines={1}
            style={{
              ...(connectionType
                ? { ...Fonts.blackColor14Medium }
                : { ...Fonts.grayColor14Medium }),
              flex: 1,
            }}
          >
            {connectionType
              ? connectionType
              : "Choose your vehicle’s connection type"}
          </Text>
          <MaterialIcons
            name={"arrow-forward-ios"}
            color={Colors.grayColor}
            size={15}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function vehicleModelInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor18SemiBold }}>Vehicle model</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setshowVehicleModelSheet(true);
          }}
          style={styles.infoWrapStyle}
        >
          <Text
            numberOfLines={1}
            style={{
              ...(vehicleModel
                ? { ...Fonts.blackColor14Medium }
                : { ...Fonts.grayColor14Medium }),
              flex: 1,
            }}
          >
            {vehicleModel ? vehicleModel : "Choose your vehicle model"}
          </Text>
          <MaterialIcons
            name={"arrow-forward-ios"}
            color={Colors.grayColor}
            size={15}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function vehicleTypeInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor18SemiBold }}>Vehicle type</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setshowVehicleTypeSheet(true);
          }}
          style={styles.infoWrapStyle}
        >
          <Text
            numberOfLines={1}
            style={{
              ...(vehicleType
                ? { ...Fonts.blackColor14Medium }
                : { ...Fonts.grayColor14Medium }),
              flex: 1,
            }}
          >
            {vehicleType
              ? `${vehicleType} Wheeler`
              : "Choose your vehicle type"}
          </Text>
          <MaterialIcons
            name={"arrow-forward-ios"}
            color={Colors.grayColor}
            size={15}
          />
        </TouchableOpacity>
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
          Book Slot
        </Text>
      </View>
    );
  }
};

export default BookSlotScreen;

const styles = StyleSheet.create({
  infoWrapStyle: {
    marginTop: Sizes.fixPadding - 3.0,
    ...commonStyles.rowSpaceBetween,
    backgroundColor: Colors.originWhiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
  },
  vehicleTypeInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 3.0,
    paddingHorizontal: Sizes.fixPadding,
    borderWidth: 1.5,
    marginRight: Sizes.fixPadding + 2.0,
    ...commonStyles.shadow,
  },
  vehicleTypesInfoOuterWrapStyle: {
    marginTop: Sizes.fixPadding * 1.5,
    marginLeft: Sizes.fixPadding * 2.0,
    marginRight: Sizes.fixPadding - 2.0,
    ...commonStyles.rowAlignCenter,
    flexWrap: "wrap",
  },
  sheetStyle: {
    backgroundColor: Colors.bodyBackColor,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 2.0,
  },
  searchFieldWrapStyle: {
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    elevation: 0.5,
    borderRadius: Sizes.fixPadding,
    borderColor: Colors.shadowColor,
    borderWidth: 1.5,
    margin: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 2.0,
  },
  vehicleModelWrapStyle: {
    marginBottom: Sizes.fixPadding * 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding,
    borderWidth: 1.5,
    borderRadius: Sizes.fixPadding,
    ...commonStyles.rowSpaceBetween,
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
  },
  connectionTypeWrapStyle: {
    borderRadius: Sizes.fixPadding,
    borderWidth: 1.5,
    alignItems: "center",
    padding: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
    marginRight: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
  },
  dialogStyle: {
    backgroundColor: Colors.whiteColor,
    width: "90%",
    padding: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
  },
  cancelAndOkButtonWrapStyle: {
    ...commonStyles.rowAlignCenter,
    justifyContent: "flex-end",
    marginHorizontal: Sizes.fixPadding + 3.0,
  },
  calenderPickerStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: 0.0,
    paddingTop: Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding * 2.0,
    width: screenWidth - 40.0,
  },
  sliderThumbStyle: {
    width: 15.0,
    height: 15.0,
    borderRadius: 7.5,
    backgroundColor: Colors.primaryColor,
  },
  fullChargeInfoWrapStyle: {
    ...commonStyles.rowSpaceBetween,
    borderWidth: 1.5,
    marginHorizontal: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding + 2.0,
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
  },
  fixAmountInfoWrapStyle: {
    marginTop: Sizes.fixPadding * 1.5,
    marginBottom: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    backgroundColor: Colors.whiteColor,
  },
});
