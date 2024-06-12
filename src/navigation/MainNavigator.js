import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';

import Screens from '../screens'
import MyTabs from './MyTabs';
import MyTabsRiwayat from './MyTabsRiwayat';

const MainNavigator = () => {
    
    const MainStack = createStackNavigator();

    return (
        <NavigationContainer>
            <MainStack.Navigator initialRouteName="Dashboard">
                <MainStack.Screen 
                    name="Login" 
                    component={Screens.loginScreen} 
                    options={{
                        headerShown:false
                    }} />
                
                <MainStack.Screen 
                    name="ForgotPassword" 
                    component={Screens.forgotPasswordScreen} 
                    options={{
                        headerShown:false
                    }} />
                <MainStack.Screen 
                    name="Dashboard" 
                    component={Screens.homeScreen} 
                    options={{
                        headerShown:false
                    }} />
                <MainStack.Screen
                    name="Profile"
                    component={Screens.accountScreen}
                    options={{
                        headerShown: false
                    }} />
                <MainStack.Screen
                    name="Setting"
                    component={Screens.SettingScreen}
                    options={{
                        headerShown: false
                    }} />
                <MainStack.Screen
                    name="ChangePassword"
                    component={Screens.ChangePasswordScreen}
                    options={{
                        headerShown: false
                    }} />
                
                <MainStack.Screen
                    name="DSODetail"
                    component={Screens.DSODetailScreen}
                    options={{
                        headerTitle: null,
                        headerStyle: {
                            backgroundColor: 'orange'
                        },
                        headerTintColor: 'white',
                        headerShown: true
                    }} />
                <MainStack.Screen
                    name="OrderDetail"
                    component={Screens.OrderDetailScreen}
                    options={{
                        headerTitle: null,
                        headerStyle: {
                            backgroundColor: 'orange'
                        },
                        headerTintColor: 'white',
                        headerShown: true
                    }} />
                <MainStack.Screen
                    name="Confirm"
                    component={Screens.ConfirmScreen}
                    options={{
                        headerTitle: null,
                        headerStyle: {
                            backgroundColor: 'orange'
                        },
                        headerTintColor: 'white',
                        headerShown: true
                    }} />
                
                
                
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator);

const styles = StyleSheet.create({})

