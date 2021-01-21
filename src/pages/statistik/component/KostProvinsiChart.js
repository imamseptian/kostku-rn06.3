import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PieChart} from 'react-native-svg-charts';
import {myColor, screenWidth} from '../../../function/MyVar';

class KostProvinsiChart extends React.PureComponent {
  render() {
    const {
      item,
      data,
      colorData,
      onPiePress,
      selectedPie,
      ...rest
    } = this.props;

    const pieData = data.map((item, index) => ({
      value: item.quantity,
      svg: {
        fill: colorData[index],
        onPress: () => {
          onPiePress(index);
        },
      },
      key: `pie-${index}`,
    }));

    return (
      <View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 14,
            fontFamily: 'OpenSans-Bold',
          }}>
          Statistik Provinsi
        </Text>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'red',
          }}>
          <PieChart
            style={{
              width: 180,
            }}
            data={pieData}
          />

          <View style={{marginLeft: 10}}>
            {data.map((x, i) => {
              return (
                <View key={i} style={{flexDirection: 'row'}}>
                  <View
                    style={[
                      styles.tagBox,
                      {backgroundColor: colorData[i]},
                    ]}></View>
                  <Text style={{marginLeft: 5}}>
                    {i === data.length - 1
                      ? 'dan lain-lain'
                      : x.provinsi.toString()}
                  </Text>
                </View>
              );
            })}

            {/* <View style={styles.tagBox}></View>
            <View style={styles.tagBox}></View>
            <View style={styles.tagBox}></View>
            <View style={styles.tagBox}></View>
            <View style={styles.tagBox}></View> */}
          </View>
        </View>
      </View>
    );
  }
}

export default KostProvinsiChart;

const styles = StyleSheet.create({
  tagBox: {
    height: 20,
    width: 20,

    marginBottom: 8,
  },
});
