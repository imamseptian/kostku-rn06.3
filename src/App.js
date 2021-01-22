import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {Provider} from 'react-redux';
import AppNavigator from './AppNavigator';
import {store} from './store';
import {MainStatistik, KostStatistik} from './pages/statistik';
import {MyDatePicker, AccordionComponent} from './pages/CobaDate';

const LaporanStack = createSharedElementStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      {/* <AccordionComponent /> */}
      {/* <KostStatistik /> */}
      {/* <CobaVictory /> */}
      {/* <MainStatistik /> */}

      {/* <MyDatePicker /> */}

      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
