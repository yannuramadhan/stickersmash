import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import LogoImage from '../assets/images/icon.png';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import * as Device from 'expo-device';
import { API_CONNECTION } from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { selectisUser, setisUser } from '../components/reducer.js';

const LoginScreen = ({ navigation }) => {
    // const [imei, setimei] = useState('');
    // const [perangkat, setPerangkat] = useState('');
    const dispatch = useDispatch();
    const [userid, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dataCurier = useSelector(selectisUser);

    useEffect(() => {
        AsyncStorage.getItem('isLoggedIn').then((value) => {
            if (value === 'Y') {
            } else {
                navigation.navigate('Login');
            }
        });

    }, []);

    useEffect(() => {
    }, [isLoading]);

    const handleLogin = async () => {
        const getSetting = await AsyncStorage.getItem('Setting');
        const parseSetting = JSON.parse(getSetting);

        setIsLoading(true);
        
        if (!userid || !password) {
            alert('User Id dan Password wajib diisi.');
            setIsLoading(false);
            return;
        }

        if (!parseSetting) {
            alert('Silahkan Setting Connection Terlebih Dahulu.');
            setIsLoading(false);
            return;
        }
        // Membuat objek FormData untuk mengirim data multipart/form-data
        const formData = new FormData();
        formData.append('uid', userid);
        formData.append('password', password);
        // formData.append('imei', imei+perangkat);
        // formData.append('perangkat', perangkat);

        // Membuat permintaan POST dengan tipe konten multipart/form-data
        try {
            const response = await axios({
                method: "post",
                url: parseSetting.Connection + '/auth/login',
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setIsLoading(false);
            // console.log(response.data.data.token);
            if (response.status === 200) {
                AsyncStorage.setItem('isLoggedIn', 'Y')
                    .then(() => {
                        return AsyncStorage.setItem('token', JSON.stringify(response.data.data.token));
                    })
                    .then(() => {
                        return dispatch(setisUser(response.data.data.user))
                    })
                    .then(() => {
                        navigation.navigate('Dashboard');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            } else
            {
                alert(JSON.stringify(response.data.response.message));
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data && error.response.data.data && error.response.data.data.message) {
                alert(JSON.stringify(error.response.data.data.message));
            } else {
                alert(error);
            }
            setIsLoading(false);
        }
    };

    const handleSetting = async () => {
        navigation.navigate('Setting');
    };

    const handleforgotPassword = () => {
        // Navigate to the Register screen
        navigation.navigate('ForgotPassword');
    };

    const getUserCache = async () => {
        if (dataCurier) {
            setUserId(dataCurier.username);
        }
    };

    useEffect(() => {
        getUserCache();
    }, []);

    return (
        <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* Gambar/logo */}
                <Image source={LogoImage} style={styles.logo} />

                {/* View untuk mengelompokkan teks */}
                <View style={styles.textLogoContainer}>
                    <Text style={[styles.textlogo, {fontSize: 25}]}>HokBen</Text>
                    <Text style={[styles.textlogo, { fontSize: 25 }]}>Delivery</Text>
                    {/* <Text style={styles.textlogo}>Delivery Order</Text> */}
                </View>
            </View>
            
                <View style={{ borderWidth: 2, borderColor: 'orange', borderRadius: 10, width: '100%', padding: 14, marginBottom: 14, }}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Login</Text>
                    </View>
                <TextInput
                    label="User Id"
                    mode="outlined"
                    activeOutlineColor="blue"
                    value={userid}
                    onChangeText={(text) => setUserId(text)}
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    mode="outlined"
                    activeOutlineColor="blue"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                    right={
                        <TextInput.Icon
                            name={showPassword ? 'eye-off' : 'eye'}
                            color="grey"
                            style={{ backgroundColor: 'transparent' }}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                />

                    <Button onPress={handleforgotPassword} style={styles.forgotPasswordButton} color="black">
                        Forgot Password ?
                    </Button>
            </View>
            <Button
                mode="contained"
                loading={isLoading}
                onPress={handleLogin}
                style={styles.button}
                disabled={isLoading}
                labelStyle={styles.buttonText}
            >
                {isLoading ? (
                    'Loading ...'
                ) : (
                    'Login'
                )}
            </Button>
            <Button
                mode="contained"
                onPress={handleSetting}
                style={styles.buttonSetting}
                disabled={isLoading}
                labelStyle={styles.buttonText}
            >
                Setting
            </Button>
            {/* <Button onPress={handleRegister} style={styles.registerButton} color="black">
                Daftar
            </Button> */}
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
    title: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14, // Set font size sama dengan username
        color: 'gray', // Warna teks yang sesuai
    },
    input: {
        width: '100%',
        marginBottom: 5,
    },
    passwordInput: {
        width: '100%',
        marginTop: 5,
        marginBottom: 5,
    },
    button: {
        width: '100%',
        padding: 8,
        backgroundColor: 'orange',
    },
    buttonSetting: {
        marginTop: 10,
        width: '100%',
        padding: 8,
        backgroundColor: 'blue',
    },
    buttonText: {
        fontSize: 13,
        color: 'white',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButton: {
        marginTop: 16,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        // marginBottom: 13,
        marginTop: 2,
    },
});

export default LoginScreen;
