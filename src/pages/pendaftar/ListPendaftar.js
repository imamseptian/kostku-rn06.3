import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';

import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {FlatListPendaftar} from '../../components';
import {
  ButtonLoad,
  SearchBar,
  SearchResult,
  TagSearch,
} from '../../components/atoms';
import {myAxios} from '../../function/MyAxios';
import {APIUrl, myColor, screenWidth} from '../../function/MyVar';

const ListPendaftar = ({navigation, route}) => {
  const scrollRef = useRef();
  const isFocused = useIsFocused();
  const [selectedTag, setSelectedTag] = useState(1);
  const dataRedux = useSelector((state) => state.AuthReducer);
  const [pendaftar, setPendaftar] = useState([]);
  const [banyakData, setbanyakData] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoad, setisLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    namakeyword: '',
    sortname: 'tanggal_daftar',
    orderby: 'asc',
    id_kost: dataRedux.user.kostku,
  });
  const [maxLimit, setmaxLimit] = useState(0);

  const setForm = (inputType, value) => {
    setFilter({
      ...filter,
      [inputType]: value,
    });
  };

  const ambilApi = async (myToken) => {
    console.log('daftar');
    setIsLoading(true);
    myAxios.postAxios(
      APIUrl + '/api/get_all_pendaftar?page=1',
      filter,
      dataRedux.token,
      myToken,
      onPost,
    );
    function onPost(status, data) {
      if (status == 'success') {
        setPendaftar(data.data.data);
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
      ambilApi(source.token);
    }
    return () => {
      setisLoad(false);
      setFilter({
        ...filter,
        namakeyword: '',
        sortname: 'tanggal_daftar',
        orderby: 'asc',
      });
      setSelectedTag(1);

      source.cancel('Component got unmounted');
    };
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

  useEffect(() => {
    if (page != 1) {
      const source = axios.CancelToken.source();
      setIsLoading(true);
      myAxios.postAxios(
        APIUrl + '/api/get_all_pendaftar?page=' + page,
        filter,
        dataRedux.token,
        source.token,
        onPost,
      );
      function onPost(status, data) {
        if (status == 'success') {
          setPendaftar(pendaftar.concat(data.data.data));
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

  const goToTop = () => {
    if (pendaftar.length > 0) {
      scrollRef.current.scrollToIndex({animated: true, index: 0});
    }
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar translucent backgroundColor="transparent" />

      <View style={styles.containerUp}>
        <View style={{marginLeft: 0.05 * screenWidth}}>
          <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold'}}>
            Cari Pendaftar
          </Text>
        </View>

        <View
          style={{
            width: screenWidth,
            paddingLeft: 0.05 * screenWidth,
            marginBottom: 20,
          }}>
          <SearchBar
            value={filter.namakeyword}
            placeholder={'Cari Pendaftar'}
            onChangeText={(value) => setForm('namakeyword', value)}
          />
        </View>
      </View>
      <View style={styles.containerBot}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center',
            marginBottom: 10,
            width: screenWidth,
            paddingLeft: 0.05 * screenWidth,
          }}>
          <Text
            style={{
              marginRight: 10,
              fontSize: 14,
              fontWeight: 'bold',
              color: myColor.darkText,
            }}>
            Urutkan
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TagSearch
              tagColor={selectedTag == 1 ? myColor.myblue : 'white'}
              textColor={selectedTag == 1 ? 'white' : myColor.darkText}
              onPress={() => {
                setSelectedTag(1);
                setForm('sortname', 'tanggal_daftar');
              }}
              tagName="Tanggal Daftar"
            />
            <TagSearch
              tagColor={selectedTag == 2 ? myColor.myblue : 'white'}
              textColor={selectedTag == 2 ? 'white' : myColor.darkText}
              onPress={() => {
                setSelectedTag(2);
                setForm('sortname', 'isread');
              }}
              tagName="Sudah Dibaca"
            />
            <TagSearch
              tagColor={selectedTag == 3 ? myColor.myblue : 'white'}
              textColor={selectedTag == 3 ? 'white' : myColor.darkText}
              onPress={() => {
                setSelectedTag(3);
                setForm('sortname', 'nama_depan');
              }}
              tagName="Nama"
            />
            <TagSearch
              tagColor={selectedTag == 4 ? myColor.myblue : 'white'}
              textColor={selectedTag == 4 ? 'white' : myColor.darkText}
              onPress={() => {
                setSelectedTag(4);
                setForm('sortname', 'umur');
              }}
              tagName="Umur"
            />
            <TagSearch
              tagColor={selectedTag == 5 ? myColor.myblue : 'white'}
              textColor={selectedTag == 5 ? 'white' : myColor.darkText}
              onPress={() => {
                setSelectedTag(5);
                setForm('sortname', 'kelamin');
              }}
              tagName="Kelamin"
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
        <View style={{paddingBottom: 50}}>
          {/* <FlatListPendaftar /> */}
          <FlatList
            ref={scrollRef}
            style={{paddingHorizontal: 0.05 * screenWidth}}
            data={pendaftar}
            keyExtractor={(item) => item.id.toString()}
            // extraData={selectedId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 40}}
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
                <FlatListPendaftar
                  item={item}
                  onPress={() => {
                    navigation.push('DetailPendaftar', {item});
                  }}
                />
              );
            }}
          />
          {/* <View style={{}} /> */}
        </View>
      </View>
      <ActivityIndicator
        animating={isLoading}
        size="large"
        color={myColor.myblue}
        style={styles.loading}
      />
    </View>
  );
};

export default ListPendaftar;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  containerUp: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: myColor.colorTheme,
  },
  containerBot: {
    flex: 1,
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
