import React, { useState, useEffect } from 'react';
import { Linking, StyleSheet, View, Text, ScrollView, TextArea, TouchableOpacity, Image, BackHandler, ImageBackground } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Header from '../components/header'; // Import komponen Header
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { API_CONNECTION } from '@env';

const DSODetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [Data, setData] = useState([]);

  useEffect(() => {
    getDataDso();
  }, []);

  const goToOrderDetail = () => {
    navigation.navigate('OrderDetail', { item });
  };

  const getDataDso = async () => {
    const getSetting = await AsyncStorage.getItem('Setting');
    const parseSetting = JSON.parse(getSetting);
    const token = await AsyncStorage.getItem('token');
    const parsedToken = JSON.parse(token);

    try {
      const response = await axios({
        method: "get",
        url: parseSetting.Connection + `/orders/detail/${item.dsoOrderId}`,
        // body: {},
        headers: { "Content-Type": "application/json", 'Authorization': `${parsedToken.type} ${parsedToken.token}` },
      });


      if (response.status === 200) {
        console.log(response.data.data.data[0].orderDetails);
        // setDataOrder(response.data.data.data[0].orderDetails);
        const tempmenu = response.data.data.data[0].orderDetails;
        try {
          const newDataInfoStoreStatus = [];
          tempmenu.forEach((item) => {
            const datamodifiers = [];
            item.modifiers.forEach((items) => {
              datamodifiers.push({
                id: items.modifier.id,
                modifier: items.modifier.modifier,
              });
            });
            const newItem = {
              id: item.menu.id,
              name: item.menu.menuName,
              qty: item.qty,
              pricebeforetax: item.price,
              discount: item.discount,
              totalpricebeforetax: item.subTotal,
              modifier: datamodifiers,
            };

            newDataInfoStoreStatus.push(newItem);
          });

          const datamenustore = [];
          datamenustore.push({
            id: response.data.data.data[0].store.id,
            store: response.data.data.data[0].store.storeName,
            menuItems: newDataInfoStoreStatus
          });

          setData(datamenustore);

        } catch (error) {
          console.error('Error occurred:', error);
        }
      }

    } catch (error) {
      console.error('Gagal ambil data:', error);
    }
  };

  const handleGoMaps = () => {
    if (!item.orders.latitude || !item.orders.longitude) {
      alert('latitude and longitude not found');
      return;
    }
    const address = `${item.orders.latitude}, ${item.orders.longitude}`
    const googleMapsUrl = Platform.select({
      ios: `https://maps.apple.com/?q=${encodeURIComponent(address)}`,
      android: `google.navigation:q=${encodeURIComponent(address)}`,
    });

    Linking.canOpenURL(googleMapsUrl).then((supported) => {
      if (supported) {
        Linking.openURL(googleMapsUrl);
      } else {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
      }
    });
  };




  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.layerTitle}>Detail DSO</Text>
        <View style={styles.layerContainer}>
          <View style={styles.boxContainer}>
            <Text>DSO : </Text>
            <View style={styles.input}>
              <Text style={{ fontSize: 14 }}>{item.orders.dsoNumber}</Text>
            </View>
            <Text>Customer : </Text>
            <View style={styles.input}>
              <Text style={{ fontSize: 14 }}>{item.orders.customer.name}</Text>
            </View>
            <Text>Phone : </Text>
            <View style={styles.input}>
              <Text style={{ fontSize: 14 }}>{item.orders.phoneNumber}</Text>
            </View>
            <Text>Recipient : </Text>
            <View style={styles.input}>
              <Text style={{ fontSize: 14 }}>{item.orders.customer.name}</Text>
            </View>
            <Text>Rcpt Phone : </Text>
            <View style={styles.input}>
              <Text style={{ fontSize: 14 }}>{item.orders.phoneNumber}</Text>
            </View>
            <Text>Address : </Text>
            <View style={styles.otpContainer}>
              <View style={styles.inputArea}>
                <Text style={{ fontSize: 14 }}>
                  {
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
              <TouchableOpacity
                style={styles.requestOTPButton}
                onPress={() => handleGoMaps()}
              >
                <Text style={styles.requestOTPButtonText}>MAPS</Text>
              </TouchableOpacity>

            </View>
            
          </View>
              <TouchableOpacity style={styles.button} onPress={goToOrderDetail}><Text style={styles.buttonText}>NEXT</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
        backgroundColor: 'rgba(255, 255, 255, 0.90)',
    },
    layerTitle: {
        fontSize: 18,
        paddingLeft: 14,
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
        paddingHorizontal: 25,
        backgroundColor: 'white',
        flex: 1,
    },
    boxContainer: {
        width: '100%',
        marginVertical: 4,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
    },
    label: {
        fontSize: 16,
        color: 'black',
        marginBottom: 6,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        justifyContent:'center',
    },
    inputArea: {
        // height: 60,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        width: '70%',

    },
    button: {
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        height: 40,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        padding: 14,
    },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  otpInput: {
    flex: 1, // Use flex to make the input take up remaining space
    marginRight: 8, // Add some spacing between the input and button
  },
  requestOTPButton: {
    height: 40,
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'darkorange',
    justifyContent: 'center',
    alignItems: 'center',
    width: '28%'
  },
  requestOTPButtonText: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 14,
  },
});

export default DSODetailScreen;
