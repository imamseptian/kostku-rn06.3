import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback,
} from 'react-native';
import {myColor, APIUrl, dataBulan} from '../function/MyVar';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const FlatListDalamKamar = (props) => {
  let tanggal = new Date(props.data.tanggal_masuk);
  return (
    <TouchableNativeFeedback onPress={props.onPress}>
      <View
        style={{
          marginTop: 10,

          backgroundColor: 'white',
          paddingVertical: 10,

          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: myColor.divider,
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            height: 76,
            width: 76,
            borderRadius: 38,
            backgroundColor: 'red',
            borderWidth: 2,
            borderColor: '#fff',
            elevation: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 5,
          }}>
          <Image
            source={{
              uri: APIUrl + '/kostdata/pendaftar/foto/' + props.data.foto_diri,
            }}
            style={{height: 74, width: 74, borderRadius: 74 / 2}}
          />
        </View>

        <View style={{}}>
          <Text
            style={{
              color: myColor.fbtx,
              fontSize: 14,
              fontFamily: 'OpenSans-SemiBold',
            }}>
            {/* {JSON.stringify(props.data)} */}
            {props.data.nama}
          </Text>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: 12,
              color: myColor.darkText,
            }}>
            Tanggal Masuk : {tanggal.getDate()}-
            {dataBulan[tanggal.getMonth()].nama}-{tanggal.getFullYear()}
          </Text>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {props.data.tagihan <= 0 ? (
              <View style={{flexDirection: 'row'}}>
                <View
                  style={[
                    styles.tagStatus,
                    {backgroundColor: myColor.success, marginRight: 5},
                  ]}>
                  <Text style={[styles.tagText, {color: myColor.fbtx}]}>
                    Lunas
                  </Text>
                </View>
                <View
                  style={[
                    styles.tagStatus,
                    {backgroundColor: myColor.success},
                  ]}>
                  <Text style={[styles.tagText, {color: myColor.fbtx}]}>
                    {0 - props.data.tagihan}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <View
                  style={[
                    styles.tagStatus,
                    {backgroundColor: myColor.alert, marginRight: 5},
                  ]}>
                  <Text style={[styles.tagText, {color: '#fff'}]}>
                    Belum Lunas
                  </Text>
                </View>
                <View
                  style={[styles.tagStatus, {backgroundColor: myColor.alert}]}>
                  <Text style={[styles.tagText, {color: '#fff'}]}>
                    {0 - props.data.tagihan}
                  </Text>
                </View>
              </View>
            )}

            
          </View> */}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

export default FlatListDalamKamar;

const styles = StyleSheet.create({
  tagStatus: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  tagText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
  },
});
