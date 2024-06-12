import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import React from 'react';
import store from './src/components/store.js'
import { Provider } from 'react-redux';

import { MainNavigator } from './src/navigation';

export default function App() {
  return (
    <View>
      <Provider store={store}>
        <StatusBar barStyle="default" />
        <MainNavigator />
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
