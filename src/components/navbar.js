import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import LogoImage from '../assets/images/logo.png';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const Navbar = ({ navigation }) => {
    return (
        <View style={styles.header}>
            {/* Kotak 1 */}
            <TouchableOpacity
                style={styles.box}
                onPress={() => navigation.navigate('Home')}
            >
            <View style={styles.box}>
                <FontAwesomeIcon name="home" size={30} color="white" />
                <Text style={styles.subHeaderText}>Beranda</Text>
            </View>
            </TouchableOpacity>
            
            {/* Kotak 2 */}
            <TouchableOpacity
                style={styles.box}
                onPress={() => navigation.navigate('Riwayat')}
            >
            <View style={styles.box}>
                <FontAwesomeIcon name="history" size={30} color="white" />
                <Text style={styles.subHeaderText}>Riwayat</Text>
            </View>
            </TouchableOpacity>

            {/* Kotak 3 */}
            <TouchableOpacity
                style={styles.box}
                onPress={() => navigation.navigate('Petunjuk')}
            >
            <View style={styles.box}>
                <FontAwesomeIcon name="list-alt" size={30} color="white" />
                <Text style={styles.subHeaderText}>Petunjuk</Text>
            </View>
            </TouchableOpacity>

            {/* Kotak 4 */}
            <TouchableOpacity
                style={styles.box}
                onPress={() => navigation.navigate('Akun')}
            >
            <View style={styles.box}>
                <FontAwesomeIcon name="user" size={30} color="white" />
                <Text style={styles.subHeaderText}>Akun</Text>
            </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'rgba(0, 150, 100, 1)',
        height: 80,
        alignItems: 'center',
        justifyContent: 'space-between', // Menggunakan space-between untuk mengatur jarak antara kotak
        flexDirection: 'row', // Menambahkan flexDirection agar kotak berjajar horizontal
        paddingHorizontal: 20, // Padding horizontal agar kotak terpisah
    },
    box: {
        alignItems: 'center',
        padding: 8,
    },
    logo: {
        width: 50, // Sesuaikan dengan ukuran logo
        height: 45, // Sesuaikan dengan ukuran logo
        marginBottom: 5, // Jarak antara logo dan teks
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    subHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default Navbar;
