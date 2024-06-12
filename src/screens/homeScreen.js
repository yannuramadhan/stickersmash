import React, { useState, useEffect } from 'react';
import { Linking, StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, Alert, BackHandler, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { Button } from 'react-native-paper';
import Header from '../components/header'; // Import komponen Header
import Navbar from '../components/navbar'; // Import komponen Header
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/SimpleLineIcons'; 
import BackgroundImage from '../assets/images/bg.jpg';
import LogoImage from '../assets/images/user.jpg';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
// import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import * as Permissions from 'expo-permissions';
import { useFocusEffect } from '@react-navigation/native';
import * as Device from 'expo-device';
// import Modal from 'react-native-modal';
import { API_CONNECTION } from '@env';
import { selectisUser } from '../components/reducer.js';
import { useSelector } from "react-redux";

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const dataCurier = useSelector(selectisUser);
  const [loading, setLoading] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      const refreshDataAndMenu = () => {
        refreshData();
        refreshMenu();
      };

      const intervalId = setInterval(refreshDataAndMenu, 30000);

      refreshDataAndMenu();

      return () => clearInterval(intervalId); 
    }, [])
  );

  useEffect(() => {
    setTimeout(() => {
      const checkAndRequestPermissions = async () => {
        const permissionsToCheck = [
          PERMISSIONS.ANDROID.INTERNET,
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          PERMISSIONS.ANDROID.MANAGE_DOCUMENTS,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          // PERMISSIONS.ANDROID.ACCESS_MOCK_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_NETWORK_STATE,
        ];

        for (const permission of permissionsToCheck) {
          const status = await check(permission);
          if (status !== RESULTS.GRANTED) {
            // Permission is not granted, request it
            const newStatus = await request(permission);
            if (newStatus !== RESULTS.GRANTED) {
              // Handle the case where the user denied the permission
            }
          }
        }
      };

      checkAndRequestPermissions();
    }, 2000);
  }, []);

  useEffect(() => {
    const backAction = async () => {
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
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Konfirmasi',
        'Apakah Anda yakin ingin keluar?',
        [
          {
            text: 'Tidak',
            onPress: () => { },
            style: 'cancel',
          },
          {
            text: 'Ya',
            onPress: backAction,
          },
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, []);
  
  const goToDetailDSO = (item) => {
    navigation.navigate('DSODetail', {item});
  };

  const refreshMenu = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const value = await AsyncStorage.getItem('isLoggedIn');
        if (value === 'Y') {
          // Jika pengguna sudah login, lakukan apa pun yang diperlukan
        } else {
          navigation.navigate('Login');
        }
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error refreshing menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    const getSetting = await AsyncStorage.getItem('Setting');
    const parseSetting = JSON.parse(getSetting);
    const token = await AsyncStorage.getItem('token');
    const parsedToken = JSON.parse(token);

      try {
        const response = await axios({
          method: "get",
          url: parseSetting.Connection + '/couriers/dso/delivery',
          // body: {},
          headers: { "Content-Type": "application/json", 'Authorization': `${parsedToken.type} ${parsedToken.token}` },
        });


        if (response.status === 200) {
          console.log(response.data.data.data.data);
          setData(response.data.data.data.data);
        }

      } catch (error) {
        console.error('Gagal ambil data:', error);
        navigation.navigate('Login');
      }
  };

    console.log('data', dataCurier);
    
    return (
      <View style={styles.container}>
        {/* <ScrollView> */}
          <Header/>
          <View style={styles.layerTop}>
            <View style={styles.circleContainer}>
              <Image source={dataCurier?.photo || LogoImage} style={styles.logoTop} />
            </View>
            <Text style={styles.layerTopText}>{dataCurier?.name || 'unknown'}</Text>
          <Text style={styles.layerTopText2}>{dataCurier ? 'Online' : 'Offline'} </Text>
            {/* <Text style={styles.layerTopText2}>Bonus :</Text>
            <Text style={styles.layerTopText2}>Kab. Purbalingga, Jawa Tengah</Text> */}
          </View>

          <View style={{ backgroundColor: 'orange', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.layerTitle}>DELIVERY ORDER LIST</Text>
            <TouchableOpacity
              onPress={() => refreshMenu()}
              style={styles.drawerItemIndux2}
            >
              <Icon name="refresh" size={22} color="black" />
              {/* <Text style={styles.drawerText}>SideBar</Text> */}
            </TouchableOpacity>
          </View>
            <ScrollView
              refreshControl={
                  loading ? (
                    <RefreshControl
                      refreshing={loading}
                      colors={['blue']} // Warna loading indicator
                      tintColor={'blue'} // Warna loading indicator
                    />
                  ) : null
                }
            >
              {/* {loading && <ActivityIndicator size="large" color="blue" />} */}
              <View style={styles.bodyContainer}>
              
                {data.length > 0 && (data.map((item, index) => {
                  console.log('item', item);
                  return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => goToDetailDSO(item)}
                    style={styles.cardContainer}
                  >
                    <View style={styles.column}>
                      <Text style={styles.textColumn}>DSO </Text>
                      <Text style={styles.textColumn}>Customer </Text>
                      <Text style={styles.textColumn}>Phone </Text>
                      <Text style={styles.textColumn}>Recipient </Text>
                      <Text style={styles.textColumn}>Rcpt Phone </Text>
                      <Text style={[styles.textColumn, styles.namaLayananText]}>Address </Text>
                    </View>
                    <View style={styles.column2}>
                      <Text numberOfLines={2} style={styles.textColumn}>: {item.orders.dsoNumber}</Text>
                      <Text numberOfLines={2} style={styles.textColumn}>: {item.orders.customer.name}</Text>
                        <Text numberOfLines={2} style={styles.textColumn}>: {item.orders.phoneNumber}</Text>
                        <Text numberOfLines={2} style={styles.textColumn}>: {item.orders.recipient.recipient}</Text>
                        <Text numberOfLines={2} style={styles.textColumn}>: {item.orders.recipientPhone.phone}</Text>
                        <Text numberOfLines={3} style={[styles.textColumn, styles.namaLayananText]}>
                          : {
                            item.orders.recipient.address ?
                              (function () {
                                const updatedAddress = Object.values(item.orders.recipient.address[0])
                                  .filter(value => value !== "" && value !== null && value !== undefined)
                                  .join(", ");
                                return updatedAddress || '';
                              })()
                              : ''
                          }
                        </Text>
                    </View>
                    <View style={styles.column3}>
                      <Text numberOfLines={2} style={styles.textColumn}></Text>
                      <Text numberOfLines={2} style={styles.textColumn}></Text>
                      <Text numberOfLines={3} style={[styles.textColumn, styles.namaLayananText]}></Text>
                      <Text style={styles.textColumn} numberOfLines={2}></Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => ''}
                      style={{ position: 'absolute', top: '50%', right: 5, zIndex: 1, backgroundColor: 'rgba(240,240,240,1)', padding: 8, borderRadius: 30 }}
                    >
                      <Icon3 name="arrow-right" type="font-awesome" color="black" size={25} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}))}
                
              </View>
            </ScrollView>

        {/* </ScrollView> */}
        {/* <Navbar navigation={navigation}/> */}
      </View>
      
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
    width:'100%',
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
    textAlign: 'left',
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    textAlign: 'right',
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

export default HomeScreen;
