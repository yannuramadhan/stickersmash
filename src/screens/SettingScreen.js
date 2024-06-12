import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, Image, Switch } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { TextInput, Button } from 'react-native-paper';
import Header from '../components/header'; // Import komponen Header
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/SimpleLineIcons';
import LogoImage from '../assets/images/icon.png'; 

const SettingScreen = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [url, setURL] = useState('');
  const [port, setPort] = useState('');

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const handleSave = async () => {
    const data = {
      'Connection': `${url}${port}`,
      'URL': url,
      'Port': port,
      'Auto': isEnabled
    }
    // console.log(data);
    await AsyncStorage.setItem('Setting', JSON.stringify(data));
    alert('Setup successful');
    navigation.navigate('Login');
  };

  const getConnection = async () => {
    const getSetting = await AsyncStorage.getItem('Setting');
    const parseSetting = JSON.parse(getSetting);
    console.log(parseSetting.Connection);

    if(getSetting) {
      setURL(parseSetting.URL);
      setPort(parseSetting.Port);
      setIsEnabled(parseSetting.Auto);
    }
  };

  useEffect(() => {
    getConnection();
  }, []);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Gambar/logo */}
        <Image source={LogoImage} style={styles.logo} />

        {/* View untuk mengelompokkan teks */}
        <View style={styles.textLogoContainer}>
          <Text style={[styles.textlogo, { fontSize: 25 }]}>HokBen</Text>
          <Text style={[styles.textlogo, { fontSize: 25 }]}>Delivery</Text>
          {/* <Text style={styles.textlogo}>Delivery Order</Text> */}
        </View>
      </View>

        <View style={{ borderWidth: 2, borderColor: 'orange', borderRadius: 10, width: '100%', padding: 14, marginBottom: 14, }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Setup Connection</Text>
          </View>
          <TextInput
            label="URL"
            mode="outlined"
            activeOutlineColor="blue"
            value={url}
            onChangeText={(text) => setURL(text)}
            style={styles.input}
          />
          {/* <TextInput
            label="Port"
            mode="outlined"
            activeOutlineColor="blue"
            value={port}
            onChangeText={(text) => setPort(text)}
            style={styles.input}
          /> */}
          <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', }}>
            <Text style={{ fontSize: 16 }}>Auto Sync : </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "blue" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Save
        </Button>
        <Button onPress={goToLogin} style={styles.buttonback} color="black">
          Back To Login Page
        </Button>
        {/* <Button onPress={handleRegister} style={styles.registerButton} color="black">
                Daftar
            </Button> */}
      
        {/* <View style={styles.layerContainer}>
          <View style={styles.boxContainer}>
            <Text style={styles.layerTitle}>Setting</Text>
            <TextInput
              label="URL"
              mode="outlined"
              activeOutlineColor="blue"
              value={url}
              onChangeText={(text) => setURL(text)}
              style={styles.input}
            />
            <TextInput
              label="Port"
              mode="outlined"
              activeOutlineColor="blue"
              value={port}
              onChangeText={(text) => setPort(text)}
              style={styles.input}
            />
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', }}>
              <Text style={{fontSize: 16}}>Auto Sync : </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "blue" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleSave}><Text style={styles.buttonText}>SAVE</Text></TouchableOpacity>
          <TouchableOpacity style={styles.buttonBack} onPress={goToHome}><Text style={styles.buttonText}>BACK</Text></TouchableOpacity>
        </View> */}
    </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Menggunakan flex: 1 agar kontennya memenuhi seluruh tinggi layar
    alignItems: 'center',
    justifyContent: 'center', // Center secara horizontal dan vertikal
    padding: 18,
    paddingTop: 50,
    marginHorizontal: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 30,
  },
  logo: {
    width: 100, // Sesuaikan lebar gambar
    height: 100, // Sesuaikan tinggi gambar
  },
  textLogoContainer: {
    marginLeft: 8,
    flexDirection: 'column',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textlogo: {// Ubah ukuran font sesuai kebutuhan Anda
    fontWeight: 'bold',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center', // Align the title to the left
    marginBottom: 14,
  },
  layerTitle: {
    fontSize: 20,
    marginTop: 10,
    paddingTop: 12,
    paddingBottom: 6,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  boxContainer: {
    width: '100%',
    marginVertical: 4,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'orange',
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
  button: {
    width: '100%',
    padding: 8,
    backgroundColor: 'orange',
  },
  buttonback: {
    marginTop: 16,
  },
  buttonText: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
  input: {
    width: '100%',
    marginBottom: 5,
  },
});

export default SettingScreen;
