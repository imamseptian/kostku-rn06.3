import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, View, Text, ScrollView} from 'react-native';
import {PureModal} from '../../components';
import {myColor, APIUrl} from '../../function/MyVar';
import {
  KostPenghuniChart,
  ModalPenghuni,
  KostDaerahChart,
  ModalDaerah,
} from './component';

const PieSection = () => {
  const [pieDataPenghuni, setPieDataPenghuni] = useState([]);
  const pieColor = [myColor.myblue, myColor.colorTheme];
  const [selectedPiePenghuni, setSelectedPiePenghuni] = useState(0);
  const [showModalPenghuni, setShowModalPenghuni] = useState(false);

  const [pieProvinsi, setPieProvinsi] = useState([]);
  const [selectedPieProvinsi, setSelectedPieProvinsi] = useState(0);
  const [showModalProvinsi, setshowModalProvinsi] = useState(false);
  const [provinsiColor, setprovinsiColor] = useState([]);

  const [pieKota, setPieKota] = useState([]);
  const [selectedPieKota, setSelectedPieKota] = useState(0);
  const [showModalKota, setshowModalKota] = useState(false);
  const [kotaColor, setKotaColor] = useState([]);

  //   const [state, setstate] = useState(initialState);
  const randomColor = () =>
    ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
      0,
      7,
    );

  const setterDaerah = (retData, daerah, callback1, callback2) => {
    let tempProvColor = [];
    if (retData.length > 6) {
      let tempArr = [];
      let combineArr = [];
      let tempTotal = 0;
      retData.forEach((x, i) => {
        if (i > 4) {
          combineArr.push(x[daerah]);
          tempTotal = tempTotal + x.quantity;
        } else {
          tempArr.push(x);
        }
      });
      tempArr.push({[daerah]: combineArr, quantity: tempTotal});
      tempArr.forEach((x, i) => {
        tempProvColor.push(randomColor());
      });
      callback2(tempProvColor);
      callback1(tempArr);
    } else {
      retData.forEach((x, i) => {
        tempProvColor.push(randomColor());
      });
      callback2(tempProvColor);
      callback1(retData);
    }
  };

  useEffect(() => {
    axios
      .post(APIUrl + '/api/statistik_pie', {
        id_kost: 1,
      })
      .then((res) => {
        setterDaerah(
          res.data.provinsi,
          'provinsi',
          setPieProvinsi,
          setprovinsiColor,
        );
        setterDaerah(res.data.kota, 'kota', setPieKota, setKotaColor);

        setPieDataPenghuni(res.data.penghuni);

        // console.log(res.data.provinsi);
      })
      .catch((error) => {
        alert('error pie');
      });
  }, []);

  return (
    <View>
      <Modal
        visible={showModalPenghuni}
        transparent={true}
        onRequestClose={() => setShowModalPenghuni(false)}>
        <PureModal>
          <ModalPenghuni
            closeModal={() => setShowModalPenghuni(false)}
            data={pieDataPenghuni[selectedPiePenghuni]}
            keyword={'kelamin'}
          />
        </PureModal>
      </Modal>

      <Modal
        visible={showModalProvinsi}
        transparent={true}
        onRequestClose={() => setshowModalProvinsi(false)}>
        <PureModal>
          <ModalDaerah
            data={pieProvinsi[selectedPieProvinsi]}
            closeModal={() => setshowModalProvinsi(false)}
            daerah="provinsi"
          />
        </PureModal>
      </Modal>

      <Modal
        visible={showModalKota}
        transparent={true}
        onRequestClose={() => setshowModalKota(false)}>
        <PureModal>
          <ModalDaerah
            data={pieKota[selectedPieKota]}
            closeModal={() => setshowModalKota(false)}
            daerah="kota"
          />
        </PureModal>
      </Modal>

      <KostPenghuniChart
        data={pieDataPenghuni}
        colorData={pieColor}
        onPiePress={(v) => {
          //   console.log(v);
          setSelectedPiePenghuni(v);
          setShowModalPenghuni(true);
        }}
        selectedPie={selectedPiePenghuni}
      />

      <KostDaerahChart
        data={pieProvinsi}
        title="Statistik Provinsi"
        colorData={provinsiColor}
        onPiePress={(v) => {
          //   console.log(v);
          setSelectedPieProvinsi(v);
          setshowModalProvinsi(true);
          // alert(v);
        }}
        daerah="provinsi"
      />

      <KostDaerahChart
        data={pieKota}
        title="Statistik Kota"
        colorData={kotaColor}
        onPiePress={(v) => {
          //   console.log(v);
          setSelectedPieKota(v);
          setshowModalKota(true);
          // alert(v);
        }}
        daerah="kota"
      />

      {/* <KostDaerahChart
        data={pieProvinsi}
        colorData={provinsiColor}
        onPiePress={(v) => {
          //   console.log(v);
          setSelectedPieProvinsi(v);
          setshowModalProvinsi(true);
          // alert(v);
        }}
        selectedPie={selectedPiePenghuni}
      /> */}
      <Text>{JSON.stringify(pieKota)}</Text>
      {/* <Text>{JSON.stringify(pieDataPenghuni)}</Text> */}
      {/* <Text>{JSON.stringify(pieProvinsi)}</Text>
      <Text>{pieProvinsi.length}</Text> */}
      {/* <Text>{JSON.stringify(provinsiColor)}</Text> */}
      {/* <Text>{JSON.stringify(mapData)}</Text> */}
    </View>
  );
};

export default PieSection;

const styles = StyleSheet.create({});
