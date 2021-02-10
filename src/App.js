import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Provider} from 'react-redux';
import AppNavigator from './AppNavigator';
import {store} from './store';
import {HomeRec} from './pages/home/component';
import {EditProfilePage} from './pages/user';

export default function App() {
  return (
    <Provider store={store}>
      {/* <HomeRec /> */}
      {/* <EditProfilePage /> */}
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
