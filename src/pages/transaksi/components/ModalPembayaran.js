import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import {
  myColor,
  screenWidth,
  screenHeight,
  formatRupiah,
  APIUrl,
} from '../../../function/MyVar';
import axios from 'axios';
import {myAxios} from '../../../function/MyAxios';
import {useSelector} from 'react-redux';

const ModalPembayaran = (props) => {
  const [total, settotal] = useState(0);
  const dataRedux = useSelector((state) => state.AuthReducer);

  useEffect(() => {
    let tempTotal = 0;
    props.data.forEach((x, i) => {
      if (x.selected) {
        tempTotal = tempTotal + x.jumlah;
      }
      // tempList.push(formatRupiah('0', 'Rp. '));
    });
    settotal(tempTotal);
  }, [props.data]);

  const catatTransaksi = () => {
    let arrBayar = [];
    props.data.forEach((x, i) => {
      if (x.selected) {
        arrBayar.push(x);
      }
      // tempList.push(formatRupiah('0', 'Rp. '));
    });

    axios
      .post(APIUrl + '/api/catattransaksi', {
        data_bayar: arrBayar,
        id_kost: dataRedux.user.kostku,
        id_penghuni: props.penghuni.id,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.code == 200) {
          alert('sukses');
          props.refreshData();
          props.closeModal();
          props.setPenghuni(res.data.penghuni);
        } else {
          alert('aaaaa');
        }
      })
      .catch((error) => {
        alert('error catat');
        console.log(arrBayar);
        console.log(dataRedux.user.kostku);
        console.log(props.penghuni.id);
      });

    // alert(nominalBayar);
    // const source = axios.CancelToken.source();
    // if (penghuni !== undefined) {
    //   myAxios.postAxios(
    //     APIUrl + '/api/bayartagihan',
    //     {
    //       bayar: nominalBayar,
    //       id_penghuni: penghuni.id,
    //       perbulan: penghuni.harga_kamar,
    //       id_kost: dataRedux.user.kostku,
    //     },
    //     dataRedux.token,
    //     source.token,
    //     onPost,
    //   );
    //   function onPost(status, data) {
    //     if (status == 'success') {
    //       alert('Pembayaran Sukses');
    //       setshowModalBayar(false);
    //       console.log('pembayaran sukses' + penghuni);
    //       console.log(penghuni);
    //       refreshPenghuni();
    //     } else if (status == 'cancel') {
    //       console.log('caught cancel filter');
    //     } else {
    //       console.log(data);
    //     }
    //   }
    // }
  };
  return (
    <View
      style={{
        backgroundColor: '#f6f6f6',
        width: 0.8 * screenWidth,
        maxHeight: 0.75 * screenHeight,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: screenWidth * 0.03,
      }}>
      <Text style={styles.modalTitle}>Bayar Tagihan</Text>

      {/* <View style={styles.cardTagihan}>
        <Text style={styles.titleTagihan}>September 2020</Text>
        <Text style={styles.titleHarga}>Rp. 200.000</Text>
      </View>
      <View style={styles.cardTagihan}>
        <Text style={styles.titleTagihan}>September 2020</Text>
        <Text style={styles.titleHarga}>Rp. 200.000</Text>
      </View>
      <View style={styles.cardTagihan}>
        <Text style={styles.titleTagihan}>September 2020</Text>
        <Text style={styles.titleHarga}>Rp. 200.000</Text>
      </View> */}
      <FlatList
        style={{paddingHorizontal: 3}}
        data={props.data}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index, separator}) => {
          if (item.selected) {
            return (
              <View style={styles.cardTagihan}>
                <Text style={styles.titleTagihan}>
                  {item.bulan} {item.tahun}
                </Text>
                <Text style={styles.titleHarga}>
                  {formatRupiah(item.jumlah.toString(), 'Rp. ')}
                </Text>
              </View>
            );
          }
        }}
      />

      <View style={styles.summaryLine}>
        <Text style={styles.plusSign}>+</Text>
      </View>
      <View style={styles.lineTotal}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={[styles.totalText, {color: myColor.grayGoogle}]}>
          {formatRupiah(total.toString(), 'Rp. ')}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          catatTransaksi();
        }}>
        <View
          style={[styles.actionButton, {backgroundColor: myColor.addfacility}]}>
          <Text style={styles.textButton}>Catat Transaksi</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          props.closeModal();
        }}>
        <View style={styles.actionButton}>
          <Text style={styles.textButton}>Tutup</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ModalPembayaran;

const styles = StyleSheet.create({
  modalTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  titleTagihan: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: myColor.fbtx,
  },
  titleHarga: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: myColor.grayGoogle,
  },
  cardTagihan: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: myColor.divider,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  plusSign: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: myColor.fbtx,
  },
  summaryLine: {
    flexDirection: 'row-reverse',
    borderBottomWidth: 1,
    borderBottomColor: myColor.fbtx,
    marginBottom: 10,
  },
  actionButton: {
    height: 40,
    backgroundColor: myColor.alert,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  textButton: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#ffffff',
    fontSize: 14,
  },
  lineTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: myColor.fbtx,
  },
});
