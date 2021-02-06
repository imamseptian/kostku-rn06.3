import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {Provider} from 'react-redux';
import AppNavigator from './AppNavigator';
import {store} from './store';
import {MainStatistik, KostStatistik} from './pages/statistik';
import {MyDatePicker, AccordionComponent} from './pages/CobaDate';
import {ProfilPendaftar} from './pages/pendaftar';
import {EditPenghuni, TestEditOpacity} from './pages/penghuni';
import {CardProfile} from './pages/pendaftar/atoms';
const LaporanStack = createSharedElementStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      {/* <AccordionComponent /> */}
      {/* <KostStatistik /> */}
      {/* <CobaVictory /> */}
      {/* <MainStatistik /> */}
      {/* <EditPenghuni /> */}
      {/* <TestEditOpacity /> */}

      {/* <MyDatePicker /> */}
      {/* <ProfilPendaftar /> */}
      {/* <CardProfile /> */}

      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
