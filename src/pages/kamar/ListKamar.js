import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState, useRef} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FAB} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {
  ButtonLoad,
  SearchBar,
  SearchResult,
  TagSearch,
} from '../../components/atoms';
import {myAxios} from '../../function/MyAxios';
import {APIUrl, myColor, screenHeight, screenWidth} from '../../function/MyVar';
import {ItemKelas} from './component';

const ListKamar = ({navigation}) => {
  const isFocused = useIsFocused();

  const scrollRef = useRef();
  const dataRedux = useSelector((state) => state.AuthReducer);
  const [kamar, setKamar] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(1);
  const [maxLimit, setmaxLimit] = useState(0);
  const [banyakData, setbanyakData] = useState(0);
  const [isLoad, setisLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    id_kost: dataRedux.user.kostku,
    namakeyword: '',
    sortname: 'nama',
    orderby: 'asc',
  });

  const setForm = (inputType, value) => {
    setFilter({
      ...filter,
      [inputType]: value,
    });
  };

  const ambilApi = (myToken) => {
    // const source = axios.CancelToken.source();
    console.log('INI AMBIL API', isFocused);
    setIsLoading(true);
    myAxios.postAxios(
      APIUrl + '/api/classes?page=1',
      filter,
      dataRedux.token,
      myToken,
      onPost,
    );
    function onPost(status, data) {
      if (status == 'success') {
        console.log(`My filter : ${filter.id_kost}`);
        console.log(`Data : ${data}`);
        // console.log(data.data.data);
        setKamar(data.data.data);
        setmaxLimit(data.data.last_page);
        setbanyakData(data.data.total);
        setisLoad(true);
        setIsLoading(false);
      } else if (status == 'cancel') {
        console.log('caught cancel filter');
      } else {
        console.log(data);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isFocused) {
      console.log('FOCUS LIST KAMAR --------------------');
      console.log('focus', filter);
      ambilApi(source.token);
    }

    return () => {
      console.log('LOST FOCUS LIST KAMAR --------------------');
      setisLoad(false);
      setFilter({
        ...filter,
        namakeyword: '',
        sortname: 'nama',
        orderby: 'asc',
      });

      setSelectedTag(1);
      source.cancel('Component got unmounted');
      // console.log('unmounted');
    };
    // console.log('ayaya');
  }, [isFocused]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isLoad) {
      goToTop();
      ambilApi(source.token);
    }

    return () => {
      source.cancel('FIlter CANCELED');
    };
  }, [filter]);

  const goToTop = () => {
    if (kamar.length > 0) {
      scrollRef.current.scrollToIndex({animated: true, index: 0});
    }
  };

  useEffect(() => {
    if (page != 1) {
      const source = axios.CancelToken.source();
      setIsLoading(true);
      myAxios.postAxios(
        APIUrl + '/api/classes?page=' + page,
        filter,
        dataRedux.token,
        source.token,
        onPost,
      );
      function onPost(status, data) {
        if (status == 'success') {
          setKamar(kamar.concat(data.data.data));
          setmaxLimit(data.data.last_page);
          setbanyakData(data.data.total);
          setIsLoading(false);
        } else if (status == 'cancel') {
          console.log('caught cancel filter');
        } else {
          console.log(data);
          setIsLoading(false);
        }
      }
    }
  }, [page]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header and SearchBar Section  */}
      <View style={styles.wrapperHeader}>
        <Text style={styles.title}>Daftar Kamar Kost</Text>
        <View style={{marginBottom: 20}}>
          <SearchBar
            value={filter.namakeyword}
            placeholder={'Cari Jenis Kamar'}
            onChangeText={(value) => setForm('namakeyword', value)}
            clearText={() => {
              setForm('namakeyword', '');
            }}
          />
        </View>
      </View>

      {/* Content Section  */}
      <View style={{flex: 1}}>
        <View style={styles.sortWrapper}>
          <Text style={styles.sortTitle}>Urutkan</Text>

          {/* Sort Option Section  */}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TagSearch
              tagColor={selectedTag == 1 ? myColor.myblue : 'white'}
              textColor={selectedTag == 1 ? 'white' : myColor.darkText}
              onPress={() => {
                setSelectedTag(1);
                setForm('sortname', 'nama');
              }}
              tagName="Nama"
            />
            <TagSearch
              tagColor={selectedTag == 2 ? myColor.myblue : 'white'}
              textColor={selectedTag == 2 ? 'white' : myColor.darkText}
              onPress={() => {
                setSelectedTag(2);
                setForm('sortname', 'harga');
              }}
              tagName="Harga"
            />
            <TagSearch
              tagColor={selectedTag == 3 ? myColor.myblue : 'white'}
              textColor={selectedTag == 3 ? 'white' : myColor.darkText}
              onPress={() => {
                setSelectedTag(3);
                setForm('sortname', 'kapasitas');
              }}
              tagName="Kapasitas"
            />
          </ScrollView>
        </View>

        <SearchResult
          sortCondition={filter.orderby}
          banyak={banyakData}
          onPress={() => {
            if (filter.orderby == 'asc') {
              setForm('orderby', 'desc');
            } else {
              setForm('orderby', 'asc');
            }
          }}
        />

        {/* List Kamar Section  */}
        <FlatList
          ref={scrollRef}
          style={{marginTop: 10, paddingHorizontal: 0.05 * screenWidth}}
          data={kamar}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            page < maxLimit && !isLoading ? (
              <ButtonLoad
                onPress={() => {
                  setPage((prevState) => prevState + 1);
                }}
              />
            ) : null
          }
          renderItem={({item, index, separator}) => {
            return (
              <ItemKelas
                data={item}
                onPress={() => navigation.push('DetailKelas', {item})}
              />
            );
          }}
        />
      </View>

      <FAB
        style={styles.fab}
        small
        icon="plus"
        color="white"
        onPress={() => navigation.push('CreateKelas')}
      />
      <ActivityIndicator
        animating={isLoading}
        size="large"
        color={myColor.myblue}
        style={styles.loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },

  title: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffaa91',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  searchWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'white',
    width: 0.9 * screenWidth,
    alignItems: 'center',
    borderRadius: 25,
    height: 40,
  },
  searchTextInput: {
    flex: 1,
    marginRight: 15,
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
  wrapperHeader: {
    backgroundColor: myColor.colorTheme,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 0.05 * screenWidth,
  },
  sortWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 10,

    paddingLeft: 0.05 * screenWidth,
  },
  sortTitle: {
    marginRight: 10,
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: myColor.fbtx,
  },
});

export default ListKamar;
