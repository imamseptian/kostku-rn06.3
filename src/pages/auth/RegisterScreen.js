import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Button,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch} from 'react-redux';
import {Permission, PERMISSION_TYPE} from '../../AppPermission';
import RegisterSVG from '../../asset/image/register2.svg';
import {
  myColor,
  screenHeight,
  screenWidth,
  APIUrl,
  dataBulan,
} from '../../function/MyVar';
import {NoTelpFormField, TextFormField, MyPicker} from '../../components';
import DateTimePicker from '@react-native-community/datetimepicker';

const LoginScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  // const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  //  DATA ERROR MESSAGE
  const [errorMsg, seterrorMsg] = useState({
    nama_depan: '',
    nama_belakang: '',
    email: '',
    password: '',
    password_confirmation: '',
    tanggal_lahir: '',
  });

  //  DATA PENDAFTAR
  const [user, setUser] = useState({
    nama_depan: '',
    nama_belakang: '',
    email: '',
    password: '',
    password_confirmation: '',
    tanggal_lahir: new Date(),
  });

  // DATA PHOTO
  const [dataFoto, setDataFoto] = useState({
    isUploaded: false,
    uri: '',
    type: '',
    data: '',
    base64: '',
  });

  // STATUS SHOW / HIDE PASSWORD
  const [isStatus, setIsStatus] = useState({
    pass: true,
    confirm: true,
  });

  // REF KOLOM REGISTER
  const refNamaBelakang = useRef();
  const refEmail = useRef();
  const refPassword = useRef();
  const refPassword_Confirmation = useRef();

  //  Toogle show/hide password
  const setStatus = (inputType, value) => {
    setIsStatus({
      ...isStatus,
      [inputType]: value,
    });
  };

  // SET VALUE FIELD
  const setForm = (inputType, value) => {
    setUser({
      ...user,
      [inputType]: value,
    });
  };

  // SUBMIT FORM
  const submitRegister = () => {
    setIsLoading(true);

    axios
      .post(
        `${APIUrl}/api/auth/signup`,
        dataFoto.isUploaded
          ? {
              ...user,
              foto_profil: dataFoto.base64,
              tanggal_lahir: user.tanggal_lahir.toString(),
            }
          : {...user, tanggal_lahir: user.tanggal_lahir.toString()},
      )
      .then((res) => {
        console.log(res.data);
        console.log(user);

        if (res.data.success) {
          navigation.pop(1);
        } else {
          let passwordError = '';
          let konfirmasiError = '';
          let arrPass = [];
          if (res.data.errors.password) {
            arrPass = res.data.errors.password;
          }
          if (arrPass.length > 0) {
            if (arrPass.includes('Password perlu diisi')) {
              passwordError = 'Password perlu diisi';
            } else if (arrPass.includes('Panjang password minimal 8 digit')) {
              passwordError = 'Panjang password minimal 8 digit';
            }
            if (arrPass.includes('Konfirmasi Password tidak cocok')) {
              konfirmasiError = 'Konfirmasi Password tidak cocok';
            }
          }
          seterrorMsg({
            nama_depan: res.data.errors.nama_depan
              ? res.data.errors.nama_depan
              : '',
            nama_belakang: res.data.errors.nama_belakang
              ? res.data.errors.nama_belakang
              : '',
            email: res.data.errors.email ? res.data.errors.email : '',
            password: passwordError,
            password_confirmation: konfirmasiError,
            tanggal_lahir: res.data.errors.tanggal_lahir
              ? res.data.errors.tanggal_lahir
              : '',
          });
          setIsLoading(false);
        }
      })
      .catch((error) => {
        alert('errro');
        console.log(user);
        setIsLoading(false);
      });
  };

  // PICK IMAGE
  const pickImage = async () => {
    setIsPressed(true);
    await Permission.requestMultiple([
      PERMISSION_TYPE.photo,
      PERMISSION_TYPE.camera,
    ]);
    ImagePicker.launchImageLibrary(
      {mediaType: 'photo', base64: true, maxWidth: 720, maxHeight: 480},
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          setIsPressed(false);
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          setIsPressed(false);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          setIsPressed(false);
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
          setIsPressed(false);
        }
      },
    );
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />

      {/* SECTION VIEW REGISTER SVG  */}
      <Animatable.View animation="bounceIn" style={styles.animSVG}>
        <View style={styles.wrapperSVG}>
          <RegisterSVG width={200} height={160} />
          <Text style={styles.fontSVG}>Register</Text>
        </View>
      </Animatable.View>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={user.tanggal_lahir}
          mode="date"
          is24Hour={true}
          display="calendar"
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || user.tanggal_lahir;
            // setShowDatePicker(Platform.OS === 'ios');
            setShowDatePicker(false);
            // setDate(currentDate);
            setForm('tanggal_lahir', currentDate);
          }}
        />
      )}

      {/* SECTION FORM REGISTER */}
      <Animatable.View animation="fadeInUpBig" style={styles.animForm}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* SECTION UPLOAD FOTO  */}
          <View style={styles.wrapperUploadFoto}>
            <TouchableNativeFeedback
              disabled={isPressed}
              onPress={() => pickImage()}>
              <View style={styles.circleAvatar}>
                {!dataFoto.isUploaded ? (
                  <Text style={styles.textUploadFoto}>
                    Tekan untuk upload foto profil
                  </Text>
                ) : (
                  <Image
                    source={{
                      uri: dataFoto.uri,
                    }}
                    style={styles.avatar}
                  />
                )}
              </View>
            </TouchableNativeFeedback>
          </View>

          {/* SECTION NAMA DEPAN & BELAKANG  */}
          <View style={styles.wrapperNama}>
            <View>
              <View style={styles.fieldNama}>
                <TextInput
                  value={user.nama_depan}
                  placeholder="Nama Depan"
                  style={styles.inputNama}
                  onSubmitEditing={() => {
                    refNamaBelakang.current.focus();
                  }}
                  blurOnSubmit={false}
                  onChangeText={(value) => setForm('nama_depan', value)}
                />
              </View>
              <Text style={[styles.textError, styles.widthErrorNama]}>
                {errorMsg.nama_depan}
              </Text>
            </View>
            <View>
              <View style={styles.fieldNama}>
                <TextInput
                  ref={refNamaBelakang}
                  value={user.nama_belakang}
                  placeholder="Nama Belakang"
                  style={styles.inputNama}
                  onSubmitEditing={() => {
                    refEmail.current.focus();
                  }}
                  blurOnSubmit={false}
                  onChangeText={(value) => setForm('nama_belakang', value)}
                />
              </View>
              <Text style={[styles.textError, styles.widthErrorNama]}>
                {errorMsg.nama_belakang}
              </Text>
            </View>
          </View>

          {/* SECTION EMAIL  */}
          <View style={styles.wrapperLine}>
            <View style={styles.wrapperField}>
              <MaterialCommunityIcons
                name="email"
                color={myColor.fbtx}
                size={25}
                style={{marginRight: 5}}
              />
              <TextInput
                placeholder="Email"
                ref={refEmail}
                value={user.email}
                style={styles.textInput}
                onChangeText={(value) => setForm('email', value)}
                onSubmitEditing={() => {
                  refPassword.current.focus();
                }}
                blurOnSubmit={false}
              />
            </View>
            <Text style={[styles.textError, {marginLeft: 40}]}>
              {errorMsg.email}
            </Text>
          </View>

          {/* SECTION PASSWORD  */}
          <View style={styles.wrapperLine}>
            <View style={styles.wrapperField}>
              <MaterialCommunityIcons
                name="lock"
                color={myColor.fbtx}
                size={25}
                style={{marginRight: 5}}
              />
              <TextInput
                placeholder="Password"
                ref={refPassword}
                value={user.password}
                secureTextEntry={isStatus.pass}
                style={styles.textInput}
                onSubmitEditing={() => {
                  refPassword_Confirmation.current.focus();
                }}
                onChangeText={(value) => setForm('password', value)}
                blurOnSubmit={false}
              />

              <TouchableOpacity
                style={{marginLeft: 5}}
                onPress={() => setStatus('pass', !isStatus.pass)}>
                <FontAwesome
                  name={isStatus.pass != true ? 'eye-slash' : 'eye'}
                  color={myColor.fbtx}
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.textError, {marginLeft: 40}]}>
              {errorMsg.password}
            </Text>
          </View>

          {/* SECTION KONFIRMASI PASSWORD  */}
          <View style={[styles.wrapperLine, {marginBottom: 0}]}>
            <View style={styles.wrapperField}>
              <MaterialCommunityIcons
                name="lock-alert"
                color={myColor.fbtx}
                size={25}
                style={{marginRight: 5}}
              />

              <TextInput
                ref={refPassword_Confirmation}
                placeholder="Konfirmasi Password"
                value={user.password_confirmation}
                secureTextEntry={isStatus.confirm}
                style={styles.textInput}
                onChangeText={(value) =>
                  setForm('password_confirmation', value)
                }
              />

              <TouchableOpacity
                style={{marginLeft: 5}}
                onPress={() => setStatus('confirm', !isStatus.confirm)}>
                <FontAwesome
                  name={isStatus.confirm != true ? 'eye-slash' : 'eye'}
                  color={myColor.fbtx}
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.textError, {marginLeft: 40}]}>
              {errorMsg.password_confirmation}
            </Text>
          </View>

          <TouchableWithoutFeedback
            onPress={() => {
              setShowDatePicker(true);
              // alert('tot');
            }}>
            <View style={styles.wrapperLine}>
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: 'OpenSans-SemiBold',
                  fontSize: 12,
                  marginBottom: 3,
                }}>
                Tanggal Lahir
              </Text>
              <View style={styles.wrapperField}>
                <MaterialCommunityIcons
                  name="calendar"
                  color={myColor.fbtx}
                  size={25}
                  style={{marginRight: 5}}
                />

                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 12,
                    color: myColor.fbtx,

                    flex: 1,
                  }}>
                  {user.tanggal_lahir.getDate()}{' '}
                  {dataBulan[user.tanggal_lahir.getMonth()].nama}{' '}
                  {user.tanggal_lahir.getFullYear()}
                </Text>
                <AntDesign
                  name="caretdown"
                  color={myColor.fbtx}
                  size={10}
                  style={{marginRight: 5}}
                />
              </View>
              <Text style={[styles.textError, {marginLeft: 40}]}>
                {errorMsg.tanggal_lahir}
              </Text>
            </View>
          </TouchableWithoutFeedback>

          {/* <Button
            title="press"
            onPress={() => {
              setShowDatePicker(true);
              // alert('tot');
            }}
          /> */}

          {/* BUTTON SUBMIT FORM  */}
          <TouchableOpacity
            onPress={() => {
              submitRegister();
            }}>
            <View style={styles.btLogin}>
              <Text style={styles.textRegister}>Register</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: myColor.colorTheme,
    paddingTop: StatusBar.currentHeight,
  },
  animSVG: {
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  wrapperSVG: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontSVG: {fontSize: 26, color: 'white'},
  animForm: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 5,

    alignItems: 'center',
  },
  text1: {textAlign: 'center', fontWeight: 'bold', fontSize: 20},
  text2: {textAlign: 'center', fontSize: 14, fontWeight: 'bold'},
  wrapperField: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: myColor.divider,
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    width: 0.9 * screenWidth,
    paddingHorizontal: 10,
  },
  wrapperNama: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
    width: 0.9 * screenWidth,
    justifyContent: 'space-between',
  },
  fieldNama: {
    borderWidth: 1,
    borderColor: myColor.divider,
    borderRadius: 10,
    height: 40,
    width: 0.43 * screenWidth,
    alignItems: 'center',
  },
  inputNama: {fontFamily: 'OpenSans-Regular', fontSize: 12},
  textInput: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    flex: 1,
  },

  btLogin: {
    backgroundColor: myColor.myblue,

    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  textDaftar: {
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  textError: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: myColor.alert,
    maxWidth: 0.9 * screenWidth - 50,
  },
  wrapperLine: {
    marginBottom: 5,
  },
  wrapperUploadFoto: {
    width: 0.9 * screenWidth,
    marginTop: 10,
    alignItems: 'center',
  },
  circleAvatar: {
    height: 105,
    width: 105,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    marginBottom: 10,
  },
  textUploadFoto: {
    textAlign: 'center',
    color: myColor.blackText,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
  },
  avatar: {height: 100, width: 100, borderRadius: 50},
  widthErrorNama: {maxWidth: 0.43 * screenWidth, textAlign: 'center'},
  textRegister: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',

    color: '#fff',
  },
});
