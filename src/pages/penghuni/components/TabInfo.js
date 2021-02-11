import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import {
  myColor,
  defaultAsset,
  screenWidth,
  dataBulan,
  APIUrl,
} from '../../../function/MyVar';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {CardText} from '../atoms';
import axios from 'axios';
const TabInfo = (props) => {
  const [asalDaerah, setasalDaerah] = useState({
    kota: '',
    provinsi: '',
  });
  //   useEffect(() => {
  //     if (props.selectedTab !== props.index) {
  //       goToTop();
  //     }
  //   }, [props.selectedTab]);
  useEffect(() => {
    const source = axios.CancelToken.source();
    let one =
      'https://dev.farizdotid.com/api/daerahindonesia/kota/' + props.data.kota;
    let two =
      'https://dev.farizdotid.com/api/daerahindonesia/provinsi/' +
      props.data.provinsi;
    const requestOne = axios.get(one, {
      cancelToken: source.token,
    });
    const requestTwo = axios.get(two, {
      cancelToken: source.token,
    });
    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];

          setasalDaerah({
            ...asalDaerah,
            kota: responseOne.data.nama,
            provinsi: responseTwo.data.nama,
          });
          // use/access the results
        }),
      )
      .catch((errors) => {
        // react on errors.
      });

    return () => {
      source.cancel('Api Canceled');
    };
  }, [props.data]);

  return (
    <View
      style={{
        width: props.lebar,

        paddingHorizontal: 10,
        paddingTop: 30,
      }}>
      <CardText
        title="Tanggal Masuk Kost"
        // content={`${tanggal_masuk.getUTCDate()} ${
        //   dataBulan[tanggal_masuk.getUTCMonth()].nama
        // } ${tanggal_masuk.getUTCFullYear()}`}
        content={props.tanggal_masuk}>
        <Entypo name="calendar" size={20} color={myColor.grayGoogle} />
      </CardText>

      <CardText
        title="Tanggal Lahir"
        // content={`${tanggal_lahir.getUTCDate()} ${
        //   dataBulan[tanggal_lahir.getUTCMonth()].nama
        // } ${tanggal_lahir.getUTCFullYear()}`}
        content={props.tanggal_lahir}>
        <Entypo name="calendar" size={20} color={myColor.grayGoogle} />
      </CardText>

      <CardText
        title="Alamat Asal"
        content={`${props.data.alamat}, ${asalDaerah.kota}, ${asalDaerah.provinsi}`}>
        <Entypo name="address" size={20} color={myColor.grayGoogle} />
      </CardText>
      <CardText title="Nomor HP" content={props.data.notelp}>
        <Entypo
          name="phone"
          size={20}
          color={myColor.grayGoogle}
          style={{transform: [{rotateY: '180deg'}]}}
        />
      </CardText>
      <CardText title="Email" content={props.data.email}>
        <Entypo name="email" size={20} color={myColor.grayGoogle} />
      </CardText>

      <CardText
        title="Status Hubungan"
        content={props.data.status_hubungan ? 'Lajang' : 'Menikah'}>
        <FontAwesome5
          name="hand-holding-heart"
          size={20}
          color={myColor.grayGoogle}
        />
      </CardText>

      <CardText
        title="Status"
        content={props.data.status_pekerjaan === 1 ? 'Pelajar' : 'Pekerja'}>
        <MaterialIcons name="work" size={20} color={myColor.grayGoogle} />
      </CardText>

      <CardText
        title="Tempat Kerja / Pendidikan"
        content={props.data.tempat_kerja_pendidikan}>
        <MaterialIcons name="home-work" size={20} color={myColor.grayGoogle} />
      </CardText>

      <CardText title="Nomor KTP" content={props.data.noktp}>
        <Entypo name="v-card" size={20} color={myColor.grayGoogle} />
      </CardText>

      <TouchableOpacity onPress={props.showKTP}>
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
              uri: APIUrl + '/storage/images/pendaftar/' + props.data.foto_ktp,
            }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TabInfo;

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
