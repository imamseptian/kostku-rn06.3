import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {myColor, screenHeight, screenWidth} from '../../../function/MyVar';
import {ItemTransaksi} from '../atom';

const TransaksiSection = (props) => {
  return (
    <View style={{marginTop: 20}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 0.05 * screenWidth,
        }}>
        <Text style={styles.sectionTitle}>Transaksi Terakhir</Text>
        <Text style={styles.seeAll}>Lihat Semua</Text>
      </View>
      <View style={{marginTop: 10}}>
        {props.data.map((item, index) => {
          return <ItemTransaksi key={index} data={item} />;
        })}
      </View>
    </View>
  );
};

export default TransaksiSection;

const styles = StyleSheet.create({
  sectionTitle: {
    color: myColor.titleHome,
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
  },
  seeAll: {
    color: myColor.myblue,
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
  },
});
