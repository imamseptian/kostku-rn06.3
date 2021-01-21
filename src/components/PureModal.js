import React from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';

const PureModal = (props) => {
  // const {children, ...rest} = this.props;
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}>
      {/* <View
          style={{
            paddingHorizontal: 10,
            paddingBottom: 20,
            width: screenWidth * 0.88,
            borderRadius: 5,
            backgroundColor: 'white',
            elevation: 5,
            alignItems: 'center',
          }}>
          <Text>{this.props.data}</Text>
        </View> */}
      {props.children}
    </View>
  );
};

export default PureModal;

const styles = StyleSheet.create({});
