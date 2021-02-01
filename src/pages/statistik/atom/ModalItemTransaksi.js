import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {
  screenWidth,
  myColor,
  defaultAsset,
  formatRupiah,
  dataBulan,
} from '../../../function/MyVar';

class ModalItemTransaksi extends React.PureComponent {
  render() {
    let tanggal_transaksi = new Date(this.props.data.tanggal_transaksi);

    return (
      <View
        style={{
          paddingVertical: 10,
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: myColor.divider,
          flexDirection: 'row',
          paddingHorizontal: 5,
          marginBottom: 5,
        }}>
        {this.props.jenis === 1 && (
          <Image
            source={{uri: defaultAsset.kelas_kamar}}
            style={{height: 50, width: 50, borderRadius: 50 / 2}}
          />
        )}

        <Text
          // numberOfLines={2}
          style={{
            fontFamily: 'OpenSans-SemiBold',
            fontSize: 12,
            marginLeft: 5,
            maxWidth: 0.3 * screenWidth,
          }}>
          {this.props.jenis === 1
            ? this.props.data.nama_depan + ' ' + this.props.data.nama_belakang
            : this.props.data.judul}
        </Text>

        <View style={{flex: 1}}>
          <Text
            style={{
              fontFamily: 'OpenSans-SemiBold',
              textAlign: 'right',
              fontSize: 12,
              color: myColor.darkText,
            }}>
            {formatRupiah(this.props.data.jumlah.toString(), 'Rp. ')}
          </Text>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              textAlign: 'right',
              fontSize: 12,
              color: myColor.darkText,
            }}>
            {tanggal_transaksi.getUTCDate()}-
            {dataBulan[tanggal_transaksi.getUTCMonth()].nama}-
            {tanggal_transaksi.getUTCFullYear()}
          </Text>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              textAlign: 'right',
              fontSize: 12,
              color: myColor.darkText,
            }}>
            {tanggal_transaksi.getUTCHours()}:
            {tanggal_transaksi.getUTCMinutes()} WIB
          </Text>
        </View>
      </View>
    );
  }
}

export default ModalItemTransaksi;

const styles = StyleSheet.create({});
