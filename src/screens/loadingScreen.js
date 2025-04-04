
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as Font from "expo-font";
import { Colors } from "../constants/styles";
import MyStatusBar from "../components/myStatusBar";

const LoadingScreen = ({ navigation }) => {

    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
                'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
                'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
                'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),                
            });
            navigation.navigate('Splash');
        }
        loadFont();
    }, [])

    return (
        <View style={styles.pageStyle}>
            <MyStatusBar/>
            <ActivityIndicator
                size={50}
                color={Colors.primaryColor}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    pageStyle: {
        flex: 1,
        backgroundColor:Colors.whiteColor ,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default LoadingScreen;