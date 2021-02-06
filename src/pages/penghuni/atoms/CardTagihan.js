import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  myColor,
  defaultAsset,
  dataBulan,
  formatRupiah,
} from '../../../function/MyVar';

class CardTagihan extends React.PureComponent {
  render() {
    let tanggal_tagihan = new Date(this.props.item.tanggal_tagihan);

    return (
      <View
        style={{
          paddingHorizontal: 10,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: myColor.divider,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Text
          style={{
            fontFamily: 'OpenSans-Regular',
            fontSize: 12,
            marginRight: 5,
          }}>
          {this.props.index + 1}.
        </Text>
        <Text style={{fontFamily: 'OpenSans-Regular', fontSize: 12}}>
          {dataBulan[tanggal_tagihan.getUTCMonth()].nama}{' '}
          {tanggal_tagihan.getUTCFullYear()}
        </Text>
        <Text
          style={{
            fontFamily: 'OpenSans-Regular',
            fontSize: 12,
            flex: 1,
            textAlign: 'right',
          }}>
          {formatRupiah(this.props.item.jumlah.toString(), 'Rp. ')}
        </Text>
      </View>
    );
  }
}

// const CardTagihan = () => {
//   return (

//   );
// };

export default CardTagihan;

const styles = StyleSheet.create({});
