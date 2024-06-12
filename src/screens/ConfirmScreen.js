import React, { useState, useEffect } from 'react';
import { Dimensions,  StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import MapView from 'react-native-open-street-map';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import { API_CONNECTION } from '@env';
import ImagePicker from 'react-native-image-crop-picker';

const ConfirmScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [location, setLocation] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [receive, setReceive] = useState('');
  const [status, setStatus] = useState({});
  const [PaymentOptions, setPaymentOptions] = useState([]);
  const [StatusOptions, setStatusOptions] = useState([]);
  const [cameraRoll, setCameraRoll] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log({ latitude, longitude });
        setCoordinates({ latitude, longitude });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }, []);
  
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setLocation(position);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        setLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
    console.log(location);
  };

  const onMapPress = (e) => {
    const { coordinate } = e.nativeEvent;
    setCoordinates(coordinate);
  };

  const goToDoneDSO = async () => {
    // Validasi status
    if (!status) {
      alert("Please select a status.");
      return;
    }

    // Validasi item
    if (!item) {
      alert("Please select an item.");
      return;
    }

    // Validasi receive
    if (!receive) {
      alert("Please enter the receiver's name.");
      return;
    }

    // Validasi location
    if (!location) {
      alert("Please provide the location.");
      return;
    }

    // Validasi cameraRoll
    if (!cameraRoll) {
      alert("Please provide the photo.");
      return;
    }
    setIsLoading(true);

    const getSetting = await AsyncStorage.getItem('Setting');
    const parseSetting = JSON.parse(getSetting);
    const token = await AsyncStorage.getItem('token');
    const parsedToken = JSON.parse(token);
    
    const currentDate = new Date();
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: false });
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Tambahkan 1 karena bulan dimulai dari 0
    const date = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;

    const arrived = formattedDate + ' ' + formattedTime;
    const formData = new FormData();
    formData.append('statusId', Number(status.value));
    formData.append('version', item.orders.version);
    formData.append('receiverName', receive);
    formData.append('arrivedAt', arrived);
    formData.append('lat', location ? location.coords.latitude.toString() : '');
    formData.append('lan', location ? location.coords.longitude.toString() : '');
    formData.append('photo', {
      name: cameraRoll,
      type: 'image/jpg',
      uri: cameraRoll
    });

    console.log(formData);

    try {
      const response = await axios({
        method: "patch",
        url: parseSetting.Connection + '/couriers/dso/' + item.dsoOrderId,
        data: formData,
        headers: { "Content-Type": "multipart/form-data", 'Authorization': `${parsedToken.type} ${parsedToken.token}` },
      });

      
      setIsLoading(false);
      if (response.status === 200) {
        console.log(response.data.data.message)
        Alert.alert(
          'Info',
          response.data.data.message,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Dashboard')
            }
          ]
        );
        
      } else {
        alert(JSON.stringify(response.data.response.message));
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      if (error.response && error.response.data && error.response.data.data && error.response.data.data.message) {
        alert(JSON.stringify(error.response.data.data.message));
      } else {
        alert(error);
      }
    }

  };


  const {
    width,
    height,
  } = Dimensions.get('window');

  const region = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0922 * (width / height)
  };

  const handleCamera = async () => {
    try {
      const cameraImage = await ImagePicker.openCamera({
        compressImageQuality: 0.2,
        cropping: true,
        includeBase64: false,
      });

      console.log(cameraImage)

      const gambar = cameraImage.path;
      setCameraRoll(gambar);
    } catch (error) {
      console.error('Error handling camera:', error);
    }
  };



  const handleDeletePhoto = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => setCameraRoll(''),
          style: 'destructive',
        },
      ]
    );
  };


  const getOptionPayment = async () => {
    const getSetting = await AsyncStorage.getItem('Setting');
    const parseSetting = JSON.parse(getSetting);
    const token = await AsyncStorage.getItem('token');
    const parsedToken = JSON.parse(token);

    try {
      const response = await axios({
        method: "get",
        url: parseSetting.Connection + '/orders/payment-method',
        // body: {},
        headers: { "Content-Type": "application/json", 'Authorization': `${parsedToken.type} ${parsedToken.token}` },
      });


      if (response.status === 200) {
        const respon = response.data.data.data;
        console.log(respon);
        const newItems = respon.map((item) => ({
          label: item.name,
          value: item.id.toString()
        }))
        setPaymentOptions(newItems);
      }

    } catch (error) {
      console.error('Gagal ambil data:', error);
      if (error.response && error.response.data && error.response.data.data && error.response.data.data.message) {
        alert(JSON.stringify(error.response.data.data.message));
      } else {
        alert(error);
      }
    }
  };

  const getOptionStatus = async () => {
    const getSetting = await AsyncStorage.getItem('Setting');
    const parseSetting = JSON.parse(getSetting);
    const token = await AsyncStorage.getItem('token');
    const parsedToken = JSON.parse(token);

    try {
      const response = await axios({
        method: "get",
        url: parseSetting.Connection + '/orders/status-courier',
        // body: {},
        headers: { "Content-Type": "application/json", 'Authorization': `${parsedToken.type} ${parsedToken.token}` },
      });


      if (response.status === 200) {
        const respon = response.data.data.data;
        console.log(respon);
        const newItems = respon.map((item) => ({
          label: item.name,
          value: item.id.toString()
        }))
        setStatusOptions(newItems);
      }

    } catch (error) {
      console.error('Gagal ambil data:', error);
      if (error.response && error.response.data && error.response.data.data && error.response.data.data.message) {
        alert(JSON.stringify(error.response.data.data.message));
      } else {
        alert(error);
      }
    }
  };

  useEffect(() => {
    getOptionPayment();
    getOptionStatus();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.layerTitle}>Confirmation</Text>
        <View style={styles.layerContainer}>
          <View style={styles.boxContainer}>
            <Text>Received By : </Text>
            <TextInput style={styles.input} value={receive} onChangeText={(text) => setReceive(text)}></TextInput>
            {/* <Text>Payment Type : </Text> */}
            {/* <View style={styles.dropdownContainer}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={PaymentOptions}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder=""
                value={paymentType}
                onChange={(text) => setPaymentType(text)}
              />
            </View> */}
            <Text>Status Delivery : </Text>
            <View style={styles.dropdownContainer}>
              {/* {renderLabelStatic("Jenis Kelamin")} */}
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={StatusOptions}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder=""
                value={status}
                onChange={(text) => setStatus(text)}
              />
            </View>
            {/* <Text>If Other : </Text> */}
            {/* <TextInput style={styles.input} value={other} onChangeText={(text) => setOther(text)}></TextInput> */}
            {/* <Text>Latitude: {coordinates ? coordinates.latitude : null}, Longitude: {coordinates ? coordinates.longitude : null}</Text> */}
            <TouchableOpacity style={styles.buttonGet} onPress={() => handleCamera()}><Text style={styles.buttonText}> TAKE A PHOTO</Text></TouchableOpacity>
            {cameraRoll !== '' && (
              <View>
                <TouchableOpacity
                  onPress={() => handleDeletePhoto()}
                  style={{ borderRadius: 10, position: 'absolute', top: 6, right: 6, zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10 }}>
                  <Icon name="trash" size={30} color="red" />
                </TouchableOpacity>
                <Image
                  source={{ uri: cameraRoll }}
                  style={{ width: '100%', height: 400, resizeMode: 'contain', backgroundColor: 'black', marginBottom: 10 }}
                />
              </View>
            )}
            {cameraRoll === '' && (
              <View>
              <Text>No Photo</Text>
              </View>
            )}
            <TouchableOpacity style={styles.buttonGet} onPress={getLocation}><Text style={styles.buttonText}> GET LOCATION</Text></TouchableOpacity>
            <Text>Latitude : </Text>
            <TextInput style={styles.inputDisable} disabled='true' value={location ? location.coords.latitude.toString() : ''}></TextInput>
            <Text>Longitude : </Text>
            <TextInput style={styles.inputDisable} disabled='true' value={location ? location.coords.longitude.toString() : ''}></TextInput>
            {/* <Text>Latitude: {location ? location.coords.latitude : null}</Text>
            <Text>Longitude: {location ? location.coords.longitude : null}</Text> */}
          </View>
          <TouchableOpacity loading={isLoading} style={styles.button} onPress={goToDoneDSO}><Text style={styles.buttonText}> CONFIRM</Text></TouchableOpacity>
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
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  inputArea: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white'

  },
  inputDisable: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    // borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 8,
    // backgroundColor: 'lightgray',
    justifyContent: 'center',
  },
  buttonGet: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    width: '40%'
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
  },
  dropdownContainer: {
    flex: 1,
    // borderWidth: 2, 
    // borderColor: 'lightgrey', 
    // backgroundColor: 'yellow',
    width: '100%',
  },
  label: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    fontSize: 12,
    color: 'grey',
  },
  dropdown: {
    marginTop: 8,
    height: 40,
    width: '100%',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1.2,
    // borderWidth: 1,
    // borderRadius: 5,
    // borderColor: 'grey',
    paddingRight: 8,
    paddingLeft: 12,
    backgroundColor: 'white',
    marginBottom: 4,
  },
  icon: {
    marginRight: 5,

  },
  placeholderStyle: {
    fontSize: 16,
    color: 'grey',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,

  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  map: {
    height: 200, // Sesuaikan tinggi peta sesuai kebutuhan
    marginVertical: 10,
  },
});

export default ConfirmScreen;
