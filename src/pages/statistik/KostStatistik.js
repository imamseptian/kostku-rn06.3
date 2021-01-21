import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Modal, ScrollView} from 'react-native';
import {KostPenghuniChart, ModalPenghuni} from './component';
import axios from 'axios';
import {myColor, formatRupiah} from '../../function/MyVar';
import {MiniHeader, PureModal} from '../../components';
import {PieSection, TestPie} from './';

const KostStatistik = () => {
  return (
    <View>
      <ScrollView>
        <PieSection />
        {/* <TestPie /> */}
      </ScrollView>
    </View>
  );
};

export default KostStatistik;

const styles = StyleSheet.create({});
