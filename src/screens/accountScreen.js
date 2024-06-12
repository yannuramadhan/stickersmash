import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text , ScrollView, TouchableOpacity, Image, ImageBackground, Alert, Modal } from 'react-native';
import Header from '../components/header'; // Import komponen Header
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/SimpleLineIcons'; 
import LogoImage from '../assets/images/user.jpg';
import { selectisUser } from '../components/reducer.js';
import { useSelector } from "react-redux";

const AccountScreen = () => {
    const navigation = useNavigation();
    const dataCurier = useSelector(selectisUser);

    const goToHome = () => {
        navigation.navigate('Dashboard');
    };
    
    
    return (
      <View style={styles.container}>
        <Header/>
            <ScrollView>
            <Text style={styles.layerTitle}>Profile</Text>
            <View style={styles.layerContainer}>
                <View style={styles.bodyContainer}>
                        <View style={styles.circleContainer}>
                            {/* <Icon name="user" size={40} color="black" /> */}
                            <Image source={dataCurier?.photo || LogoImage} style={styles.logoTop} />
                        </View>
                        <View style={styles.userIconContainer}>
                        <View style={styles.column}>
                            <Text style={styles.textColumn}>Username</Text>
                            <Text style={[styles.textColumn, styles.namaLayananText]}>Email</Text>
                            <Text style={styles.textColumn}>Phone</Text>
                        </View>
                        <View style={styles.column2}>
                            <Text style={styles.textColumn} >:  {dataCurier.username || 'unknown'}</Text>
                            <Text style={styles.textColumn} >:  {dataCurier.email || '-'}</Text>
                            <Text style={styles.textColumn} >:  {dataCurier.phoneNumber || '-'}</Text>
                        </View>
                        </View>
                    <Button onPress={goToHome} style={styles.logoutButton} color="white">
                        Back
                    </Button>
                </View>
            </View>
        </ScrollView>
      </View>
      
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
        // backgroundColor: 'grey',
    },
    bodyContainer: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    logoutButton: {
        width: '30%',
        marginTop: 16,
        backgroundColor: 'red',
    },
    userIconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: 20,
        paddingVertical: 50,
        paddingHorizontal: 30,
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 2, borderColor: 'orange',
        marginBottom: 10,
    },
    column: {
        flex: 1,
    },
    column2: {
        flex: 2,
    },
    namaLayananText: {
        flex: 1,
    },
    textColumn: {
        fontSize: 14,
    },
    modalBackdrop: {
        flex: 1,
        // backgroundColor: 'blue',
        width: '100%',
    },
    sidebar: {
        flex: 1,
        backgroundColor: 'orange',
        width: '70%',
    },

    drawer: {
        // backgroundColor: 'white',
        alignItems: 'flex-start',
        marginTop: 10,
    },
    drawerTitle: {
        backgroundColor: 'darkorange',
        flexDirection: 'row',
        // marginTop: 10,
        height: 70,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        width: '100%',
    },
    drawerItemIndux: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        // backgroundColor: 'yellow'
    },
    drawerItemIndux2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        // backgroundColor: 'yellow'
    },
    drawerIcon: {
        // marginRight: 16,
    },
    drawerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    circleContainer: {
        width: 100, // Sesuaikan lebar container sesuai kebutuhan
        height: 100, // Sesuaikan tinggi container sesuai kebutuhan
        borderRadius: 50, // Setengah dari lebar atau tinggi untuk membuat lingkaran
        borderWidth: 4,
        borderColor: 'lightgrey',
        backgroundColor: 'lightgray', // Warna latar belakang container
        overflow: 'hidden', // Pastikan gambar tidak keluar dari batas container
        alignItems: 'center', // Pusatkan gambar secara horizontal
        justifyContent: 'center', // Pusatkan gambar secara vertikal
    },
    textLogoContainer: {
        marginTop: 14,
        marginLeft: 8,
        flexDirection: 'column',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textlogo: {
        fontWeight: 'bold',
    },
    alignRight: {
        alignItems: 'flex-end',
    },
    circleSidebar: {
        position: 'relative',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        borderWidth: 3, // Lebar border
        borderColor: 'grey', // Warna border
        overflow: 'hidden', // Mengatur overflow untuk memotong konten yang melebihi kotak
        width: 60, // Lebar kotak
        height: 60, // Tinggi kotak
        zIndex: 1, // Menempatkan kotak di atas ikon
        margin: 6,
    },
    headersidebar: {
        flexDirection: 'row',
        backgroundColor: 'orange',
        alignItems: 'flex-start',
        width: '100%',
        height: 70,
        paddingTop: 10,
        justifyContent: 'space-between',
    },
    logoTop: {
        width: '100%', // Lebar gambar sesuai dengan lebar container
        height: '100%', // Tinggi gambar sesuai dengan tinggi container
        resizeMode: 'cover',
    },
    layerTitle: {
        fontSize: 18,
        paddingTop: 12,
        paddingBottom: 6,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    layerContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 12,
        // paddingHorizontal: 25,
        // backgroundColor: 'white',
        flex: 1,
    },

});

export default AccountScreen;
