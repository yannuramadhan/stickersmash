import React, { useState, useEffect } from 'react';
import { Linking, StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, Alert, BackHandler, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/SimpleLineIcons';
import BackgroundImage from '../assets/images/bg.jpg';
import LogoImage from '../assets/images/user.jpg';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
// import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { useFocusEffect } from '@react-navigation/native';
import * as Device from 'expo-device';
import { useNavigation } from '@react-navigation/native';
import { API_CONNECTION } from '@env';
import { selectisUser } from '../components/reducer.js';
import { useSelector } from "react-redux";

const Header = ({ }) => {
    const navigation = useNavigation();
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const dataCurier = useSelector(selectisUser);
    
    const toggleDrawer = () => {
        setDrawerVisible(!isDrawerVisible);
    };

    const goToLogout = async () => {
      const getSetting = await AsyncStorage.getItem('Setting');
      const parseSetting = JSON.parse(getSetting);
        const token = await AsyncStorage.getItem('token');
        const parsedToken = JSON.parse(token);

        Alert.alert(
            'Konfirmasi Logout',
            'Anda yakin ingin keluar dari aplikasi ?',
            [
                {
                    text: 'Batal',
                    style: 'cancel',
                },
                {
                    text: 'Keluar',
                    onPress: async () => {
                        // const formData = new FormData();
                        // formData.append('imei', null);

                        try {
                            const response = await axios({
                                method: "post",
                                url: parseSetting.Connection + '/auth/logout',
                                // body: {},
                                headers: { "Content-Type": "application/json", 'Authorization': `${parsedToken.type} ${parsedToken.token}` },
                            });


                            if (response.status === 200) {
                                await AsyncStorage.removeItem('token');
                                await AsyncStorage.setItem('isLoggedIn', 'N');
                                navigation.navigate('Login');
                            }

                        } catch (error) {
                            console.error('Gagal logout:', error);
                            if (error.response && error.response.data && error.response.data.data && error.response.data.data.message) {
                              alert(JSON.stringify(error.response.data.data.message));
                            } else {
                              alert(error);
                            }
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const goToHome = () => {
        navigation.navigate('Dashboard');
    };

    const goToProfile = () => {
        navigation.navigate('Profile');
    };

    const goToSetting = () => {
        navigation.navigate('Setting');
    };

    const goToChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    
    return (
        <>
        <Modal
            animationType="none"
            transparent={true}
            visible={isDrawerVisible}
          >
            <TouchableOpacity
              style={styles.modalBackdrop} // Styling untuk elemen di luar modal
              onPress={toggleDrawer} // Menutup modal saat ditekan di luar modal
            >
              <View style={styles.sidebar}>
                <View style={styles.drawerTitle}>
                  <View style={styles.circleSidebar}>
                  <Image source={dataCurier?.photo || LogoImage} style={styles.logoTop} />
                  </View>
                  <View style={styles.textLogoContainer}>
                  <Text style={[styles.textlogo, { fontSize: 18 }]}>{dataCurier?.name || 'unknown'}</Text>
                  <Text style={styles.textlogo}> {dataCurier ? 'Online' : 'Offline'}</Text>
                  </View>
                </View>
              <View style={styles.drawer}>
                <TouchableOpacity
                  onPress={() => {
                    setDrawerVisible(false);
                    goToHome();
                  }}
                  style={styles.drawerItem}
                >
                  <Icon2 name="book" size={24} color="black" style={styles.drawerIcon} />
                  <Text style={styles.drawerText}> Delivery Order List</Text>
                </TouchableOpacity>
                {/* Tambahkan item lain jika diperlukan */}
              </View>
                
                <View style={styles.drawer}>
                  <TouchableOpacity
                    onPress={() => {
                      setDrawerVisible(false);
                      goToProfile();
                    }}
                    style={styles.drawerItem}
                  >
                    <Icon2 name="user" size={24} color="black" style={styles.drawerIcon} />
                    <Text style={styles.drawerText}> Profile</Text>
                  </TouchableOpacity>
                  {/* Tambahkan item lain jika diperlukan */}
                </View>
                {/* <View style={styles.drawer}>
                  <TouchableOpacity
                    onPress={() => {
                      setDrawerVisible(false);
                      goToSetting();
                    }}
                    style={styles.drawerItem}
                  >
                    <Icon2 name="setting" size={24} color="black" style={styles.drawerIcon} />
                    <Text style={styles.drawerText}> Setting</Text>
                  </TouchableOpacity>
                </View> */}
                
                <View style={styles.drawer}>
                  <TouchableOpacity
                    onPress={() => {
                      setDrawerVisible(false);
                      goToChangePassword();
                    }}
                    style={styles.drawerItem}
                  >
                    <Icon2 name="key" size={24} color="black" style={styles.drawerIcon} />
                    <Text style={styles.drawerText}> Change Password</Text>
                  </TouchableOpacity>
                  {/* Tambahkan item lain jika diperlukan */}
                </View>
                <View style={styles.drawer}>
                  <TouchableOpacity
                    onPress={() => {
                      setDrawerVisible(false);
                      goToLogout();
                    }}
                    style={styles.drawerItem}
                  >
                    <Icon2 name="logout" size={24} color="black" style={styles.drawerIcon} />
                    <Text style={styles.drawerText}> Logout</Text>
                  </TouchableOpacity>
                  {/* Tambahkan item lain jika diperlukan */}
                </View>
              </View>
              
            </TouchableOpacity>
        </Modal>

          <View style={styles.headersidebar}>
            <TouchableOpacity
              onPress={() => setDrawerVisible(true)}
              style={styles.drawerItemIndux}
            >
              <Icon3 name="menu" size={24} color="black" style={styles.drawerIcon} />
              {/* <Text style={styles.drawerText}>SideBar</Text> */}
            </TouchableOpacity>
            
          </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
        backgroundColor: 'white',
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
    bodyContainer: {
        flex: 1,
        resizeMode: 'cover',
    },
    logoTop: {
        width: '100%', // Lebar gambar sesuai dengan lebar container
        height: '100%', // Tinggi gambar sesuai dengan tinggi container
        resizeMode: 'cover',
    },
    layerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        paddingVertical: 16,
        // backgroundColor: 'yellow',
    },
    layerTopText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        // backgroundColor: 'yellow',
    },
    layerTopText2: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'gray',
        // backgroundColor: 'yellow',
    },
    layerTitle: {
        fontSize: 18,
        paddingLeft: 14,
        paddingTop: 16,
        paddingBottom: 10,
        textTransform: 'capitalize',
        color: 'black',
        fontWeight: 'bold',
    },
    layerContainer: {
        flexDirection: 'row',
        paddingVertical: 12,
        backgroundColor: 'white',
        // borderRadius: 25,
    },

    boxContainer: {
        // width: '30%', // Adjust as needed
        marginVertical: 4,
        // alignItems: 'center',
    },
    box: {
        position: 'relative', // Mengatur posisi kotak sebagai relatif
        backgroundColor: 'white',
        borderWidth: 1, // Lebar border
        borderColor: 'grey', // Warna border
        // width: '100%', // Lebar kotak
        height: 80, // Tinggi kotak
        zIndex: 1, // Menempatkan kotak di atas ikon
        margin: 6,
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
    icon: {
        position: 'absolute', // Mengatur posisi ikon sebagai absolut
        width: '100%', // Lebar ikon mengikuti lebar kotak
        height: '100%', // Tinggi ikon mengikuti tinggi kotak
        zIndex: 0, // Menempatkan ikon di belakang kotak
    },
    boxTitle: {
        fontSize: 11,
        marginTop: 8,
        textAlign: 'center',
        // textTransform: 'capitalize',
    },
    layer4: {
        // alignItems: 'center',
        // justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 20,
        paddingLeft: 14,
        backgroundColor: 'orange',
    },
    moreButton: {
        // backgroundColor: 'blue',
        position: 'absolute',
        top: 10, // Sesuaikan dengan jarak dari atas yang Anda inginkan
        left: 5, // Sesuaikan dengan jarak dari kiri yang Anda inginkan
        zIndex: 2, // Menempatkan tombol di atas konten lainnya
        paddingHorizontal: 14,
        paddingVertical: 10,
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
    textColumn: {
        fontSize: 14,
        color: 'black',
    },
    textColumnInduk: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: 14,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(240,240,240,1)',
    },
    column: {
        flex: 1,
    },
    column2: {
        flex: 2,
    },
    column3: {
        flex: 0.25,
    },
    alignRight: {
        alignItems: 'flex-end',
    },
    namaLayananText: {
        flex: 1,
    },

});

export default Header;
