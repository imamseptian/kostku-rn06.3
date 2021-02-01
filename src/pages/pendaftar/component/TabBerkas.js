import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {
  myColor,
  defaultAsset,
  screenWidth,
  APIUrl,
} from '../../../function/MyVar';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {CardText} from '../atoms';
const TabBerkas = (props) => {
  let dataAsal = [1, 2, 3];
  return (
    <View
      style={{
        width: props.lebar,
        paddingHorizontal: 10,
        paddingTop: 20,
      }}>
      {/* section nomor ktp  */}
      <CardText title="Nomor KTP" content={props.data.noktp}>
        <Entypo name="v-card" size={20} color={myColor.grayGoogle} />
      </CardText>

      {/* section foto ktp  */}
      <View style={styles.wrapperCard}>
        <View style={styles.wrapperTitle}>
          <Entypo name="v-card" size={20} color={myColor.grayGoogle} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'OpenSans-SemiBold',
              color: myColor.darkText,
              marginLeft: 3,
            }}>
            Foto KTP
          </Text>
        </View>
        <Image
          source={{
            uri: APIUrl + '/kostdata/pendaftar/foto/' + props.data.foto_ktp,
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* section pesanan kamar  */}
      <View style={styles.wrapperCard}>
        <View style={styles.wrapperTitle}>
          <FontAwesome5 name="door-open" size={20} color={myColor.grayGoogle} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'OpenSans-SemiBold',
              color: myColor.darkText,
              marginLeft: 3,
            }}>
            Pesanan Kamar
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'OpenSans-Regular',
            color: myColor.fbtx,
            fontSize: 12,
            marginLeft: 23,
            marginBottom: 10,
          }}>
          Kamar Mewah
        </Text>
        <Image
          source={{
            uri:
              'https://narasidesign.com/wp-content/uploads/2019/10/Tips-Inspirasi-Penting-dalam-Merenovasi-Kamar-Tidur.jpg',
          }}
          style={{height: 150, borderRadius: 10}}
          resizeMode="contain"
        />
      </View>

      <CardText
        title="Pesan Pendaftar pada Pemilik Kost"
        content={props.data.pesan}>
        <MaterialIcons name="message" size={20} color={myColor.grayGoogle} />
      </CardText>

      {/* section nomor  */}
    </View>
  );
};

export default TabBerkas;

const styles = StyleSheet.create({
  wrapperCard: {
    paddingVertical: 15,
    elevation: 3,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    position: 'relative',
    marginBottom: 15,
  },
  wrapperTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: -10,
    left: 10,
  },
  image: {height: 150, borderRadius: 10},
});
