import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Modal, ScrollView} from 'react-native';
import {KostPenghuniChart, ModalPenghuni, ModalTransaksi} from './component';
import axios from 'axios';
import {myColor, formatRupiah} from '../../function/MyVar';
import {FlatListPendaftar, MiniHeader, PureModal} from '../../components';
import {PieSection, TestPie, GraphSection} from './';

const KostStatistik = () => {
  // const dataPendapatan = [3000000, 500000, 5000000, 300000, 7000000];
  const [dataPendapatan, setdataPendapatan] = useState([]);
  const [linePendapatan, setlinePendapatan] = useState([]);
  const [selectedDotPendapatan, setSelectedDotPendapatan] = useState(0);
  const [showModalPendapatan, setshowModalPendapatan] = useState(false);

  const [dataPengeluaran, setdataPengeluaran] = useState([]);
  const [linePengeluaran, setlinePengeluaran] = useState([]);
  const [selectedDotPengeluaran, setSelectedDotPengeluaran] = useState(0);
  const [showModalPengeluaran, setshowModalPengeluaran] = useState(false);

  const setterChart = (retData, callback1, callback2) => {
    let tempArr = [];
    retData.forEach((x, i) => {
      tempArr.push(x.value);
    });
    callback1(retData);
    callback2(tempArr);
  };

  useEffect(() => {
    axios
      .get('https://dry-forest-53707.herokuapp.com/api/chart_keuangan/1')
      .then((res) => {
        setterChart(res.data.pendapatan, setdataPendapatan, setlinePendapatan);
        setterChart(
          res.data.pengeluaran,
          setdataPengeluaran,
          setlinePengeluaran,
        );

        // setlabelpendapatan(res.data.label);
      })
      .catch((error) => {
        alert('error chart keuangan');
      });
  }, []);

  return (
    <View>
      <ScrollView>
        <Modal
          visible={showModalPendapatan}
          transparent={true}
          onRequestClose={() => setshowModalPendapatan(false)}>
          <PureModal>
            <ModalTransaksi
              data={dataPendapatan[selectedDotPendapatan]}
              jenis={1}
              closeModal={() => {
                setshowModalPendapatan(false);
              }}
            />
          </PureModal>
        </Modal>

        <Modal
          visible={showModalPengeluaran}
          transparent={true}
          onRequestClose={() => setshowModalPengeluaran(false)}>
          <PureModal>
            <ModalTransaksi
              data={dataPengeluaran[selectedDotPengeluaran]}
              jenis={2}
              closeModal={() => {
                setshowModalPengeluaran(false);
              }}
            />
          </PureModal>
        </Modal>

        {/*         
        <Text>{JSON.stringify(dataPendapatan)}</Text>
        <Text>{JSON.stringify(linePendapatan)}</Text> */}
        {/* <PieSection /> */}
        {/* <GraphSection /> */}
        <GraphSection
          data={dataPendapatan}
          // x_axis={labelpendapatan}
          graphLine={linePendapatan}
          onDotPress={(v) => {
            setSelectedDotPendapatan(v);
            setshowModalPendapatan(true);
            // alert(v);
            // setShowModalPendapatan(true);
          }}
          selectedDot={selectedDotPendapatan}>
          <Text style={{fontSize: 14, fontFamily: 'OpenSans-Bold'}}>
            Statistik Pendapatan
          </Text>
        </GraphSection>

        <GraphSection
          data={dataPengeluaran}
          // x_axis={labelpendapatan}
          graphLine={linePengeluaran}
          onDotPress={(v) => {
            setSelectedDotPengeluaran(v);
            setshowModalPengeluaran(true);
            // alert(v);
            // setShowModalPendapatan(true);
          }}
          selectedDot={selectedDotPengeluaran}>
          <Text style={{fontSize: 14, fontFamily: 'OpenSans-Bold'}}>
            Statistik Pengeluaran
          </Text>
        </GraphSection>
        {/* <TestPie /> */}
        <PieSection />
      </ScrollView>
    </View>
  );
};

export default KostStatistik;

const styles = StyleSheet.create({});
