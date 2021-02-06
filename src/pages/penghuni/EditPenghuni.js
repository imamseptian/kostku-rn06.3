import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  APIUrl,
  defaultAsset,
  myColor,
  screenWidth,
  dataBulan,
} from '../../function/MyVar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Permission, PERMISSION_TYPE} from '../../AppPermission';
import ImagePicker from 'react-native-image-crop-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {CardForm, CardText, CardPicker} from './atoms';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const EditPenghuni = ({navigation, route}) => {
  const sizefoto = 120;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tanggal_lahir, settanggal_lahir] = useState(
    new Date(route.params.tanggal_lahir),
  );

  const [dataProvinsi, setdataProvinsi] = useState([]);
  const [dataKota, setdataKota] = useState([]);

  const [penghuni, setpenghuni] = useState(route.params);

  const [profilImg, setprofilImg] = useState(
    APIUrl + '/storage/images/pendaftar/' + penghuni.foto_diri,
  );

  const [ktpImg, setktpImg] = useState(
    APIUrl + '/storage/images/pendaftar/' + penghuni.foto_ktp,
  );
  // const [penghuni, setpenghuni] = useState({
  //   provinsi: null,
  //   kota: null,
  //   status_hubungan: null,
  //   status_pekerjaan: null,
  // });

  const setForm = (itemKey, value) => {
    setpenghuni({...penghuni, [itemKey]: value});
  };

  const [isLoading, setIsLoading] = useState(false);
  const [cropFoto, setcropFoto] = useState({
    base64: null,
    path: null,
  });

  const [cropFotoKTP, setcropFotoKTP] = useState({
    base64: null,
    path: null,
  });

  const pickImage = async (width, height, callback) => {
    await Permission.requestMultiple([
      PERMISSION_TYPE.photo,
      PERMISSION_TYPE.camera,
    ]);
    ImagePicker.openPicker({
      width: width,
      height: height,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      let base64Temporary = 'data:' + image.mime + ';base64,' + image.data;
      callback({
        base64: base64Temporary,
        path: image.path,
      });
    });
  };

  const submitEdit = () => {
    axios
      .post(`${APIUrl}/api/edit_penghuni`, {
        ...penghuni,
        new_foto_diri: cropFoto.base64 !== null ? cropFoto.base64 : null,
        new_foto_ktp: cropFotoKTP.base64 !== null ? cropFotoKTP.base64 : null,
        tanggal_lahir: tanggal_lahir,
      })
      .then((res) => {
        console.log(res.data);
        console.log(penghuni);
        navigation.popToTop();
      })
      .catch((error) => {
        alert('error');
      });
  };

  useEffect(() => {
    axios
      .get(`https://dev.farizdotid.com/api/daerahindonesia/provinsi`)
      .then((res) => {
        setdataProvinsi(res.data.provinsi);
      })
      .catch((error) => {
        console.log('error fetch provinsi');
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${penghuni.provinsi}`,
      )
      .then((res) => {
        setdataKota(res.data.kota_kabupaten);
      })
      .catch((error) => {
        console.log('error fetch kota');
      });
  }, [penghuni.provinsi]);

  return (
    <View style={{flex: 1, backgroundColor: '#f6f6f6'}}>
      <StatusBar translucent backgroundColor="transparent" />
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={tanggal_lahir}
          mode="date"
          is24Hour={true}
          display="spinner"
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || tanggal_lahir;
            // setShowDatePicker(Platform.OS === 'ios');
            setShowDatePicker(false);
            // setDate(currentDate);
            settanggal_lahir(currentDate);
          }}
        />
      )}
      <ScrollView>
        <View
          style={{
            height: 100,
            backgroundColor: myColor.colorTheme,
          }}></View>
        <View
          style={{
            position: 'relative',
            paddingTop: sizefoto / 2 + 20,
            paddingHorizontal: 15,
          }}>
          <View
            style={{
              position: 'absolute',
              top: -sizefoto / 2,
              left: screenWidth / 2 - sizefoto / 2,
            }}>
            <TouchableOpacity
              onPress={() => {
                pickImage(512, 512, setcropFoto);
              }}>
              <View style={{position: 'relative'}}>
                <Image
                  source={{
                    // uri: dataFoto.isUploaded
                    //   ? dataFoto.uri
                    //   : defaultAsset.foto_profil,
                    uri: cropFoto.path !== null ? cropFoto.base64 : profilImg,
                  }}
                  style={{
                    width: sizefoto,
                    height: sizefoto,
                    borderRadius: sizefoto / 2,
                  }}
                  onError={(e) => setprofilImg(defaultAsset.kelas_kamar)}
                />
                <View
                  style={{
                    position: 'absolute',
                    width: sizefoto,
                    height: sizefoto,
                    borderRadius: sizefoto / 2,
                    backgroundColor: 'black',
                    opacity: 0.2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}></View>
                <MaterialCommunityIcons
                  name="camera-plus"
                  size={20}
                  color={'#fff'}
                  style={{
                    position: 'absolute',
                    top: sizefoto / 2 - 10,
                    left: sizefoto / 2 - 10,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* START FORM */}
          {/* <Text>{JSON.stringify(penghuni)}</Text> */}
          <CardForm
            title="Nama"
            value={penghuni.nama}
            onChangeText={(v) => {
              setForm('nama', v);
            }}>
            <FontAwesome name="user" size={20} color={myColor.grayGoogle} />
          </CardForm>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setShowDatePicker(true);
            }}>
            <CardText
              title="Tanggal Lahir"
              content={`${tanggal_lahir.getDate()} ${
                dataBulan[tanggal_lahir.getMonth()].nama
              } ${tanggal_lahir.getFullYear()}`}>
              <Entypo name="calendar" size={20} color={myColor.grayGoogle} />
            </CardText>
          </TouchableOpacity>
          <CardForm
            title="Nomor HP"
            value={penghuni.notelp}
            onChangeText={(v) => {
              setForm('notelp', v);
            }}>
            <Entypo
              name="phone"
              size={20}
              color={myColor.grayGoogle}
              style={{transform: [{rotateY: '180deg'}]}}
            />
          </CardForm>

          <CardForm
            title="Email"
            value={penghuni.email}
            onChangeText={(v) => {
              setForm('email', v);
            }}>
            <Entypo name="email" size={20} color={myColor.grayGoogle} />
          </CardForm>

          <CardPicker
            title="Provinsi Asal"
            data={dataProvinsi}
            itemName="nama"
            selectedValue={penghuni.provinsi}
            placeholder="Pilih Provinsi"
            onChangeFunction={(val) => {
              setpenghuni({...penghuni, provinsi: val});
            }}>
            <MaterialCommunityIcons
              name="city"
              size={20}
              color={myColor.grayGoogle}
            />
          </CardPicker>

          <CardPicker
            title="Kota Asal"
            data={dataKota}
            itemName="nama"
            selectedValue={penghuni.kota}
            placeholder="Pilih Kota"
            onChangeFunction={(val) => {
              setpenghuni({...penghuni, kota: val});
            }}>
            <MaterialCommunityIcons
              name="home-city"
              size={20}
              color={myColor.grayGoogle}
            />
          </CardPicker>

          <CardForm
            title="Alamat Asal"
            value={penghuni.alamat}
            onChangeText={(v) => {
              setForm('alamat', v);
            }}>
            <Entypo name="address" size={20} color={myColor.grayGoogle} />
          </CardForm>

          <CardForm
            title="Nomor KTP"
            value={penghuni.noktp}
            onChangeText={(v) => {
              setForm('noktp', v);
            }}>
            <Entypo name="v-card" size={20} color={myColor.grayGoogle} />
          </CardForm>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => pickImage(720, 480, setcropFotoKTP)}>
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
              <View style={{alignItems: 'center'}}>
                <View style={{position: 'relative', backgroundColor: 'red'}}>
                  <Image
                    source={{
                      uri:
                        cropFotoKTP.path !== null ? cropFotoKTP.path : ktpImg,
                    }}
                    style={{height: 120, width: 180}}
                    onError={(e) => setktpImg(defaultAsset.foto_profil)}
                    resizeMode="contain"
                  />
                  <View
                    style={{
                      backgroundColor: 'black',
                      opacity: 0.2,
                      position: 'absolute',
                      width: 180,
                      height: 120,
                    }}></View>
                  <MaterialCommunityIcons
                    name="camera-plus"
                    size={20}
                    color={'#fff'}
                    style={{
                      position: 'absolute',
                      top: 120 / 2 - 10,
                      left: 180 / 2 - 10,
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <CardPicker
            title="Status Hubungan"
            data={[
              {id: 1, nama: 'Lajang'},
              {id: 2, nama: 'Menikah'},
            ]}
            itemName="nama"
            selectedValue={penghuni.status_hubungan}
            placeholder="Pilih Status"
            onChangeFunction={(val) => {
              setpenghuni({...penghuni, status_hubungan: val});
            }}>
            <FontAwesome5
              name="hand-holding-heart"
              size={20}
              color={myColor.grayGoogle}
            />
          </CardPicker>

          <CardPicker
            title="Status Pekerjaan"
            data={[
              {id: 1, nama: 'Pelajar'},
              {id: 2, nama: 'Pekerja'},
            ]}
            itemName="nama"
            selectedValue={penghuni.status_pekerjaan}
            placeholder="Pilih Status"
            onChangeFunction={(val) => {
              setpenghuni({...penghuni, status_pekerjaan: val});
            }}>
            <MaterialIcons name="work" size={20} color={myColor.grayGoogle} />
          </CardPicker>

          <CardForm
            title="Alamat Tempat Kerja / Pendidikan"
            value={penghuni.tempat_kerja_pendidikan}
            onChangeText={(v) => {
              setForm('tempat_kerja_pendidikan', v);
            }}>
            <MaterialIcons
              name="home-work"
              size={20}
              color={myColor.grayGoogle}
            />
          </CardForm>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              submitEdit();
            }}>
            <View
              style={{
                paddingVertical: 10,
                borderRadius: 5,
                backgroundColor: myColor.myblue,
                marginBottom: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#fff',
                  fontSize: 12,
                }}>
                Edit Penghuni
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditPenghuni;

const styles = StyleSheet.create({
  wrapperCard: {
    borderWidth: 1,
    borderColor: myColor.divider,
    backgroundColor: 'white',
    borderRadius: 5,

    position: 'relative',
    marginBottom: 25,
    paddingVertical: 10,
  },
  wrapperTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: -22,
    left: 10,
  },
  image: {height: 150, borderRadius: 10},
});
