import React from 'react';
import {Text, View, Image} from 'react-native';
import {screenWidth, myColor, defaultAsset} from '../../../function/MyVar';
class ModalItemPenghuni extends React.PureComponent {
  render() {
    const {data, ...rest} = this.props;

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomColor: myColor.divider,
          borderBottomWidth: 1,
          paddingVertical: 5,
          alignItems: 'center',
        }}>
        <View style={{height: 50, width: 50, borderRadius: 50 / 2}}>
          <Image
            source={{uri: defaultAsset.kelas_kamar}}
            style={{height: 50, width: 50, borderRadius: 50 / 2}}
          />
        </View>

        <Text
          style={{
            fontFamily: 'OpenSans-SemiBold',
            fontSize: 12,
            color: myColor.fbtx,
            textAlign: 'right',
          }}>
          {data.nama_depan} {data.nama_belakang}
        </Text>
      </View>
    );
  }
}

export default ModalItemPenghuni;
