import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Screens from '../screens';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: {
          fontSize: 12,
          padding: 2,
        },
        tabBarStyle: {
          height: 55,
          padding: 16,
        },
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === 'Beranda') {
            iconName = focused ? 'home' : 'home'; 
          } else if (route.name === 'Riwayat') {
            iconName = focused ? 'history' : 'history';
          } else if (route.name === 'Petunjuk') {
            iconName = focused ? 'list-alt' : 'list-alt';
          } else if (route.name === 'Akun') {
            iconName = focused ? 'user' : 'user';
          }
          
          return (
            <View style={{ marginBottom: 6}}>
              <FontAwesomeIcon
                name={iconName}
                size={28}
                color={focused ? 'blue' : 'grey'}
              />
            </View>
          );
        },
      })}
    >
      
      <Tab.Screen name="Beranda" component={Screens.homeScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Riwayat" component={Screens.riwayatScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Petunjuk" component={Screens.petunjukScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Akun" component={Screens.accountScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

export default MyTabs;
