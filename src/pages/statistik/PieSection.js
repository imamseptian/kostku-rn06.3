import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, View, Text, ScrollView} from 'react-native';
import {PureModal} from '../../components';
import {myColor, APIUrl} from '../../function/MyVar';
import {
  KostPenghuniChart,
  ModalPenghuni,
  KostProvinsiChart,
  ModalProvinsi,
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

  //   const [state, setstate] = useState(initialState);
  const randomColor = () =>
    ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
      0,
      7,
    );
  useEffect(() => {
    axios
      .post(APIUrl + '/api/statistik_pie', {
        id_kost: 1,
      })
      .then((res) => {
        let tempProvColor = [];

        if (res.data.provinsi.length > 6) {
          let tempArr = [];
          let combineArr = [];
          let tempTotal = 0;
          res.data.provinsi.forEach((x, i) => {
            if (i > 4) {
              combineArr.push(x.provinsi);
              tempTotal = tempTotal + x.quantity;
            } else {
              tempArr.push(x);
            }
          });
          tempArr.push({provinsi: combineArr, quantity: tempTotal});
          tempArr.forEach((x, i) => {
            tempProvColor.push(randomColor());
          });
          setprovinsiColor(tempProvColor);
          setPieProvinsi(tempArr);
        } else {
          res.data.provinsi.forEach((x, i) => {
            tempProvColor.push(randomColor());
          });
          setprovinsiColor(tempProvColor);
          setPieProvinsi(res.data.provinsi);
        }

        setPieDataPenghuni(res.data.penghuni);

        // console.log(res.data.provinsi);
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
          <ModalProvinsi
            data={pieProvinsi[selectedPieProvinsi]}
            closeModal={() => setshowModalProvinsi(false)}
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

      <KostProvinsiChart
        data={pieProvinsi}
        colorData={provinsiColor}
        onPiePress={(v) => {
          //   console.log(v);
          setSelectedPieProvinsi(v);
          setshowModalProvinsi(true);
          // alert(v);
        }}
        selectedPie={selectedPiePenghuni}
      />

      {/* <Text>{JSON.stringify(pieDataPenghuni)}</Text> */}
      <Text>{JSON.stringify(pieProvinsi)}</Text>
      <Text>{pieProvinsi.length}</Text>
      {/* <Text>{JSON.stringify(provinsiColor)}</Text> */}
      {/* <Text>{JSON.stringify(mapData)}</Text> */}
    </View>
  );
};

export default PieSection;

const styles = StyleSheet.create({});
