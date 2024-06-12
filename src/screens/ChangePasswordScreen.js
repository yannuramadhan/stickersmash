import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { TextInput, Button } from 'react-native-paper';
import Header from '../components/header'; // Import komponen Header
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/SimpleLineIcons';
import LogoImage from '../assets/images/user.jpg';
import { API_CONNECTION } from '@env';
import { selectisUser } from '../components/reducer.js';
import { useSelector } from "react-redux";

const ChangePasswordScreen = ({ navigation }) => {
  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOTP, setIsLoadingOTP] = useState(false);
  const dataCurier = useSelector(selectisUser);

  useEffect(() => {
  }, [isLoading, isLoadingOTP]);

  const goToHome = () => {
    navigation.navigate('Dashboard');
  };

  const goToReset = async () => {
      setIsLoading(true);
      const getSetting = await AsyncStorage.getItem('Setting');
      const parseSetting = JSON.parse(getSetting);
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const parsedToken = JSON.parse(token);
        console.log(parsedToken);
        const formData = new FormData();
        formData.append('otp', otp);
        formData.append('password', password);
        formData.append('password_confirmation', passwordConfirm);

        console.log('formData', formData);

        try {
          const response = await axios({
            method: "post",
            url: parseSetting.Connection + '/auth/reset/password',
            data: formData,
            headers: { "Content-Type": "multipart/form-data", 'Authorization': `${parsedToken.type} ${parsedToken.token}`, },
          });
          if (response.status === 200) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.setItem('isLoggedIn', 'N'); 
            Alert.alert(
              'Alert',
              response.data.data.message,
              [
                
                {
                  text: 'OK',
                  onPress: async () => {
                    navigation.navigate('Dashboard'); 
                  },
                },
              ],
              { cancelable: false }
            );
          } else {
            console.log(response.data.data.message);
          }

        } catch (error) {
          console.error(error);
          if (error.response && error.response.data && error.response.data.data && error.response.data.data.message) {
            alert(JSON.stringify(error.response.data.data.message));
          } else {
            alert(error);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        navigation.navigate('Login');
      }
  };

  const handleRequestOTP = async () => {
    setIsLoadingOTP(true);
    const getSetting = await AsyncStorage.getItem('Setting');
    const parseSetting = JSON.parse(getSetting);
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const parsedToken = JSON.parse(token);
    

      const formData = new FormData();
      formData.append('email', dataCurier.email);

      if (!passwordConfirm || !password) {
        alert('New Password dan Confirm New Password wajib diisi.');
        setIsLoadingOTP(false);
        return;
      }

      try {
        const response = await axios({
          method: "post",
          url: parseSetting.Connection + '/auth/reset/password',
          data: formData,
          headers: { "Content-Type": "multipart/form-data", "Authorization": `${parsedToken.type} ${parsedToken.token}` },
        });

        if (response.status === 200) {
          alert(response.data.response.message);
        } else {
          alert(response.data.response.message);
        }
      } catch (error) {
        console.log(error);
        if (error.response && error.response.data && error.response.data.data && error.response.data.data.message) {
          alert(JSON.stringify(error.response.data.data.message));
        } else {
          alert(error);
        }
      } finally {
        setIsLoadingOTP(false);
      }
    }

  };

  return (
    <View style={styles.container}>
      <Header/>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.layerTitle}>Change Password</Text>
        <View style={styles.layerContainer}>
          <View style={styles.boxContainer}>
            <Text>New Password : </Text>
            <TextInput style={styles.input} value={password} onChangeText={(text) => setPassword(text)}></TextInput>
            <Text>Confirm New Password : </Text>
            <TextInput style={styles.input} value={passwordConfirm} onChangeText={(text) => setPasswordConfirm(text)}></TextInput>
            <Text>OTP Code : </Text>
            <View style={styles.otpContainer}>
              <TextInput
                value={otp}
                activeOutlineColor="blue"
                onChangeText={(text) => setOTP(text)}
                style={styles.otpInput}
              />
              <Button
                mode="contained"
                loading={isLoadingOTP}
                onPress={handleRequestOTP}
                style={styles.requestOTPButton}
                disabled={isLoadingOTP}
                labelStyle={styles.requestOTPButtonText}
              >
                {isLoadingOTP ? (
                  'Loading ...'
                ) : (
                  'Request OTP'
                )}
              </Button>
            </View>
          </View>
          <TouchableOpacity loading={isLoading} style={styles.button} onPress={goToReset}><Text style={styles.buttonText}>SAVE</Text></TouchableOpacity>
          <TouchableOpacity style={styles.buttonBack} onPress={goToHome}><Text style={styles.buttonText}>BACK</Text></TouchableOpacity>
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white'

  },
  button: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    height: 40,
    marginTop: 10,
  },
  buttonBack: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    height: 40,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    padding: 14,
    fontWeight: 'bold'
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
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%',
  },
  otpInput: {
    flex: 1, // Use flex to make the input take up remaining space
    marginRight: 8, // Add some spacing between the input and button
    height: 40,
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 4,
    // marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  requestOTPButton: {
    backgroundColor: 'darkorange',
  },
  requestOTPButtonText: {
    fontSize: 14,
    color: 'white',
    // padding: 8,
  },
});

export default ChangePasswordScreen;
