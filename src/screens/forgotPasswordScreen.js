import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import LogoImage from '../assets/images/icon.png';
import axios from 'axios';
import * as Device from 'expo-device';
import { API_CONNECTION } from '@env';

const ForgotPasswordScreen = ({ navigation }) => {
    // const [imei, setimei] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [perangkat, setPerangkat] = useState('');
    const [otp, setOTP] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOTP, setIsLoadingOTP] = useState(false);

    useEffect(() => {
    }, [isLoading, isLoadingOTP]);

    // useEffect(() => {
    //     getDevicesID();
    //     getDevicesName();
    //     // DeviceInfo.getSerialNumber().then((serialNumber) => {
    //     //     setimei(serialNumber);
    //     // });
    // }, []);

    const getDevicesID = async () => {
        let device = await DeviceInfo.getDeviceId();
        setimei(device);
    }

    const getDevicesName = async () => {
        let device = await DeviceInfo.getDeviceName();
        setPerangkat(device);
    }

    const handleResetPassword = async () => {
        const getSetting = await AsyncStorage.getItem('Setting');
        const parseSetting = JSON.parse(getSetting);
        setIsLoading(true);
        if (!email) {
            alert('Email wajib diisi.');
            setIsLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('otp', otp);
        
        try {    
            const response = await axios({
            method: "post",
            url: parseSetting.Connection + '/auth/forgot/password',
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            });

            setIsLoading(false);

            if (response.status === 200) {
                alert(response.data.response.message);
                navigation.navigate('Login');
            } else {
                alert(response.data.response.message);
            }
            
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.data && error.response.data.data.message) {
                alert(JSON.stringify(error.response.data.data.message));
            } else {
                alert(error);
            }
            setIsLoading(false);
        }
    };

    const handleLogin = () => {
        // Navigate to the Login screen
        navigation.navigate('Login');
    };

    const handleRequestOTP = async () => {
        const getSetting = await AsyncStorage.getItem('Setting');
        const parseSetting = JSON.parse(getSetting);
        setIsLoading(true);
        if (!email || !password) {
            alert('Email dan New Password wajib diisi.');
            setIsLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append('email', email);

        try {
            const response = await axios({
                method: "post",
                url: parseSetting.Connection + '/auth/forgot/password',
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setIsLoading(false);

            if (response.status === 200) {
                alert(response.data.response.message);
            } else {
                alert(response.data.response.message);
            }

        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.data && error.response.data.data.message) {
                alert(JSON.stringify(error.response.data.data.message));
            } else {
                alert(error);
            }
            setIsLoading(false);
        }
        
    };

    return (
        <ScrollView>
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* Gambar/logo */}
                <Image source={LogoImage} style={styles.logo} />

                {/* View untuk mengelompokkan teks */}
                <View style={styles.textLogoContainer}>
                    <View style={styles.textLogoContainer}>
                    <Text style={[styles.textlogo, { fontSize: 25 }]}>HokBen</Text>
                    <Text style={[styles.textlogo, { fontSize: 25 }]}>Delivery</Text>
                </View>
                </View>
            </View>
                <View style={{ borderWidth: 2, borderColor: 'orange', borderRadius: 10, width: '100%', padding: 14, marginBottom: 14, }}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Reset Password</Text>
                    {/* <Text style={styles.subtitle}>Silahkan isi untuk mereset passsword Anda</Text> */}
                </View>
                
                <TextInput
                    label="Email"
                    value={email}
                    mode="outlined"
                    activeOutlineColor="blue"
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    label="New Password"
                    value={password}
                    mode="outlined"
                    activeOutlineColor="blue"
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                />

                    <View style={styles.otpContainer}>
                        <TextInput
                            label="OTP Code"
                            value={otp}
                            mode='outlined'
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

            <Button
                mode="contained"
                loading={isLoading}
                onPress={handleResetPassword}
                style={styles.button}
                disabled={isLoading}
                labelStyle={styles.buttonText}
            >
                {isLoading ? (
                    'Loading ...'
                ) : (
                    'Send To Email'
                )}
            </Button>

            <Button onPress={handleLogin} style={styles.loginButton} color="black">
                Back To Login Page
            </Button>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
        marginLeft: 4,
        flexDirection: 'column',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textlogo: {
        fontWeight: 'bold',
    },
    titleContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 14,
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: 'gray',
    },
    input: {
        width: '100%',
        marginBottom: 5,
    },
    otpContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Center vertically
        marginBottom: 16,
        width: '100%',
    },
    otpInput: {
        flex: 1, // Use flex to make the input take up remaining space
        marginRight: 8, // Add some spacing between the input and button
    },
    requestOTPButton: {
        height: 50, // Set the desired height for the button
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center', // Center text both horizontally and vertically
    },
    requestOTPButtonText: {
        fontSize: 13,
        color: 'white',
        textAlign: 'center',
    },
    button: {
        width: '100%',
        padding: 8,
        backgroundColor: 'orange',
    },
    buttonText: {
        fontSize: 13,
        color: 'white',
        textAlign: 'center',
    },
    loginButton: {
        marginTop: 16,
    },
});

export default ForgotPasswordScreen;
