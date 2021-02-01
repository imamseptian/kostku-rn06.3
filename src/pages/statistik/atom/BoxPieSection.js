import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import axios from 'axios';

const BoxPieSection = (props) => {
  const [namaDaerah, setnamaDaerah] = useState('');

  useEffect(() => {
    if (props.keyword === 'etc') {
      axios
        .get(
          `https://dev.farizdotid.com/api/daerahindonesia/${props.keyword}/${
            props.keyword === 'provinsi' ? props.data.provinsi : props.data.kota
          }`,
        )
        .then((res) => {
          setnamaDaerah(res.data.nama);
        })
        .catch((error) => {
          console.log(error);
          console.log('error box pie section get nama');
        });
    }
  }, [props.data]);

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={{flexDirection: 'row'}}>
        <View style={[styles.tagBox, {backgroundColor: props.color}]}></View>
        <Text style={{marginLeft: 5}}>
          {props.keyword === 'etc' ? 'dan lain-lain' : namaDaerah}
          {/* {JSON.stringify(props.data)} */}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BoxPieSection;

const styles = StyleSheet.create({
  tagBox: {
    height: 20,
    width: 20,

    marginBottom: 8,
  },
});
