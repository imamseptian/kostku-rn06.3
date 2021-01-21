import React from 'react';
import {StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';
import {
  myColor,
  screenWidth,
  screenHeight,
  formatRupiah,
} from '../../../function/MyVar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const ItemTransaksi = (props) => {
  const navigation = useNavigation();
  return (
    <TouchableNativeFeedback
      onPress={() =>
        navigation.navigate('KeuanganStackScreen', {
          screen: 'DetailKeuangan',
          params: {
            page: props.data.id_penghuni != null ? 1 : 0,
          },
        })
      }>
      <View
        style={{
          width: 0.9 * screenWidth,
          height: 40,
          elevation: 5,
          marginBottom: 10,
          borderRadius: 10,
          backgroundColor: 'white',
          marginHorizontal: 0.05 * screenWidth,
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 10,
          justifyContent: 'space-between',
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            fontFamily: 'OpenSans-SemiBold',
            color: myColor.fbtx,
            maxWidth: 0.5 * screenWidth,
          }}>
          {props.data.id_penghuni != null
            ? props.data.nama_depan + ' membayar sewa kamar'
            : props.data.judul}
        </Text>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'OpenSans-Regular',
              color: myColor.fbtx,
            }}>
            {formatRupiah(props.data.jumlah.toString(), 'Rp. ')}
          </Text>
          <AntDesign
            name={props.data.id_penghuni != null ? 'caretup' : 'caretdown'}
            color={
              props.data.id_penghuni != null ? myColor.success : myColor.alert
            }
            size={25}
            style={{marginLeft: 3}}
          />
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

export default ItemTransaksi;

const styles = StyleSheet.create({});
