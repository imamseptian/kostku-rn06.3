import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import {KostPenghuniChart, ModalPenghuni, ModalTransaksi} from './component';
import axios from 'axios';
import {myColor, formatRupiah, APIUrl} from '../../function/MyVar';
import {FlatListPendaftar, MiniHeader, PureModal} from '../../components';
import {PieSection, TestPie, GraphSection} from './';
import {HeaderTheme} from '../../components';
import {useSelector} from 'react-redux';

const screenWidth = Math.round(Dimensions.get('window').width);
const KostStatistik = ({navigation, route}) => {
  const dataRedux = useSelector((state) => state.AuthReducer);

  const [isLoading, setisLoading] = useState(false);
  const [lebar, setlebar] = useState(screenWidth);
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
    setisLoading(true);
    axios
      .get(APIUrl + '/api/chart_keuangan/' + dataRedux.user.kostku)
      .then((res) => {
        setterChart(res.data.pendapatan, setdataPendapatan, setlinePendapatan);
        setterChart(
          res.data.pengeluaran,
          setdataPengeluaran,
          setlinePengeluaran,
        );
        setisLoading(false);

        // setlabelpendapatan(res.data.label);
      })
      .catch((error) => {
        alert('error chart keuangan');
        setisLoading(false);
      });
  }, []);

  return (
    <View
      onLayout={(event) => {
        const {x, y, width, height} = event.nativeEvent.layout;
        // console.log(width, width);
        setlebar(width);

        // do something here like set your initial animated value for the height
      }}>
      <HeaderTheme
        openDrawer={() => navigation.toggleDrawer()}
        title="Statistik Kost"
      />

      <Modal
        visible={showModalPendapatan}
        transparent={true}
        onRequestClose={() => setshowModalPendapatan(false)}>
        <PureModal>
          <ModalTransaksi
            lebar={lebar}
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
            lebar={lebar}
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
      <ScrollView style={{paddingVertical: 10}}>
        <GraphSection
          isLoading={isLoading}
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
          isLoading={isLoading}
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
        <PieSection id_kost={dataRedux.user.kostku} />

        <View style={{height: 100}}></View>

        {/* <TestPie /> */}
      </ScrollView>
    </View>
  );
};

export default KostStatistik;

const styles = StyleSheet.create({});
