import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import {
  myColor,
  defaultAsset,
  screenWidth,
  dataBulan,
  formatRupiah,
  APIUrl,
} from '../../../function/MyVar';
import axios from 'axios';
import {PureModal} from '../../../components';
// import {formatRupiah, myColor, screenWidth} from '../../../function/MyVar';
import {ModalEditBarang, ModalTambahBarang} from './';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const TabBarang = (props) => {
  const [penghuniItem, setpenghuniItem] = useState([]);
  const [showModalTambah, setShowModalTambah] = useState(false);
  const [showModalEdit, setshowModalEdit] = useState(false);
  const [biayaBarang, setbiayaBarang] = useState(0);

  const totalBiayaBarang = () => {
    console.log('ayaya');
    let total = 0;
    penghuniItem.forEach((x, i) => {
      console.log(typeof total);
      total = total + parseInt(x.total);
    });

    setbiayaBarang(total);
  };

  useEffect(() => {
    totalBiayaBarang();
  }, [penghuniItem]);

  const [selectedItem, setselectedItem] = useState({
    nama: '',
    qty: 1,
    total: 0,
    id_penghuni: props.id_penghuni,
  });

  const loadData = () => {
    axios
      .get(APIUrl + '/api/barang_penghuni/' + props.id_penghuni)
      .then((res) => {
        // console.log(res.data);
        setpenghuniItem(res.data.barang);
      })
      .catch((error) => {
        alert('ERROR BARANG PENGHUNI');
      });
  };

  useEffect(() => {
    loadData();
  }, [props.id_penghuni]);

  return (
    <View
      style={{
        width: props.lebar,
        paddingHorizontal: 10,
        paddingTop: 25,
      }}>
      <Modal
        visible={showModalTambah}
        transparent={true}
        onRequestClose={() => setShowModalTambah(false)}>
        <PureModal>
          <ModalTambahBarang
            id_penghuni={props.id_penghuni}
            refreshFunction={() => {
              setShowModalTambah(false);
              loadData();
            }}
            closeModal={() => {
              setShowModalTambah(false);
            }}
          />
        </PureModal>
      </Modal>

      <Modal
        visible={showModalEdit}
        transparent={true}
        onRequestClose={() => setshowModalEdit(false)}>
        <PureModal>
          <ModalEditBarang
            id_penghuni={props.id_penghuni}
            data={selectedItem}
            refreshFunction={() => {
              setshowModalEdit(false);
              loadData();
            }}
            closeModal={() => {
              setshowModalEdit(false);
            }}
          />
        </PureModal>
      </Modal>

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
            Kamar Penghuni
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'OpenSans-SemiBold',
            color: myColor.fbtx,
            fontSize: 14,
            marginBottom: 10,
            textAlign: 'center',
          }}>
          Kamar A Putri
        </Text>
        <Text
          style={{
            fontFamily: 'OpenSans-Regular',
            color: myColor.fbtx,
            fontSize: 12,
            marginBottom: 10,
            textAlign: 'center',
          }}>
          Biaya Sewa : Rp. 500.000 / Bulan
        </Text>
        <Image
          source={{
            uri:
              'https://arcadiadesain.com/wp-content/uploads/2019/11/63-Inspirasi-Desain-Kamar-Kost-Sederhana-Trend-Masa-Kini.jpg',
          }}
          style={{height: 120, borderRadius: 10}}
          resizeMode="contain"
        />
      </View>

      {/* <Text>{JSON.stringify(penghuniItem)}</Text> */}
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'OpenSans-SemiBold',
          fontSize: 14,
        }}>
        Barang Penghuni
      </Text>
      <TouchableOpacity
        onPress={() => {
          setShowModalTambah(true);
        }}>
        <View
          style={{
            backgroundColor: myColor.addfacility,
            paddingVertical: 10,
            marginVertical: 10,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'OpenSans-SemiBold',
              fontSize: 14,
              color: '#fff',
            }}>
            Tambah Barang
          </Text>
        </View>
      </TouchableOpacity>
      {penghuniItem.map((item, index) => {
        return (
          <TouchableNativeFeedback
            key={index}
            onPress={() => {
              setselectedItem(penghuniItem[index]);
              setshowModalEdit(true);
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,

                backgroundColor: '#fff',
                elevation: 5,
                paddingHorizontal: 15,
                margin: 3,
                borderRadius: 5,
                borderColor: myColor.bgfb,
                borderWidth: 1,
                justifyContent: 'space-between',
                paddingVertical: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.textBarang, {color: myColor.fbtx}]}>{`${
                  index + 1
                }. `}</Text>
                <Text
                  style={[
                    styles.textBarang,
                    {width: 0.3 * screenWidth, color: myColor.fbtx},
                  ]}>{`${item.nama} `}</Text>
                <Text
                  style={[
                    styles.textBarang,
                    {color: myColor.darkText},
                  ]}>{`${item.qty} buah =`}</Text>
              </View>
              <View>
                <Text style={[styles.textBarang, {color: myColor.darkText}]}>
                  {`${formatRupiah(item.total.toString(), 'Rp')}`}
                </Text>
              </View>

              {/* <Text>{`x ${JSON.stringify(x)}`}</Text> */}
            </View>
          </TouchableNativeFeedback>
        );
      })}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          borderBottomWidth: 1,
        }}>
        <Text>+</Text>
      </View>
      <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text>Total Biaya Barang</Text>
        <Text>{formatRupiah(biayaBarang.toString(), 'Rp. ')}</Text>
        {/* <Text>{biayaBarang}</Text> */}
      </View>
    </View>
  );
};

export default TabBarang;

const styles = StyleSheet.create({
  wrapperCard: {
    paddingVertical: 15,

    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    position: 'relative',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: myColor.divider,
  },
  wrapperTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: -20,
    left: 10,
  },
  image: {height: 150, borderRadius: 10},
});
