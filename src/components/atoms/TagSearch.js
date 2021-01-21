import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {myColor} from '../../function/MyVar';

const TagSearch = ({tagName, tagColor, textColor, ...rest}) => {
  return (
    <TouchableOpacity {...rest}>
      <View style={[styles.sortOption, {backgroundColor: tagColor}]}>
        <Text
          style={{color: textColor, fontSize: 12, fontFamily: 'OpenSans-Bold'}}>
          {tagName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TagSearch;

const styles = StyleSheet.create({
  sortOption: {
    height: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: myColor.divider,

    margin: 5,
  },
});
