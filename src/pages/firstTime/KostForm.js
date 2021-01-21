import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {Permission, PERMISSION_TYPE} from '../../AppPermission';
import {MyPicker, NoTelpFormField, TextFormField} from '../../components';
import {fcmService} from '../../FCMService';
import {myAxios} from '../../function/MyAxios';
import {APIUrl, myColor} from '../../function/MyVar';
import {setUserRedux} from '../../store';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const KostForm = ({navigation}) => {
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const dataRedux = useSelector((state) => state.AuthReducer);

  const [isSubmit, setIsSubmit] = useState(false);

  const [user, setUser] = useState({
    nama: '',
    provinsi: undefined,
    kota: undefined,
    alamat: '',
    jenis: 1,
    notelp: '',
    deskripsi: '',
    owner: dataRedux.user.id,
    active: true,
  });
  const [errorMsg, seterrorMsg] = useState({
    nama: '',
    provinsi: '',
    kota: '',
    alamat: '',
    jenis: '',
    notelp: '',
    deskripsi: '',
  });

  const jenisKost = [
    {id: 1, nama: 'Campuran'},
    {id: 2, nama: 'Pria'},
    {id: 3, nama: 'Wanita'},
  ];

  const refNoTelp = useRef();
  const refDeskripsi = useRef();

  const hasUnsavedChanges = Boolean(user);
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!hasUnsavedChanges || setIsSubmit) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          'Yakin ingin meninggalkan halaman ini?',
          'Data yang sudah anda isi akan hilang jika anda meninggalkan halaman ini',
          [
            {text: 'Batal', style: 'cancel', onPress: () => {}},
            {
              text: 'Pergi',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }),
    [navigation, hasUnsavedChanges],
  );

  const ProvURL = `https://dev.farizdotid.com/api/daerahindonesia/provinsi`;
  // const ProvURL = `https://x.rajaapi.com/MeP7c5neqPkLFsmfECbpnjiY69MQPqkEzRDEEsho6flCgp9kNdVa4BBFVG/m/wilayah/provinsi`;
  const [provinsi, setProvinsi] = useState([]);
  const [kota, setKota] = useState([]);

  const [dataFoto, setDataFoto] = useState({
    isUploaded: false,
    uri: '',
    type: '',
    data: '',
    base64: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  let URLkota = `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${user.provinsi}`;

  useEffect(() => {
    setIsSubmit(true);
    axios
      .get(ProvURL)
      .then((response) => {
        setProvinsi(response.data.provinsi);
        setIsSubmit(false);
        // console.log(response.data);
      })
      .catch((error) => {
        setIsSubmit(false);
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (user.provinsi != 0) {
      setIsSubmit(true);
      axios
        .get(URLkota)
        .then((response) => {
          setIsSubmit(false);
          setKota(response.data.kota_kabupaten);
        })
        .catch((error) => {
          setIsSubmit(false);
          console.log(error);
        });
    }
  }, [user.provinsi]);

  const setForm = (inputType, value) => {
    setUser({
      ...user,
      [inputType]: value,
    });
  };

  const goToTop = () => {
    scrollRef.current.scrollToIndex({animated: true, index: 0});
  };

  const pickImage = async () => {
    setIsSubmit(true);
    await Permission.requestMultiple([
      PERMISSION_TYPE.photo,
      PERMISSION_TYPE.camera,
    ]);
    ImagePicker.launchImageLibrary(
      {mediaType: 'photo', base64: true, maxWidth: 720, maxHeight: 480},
      (response) => {
        // console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
          setIsSubmit(false);
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          setIsSubmit(false);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          setIsSubmit(false);
        } else {
          let image = 'data:' + response.type + ';base64,' + response.data;
          setDataFoto({
            ...dataFoto,
            isUploaded: true,
            uri: response.uri,
            type: response.type,
            data: response.data,
            base64: image,
          });
          setIsSubmit(false);
        }
      },
    );
  };

  // const scrollRef = useRef(ScrollView);

  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'MainScreen'}],
    });
  };

  const addData = () => {
    const source = axios.CancelToken.source();
    myAxios.postAxios(
      APIUrl + '/api/kost',
      dataFoto.isUploaded ? {...user, foto_kost: dataFoto.base64} : user,
      dataRedux.token,
      source.token,
      onPost,
    );
    function onPost(status, data) {
      if (status == 'success') {
        if (data.success) {
          // navigation.pop(1);
          const dataPengguna = data.user;
          console.log('sukses matamu ', data);
          let topic = 'kostku-' + data.data.id;

          fcmService.subscribeToTopic(topic);
          dispatch(setUserRedux(dataPengguna));

          // console.log(data);
          goToHome();
        } else {
          seterrorMsg({
            nama: data.errors.nama ? data.errors.nama : '',
            provinsi: data.errors.provinsi ? data.errors.provinsi : '',
            kota: data.errors.kota ? data.errors.kota : '',
            alamat: data.errors.alamat ? data.errors.alamat : '',
            jenis: data.errors.jenis ? data.errors.jenis : '',
            notelp: data.errors.notelp ? data.errors.notelp : '',
            deskripsi: data.errors.deskripsi ? data.errors.deskripsi : '',
          });
          setIsSubmit(false);
          goToTop();
        }
      } else if (status == 'cancel') {
        console.log('caught cancel filter');
      } else {
        console.log('gagal');
        setIsSubmit(false);
        console.log(user);
        console.log(data);
      }
    }
  };

  return (
    <View style={styles.flyView}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        contentContainerStyle={{paddingBottom: 20}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          Formulir Kost
        </Text>

        <TouchableOpacity disabled={isSubmit} onPress={() => pickImage()}>
          {!dataFoto.isUploaded ? (
            <View
              style={{
                width: 0.8 * screenWidth,
                maxWidth: 300,
                height: (2 / 3) * 0.8 * screenWidth,
                maxHeight: 200,
                borderRadius: 10,
                backgroundColor: myColor.darkText,
                marginHorizontal: 0.1 * screenWidth,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>
                Tekan disini untuk upload Foto Kost
              </Text>
              <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>
                *Opsional
              </Text>
            </View>
          ) : (
            <Image
              source={{
                uri: dataFoto.uri,
              }}
              style={{
                width: 0.8 * screenWidth,
                maxWidth: 300,
                height: (2 / 3) * 0.8 * screenWidth,
                maxHeight: 200,
                borderRadius: 10,
                marginHorizontal: 0.1 * screenWidth,
                marginBottom: 10,
              }}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
        <Text>{JSON.stringify(user)}</Text>

        <TextFormField
          title="Nama Kost"
          placeholder="Masukan Nama Kost"
          onChangeText={(value) => {
            setForm('nama', value);
          }}
          value={user.nama}
          pesanError={errorMsg.nama}
        />

        <MyPicker
          title="Provinsi"
          pesanError={errorMsg.provinsi}
          selectedValue={user.provinsi}
          data={provinsi}
          itemName="nama"
          placeholder="Pilih Provinsi"
          onChangeFunction={(value) => setForm('provinsi', value)}
          disabled={isSubmit}
        />

        <MyPicker
          title="Kota"
          pesanError={errorMsg.kota}
          selectedValue={user.kota}
          data={kota}
          itemName="nama"
          placeholder="Pilih Kota"
          onChangeFunction={(value) => setForm('kota', value)}
          disabled={isSubmit}
        />

        <MyPicker
          title="Jenis Kost"
          pesanError={errorMsg.jenis}
          selectedValue={user.jenis}
          data={jenisKost}
          itemName="nama"
          placeholder="Pilih Jenis"
          onChangeFunction={(value) => setForm('jenis', value)}
          disabled={isSubmit}
        />

        {/* <View style={styles.formWrapper}>
          <View>
            <View style={styles.fieldForm}>
              <MaterialCommunityIcons
                name="home-city"
                size={25}
                style={{opacity: 0.5}}
              />
              <Picker
                selectedValue={user.jenis}
                style={{height: 50, flex: 1, fontSize: 3}}
                textStyle={{fontSize: 12}}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue != null) {
                    setinvalidKota(false);
                    setForm('jenis', itemValue);
                  }
                }}>
                <Picker.Item label="Pilih Jenis" />
                <Picker.Item key={'1'} label="Kost Campuran" value={1} />
                <Picker.Item key={'2'} label="Kost Pria" value={2} />
                <Picker.Item key={'3'} label="Kost Wanita" value={3} />
              </Picker>
            </View>
            {invalidJenis && (
              <View style={styles.viewError}>
                <Text style={styles.textError}>Jenis Kost Perlu Dipilih</Text>
              </View>
            )}
          </View>
        </View> */}

        <TextFormField
          title="Alamat Kost"
          placeholder="Masukan Alamat Kost"
          onChangeText={(value) => {
            setForm('alamat', value);
          }}
          value={user.alamat}
          pesanError={errorMsg.alamat}
          onSubmitEditing={() => {
            refNoTelp.current.focus();
          }}
          blurOnSubmit={false}
        />

        <NoTelpFormField
          ref={refNoTelp}
          title="Nomor Telepon Kost"
          onChangeText={(value) => {
            setForm('notelp', value);
          }}
          value={user.notelp}
          keyboardType="number-pad"
          pesanError={errorMsg.notelp}
          awalan="+62"
          onSubmitEditing={() => {
            refDeskripsi.current.focus();
          }}
          blurOnSubmit={false}
        />

        <TextFormField
          ref={refDeskripsi}
          title="Deskripsi Kost"
          placeholder="Deskrips Kost"
          onChangeText={(value) => {
            setForm('deskripsi', value);
          }}
          value={user.deskripsi}
          multiline={true}
          pesanError={errorMsg.deskripsi}
        />

        <TouchableOpacity
          onPress={() => {
            setIsSubmit(true);
            Alert.alert(
              'Konfirmasi',
              'Apakah anda yakin data yang diisi telah sesuai ?',
              [
                {
                  text: 'Batal',
                  onPress: () => setIsSubmit(false),
                  style: 'cancel',
                },
                {text: 'Ya', onPress: () => addData()},
              ],
              {cancelable: false},
            );
          }}
          disabled={isSubmit}>
          <View
            style={{
              height: 40,
              backgroundColor: myColor.myblue,
              marginHorizontal: 20,
              borderRadius: 10,
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
              Submit
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <ActivityIndicator
        animating={isSubmit}
        size="large"
        color={myColor.myblue}
        style={styles.loading}
      />

      {/* <View style={{flex: 1}}></View> */}

      {/* <View
          style={{
            height: 0.5 * screenHeight,
            backgroundColor: 'red',
          }}>
          
        </View> */}
    </View>
  );
};

export default KostForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: myColor.colorTheme,
  },
  containerTop: {
    flex: 2,
    backgroundColor: myColor.colorTheme,
  },
  containerBot: {
    flex: 5,
  },
  flyView: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // elevation: 5,
  },
  formWrapper: {
    marginBottom: 15,
    marginHorizontal: 0.05 * screenWidth,
  },
  fieldForm: {
    height: 40,
    borderWidth: 0.5,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  viewError: {width: 250, paddingTop: 3},
  textError: {
    color: '#d63031',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 40,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
