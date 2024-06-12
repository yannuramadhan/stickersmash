import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Screens from '../screens';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function MyTabsRiwayat() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: {
          fontSize: 8,
        },
      })}
    >
      <Tab.Screen name="Simpan Sementara" component={Screens.simpanSementaraScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Proses Operator" component={Screens.prosesOperatorScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Tolak" component={Screens.ditolakScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Kembali Ke Warga" component={Screens.kembaliKeWargaScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Selesai" component={Screens.selesaiScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

export default MyTabsRiwayat;
