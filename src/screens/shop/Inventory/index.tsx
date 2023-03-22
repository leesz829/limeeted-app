import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';

const dummy = ['', '', '', ''];
export default function Inventory() {
  const [tab, setTab] = useState(categories[0]);
  const [data, setData] = useState(dummy);
  const onPressTab = (value) => {
    setTab(value);
  };
  return (
    <>
      <CommonHeader title="인벤토리" />
      <FlatList
        style={styles.root}
        data={data}
        ListHeaderComponent={
          <>
            <View style={styles.categoriesContainer}>
              {categories?.map((item) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.categoryBorder(item.value === tab.value)}
                  onPress={() => onPressTab(item)}
                >
                  <Text style={styles.categoryText(item.value === tab.value)}>
                    {item?.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ height: 30 }} />
          </>
        }
        renderItem={() => (
          <View style={styles.renderItem}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.thumb} />
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.title}>패스 200</Text>
                <Text style={styles.infoText}>
                  리미티드에서 보현적으로 사용하는 재화입니다.
                </Text>
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>사용/획득</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'white', paddingHorizontal: 16 },
  categoriesContainer: {
    marginTop: 15,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'flex-start',
  },
  categoryBorder: (isSelected: boolean) => {
    return {
      paddingVertical: 9,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: isSelected ? Color.primary : Color.grayAAAA,
      borderRadius: 9,
      marginLeft: 8,
    };
  },
  categoryText: (isSelected: boolean) => {
    return {
      fontSize: 14,
      color: isSelected ? Color.primary : Color.grayAAAA,
    };
  },
  renderItem: {
    width: `100%`,
    paddingVertical: 15,
    borderBottomColor: Color.grayEEEE,
    borderBottomWidth: 1,
  },
  thumb: {
    width: 110,
    height: 80,
    borderRadius: 5,
    backgroundColor: '#d1d1d1',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#363636',
  },
  infoText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#939393',
  },
  buttonWrapper: {
    marginTop: 12,
    width: '100%',
    alignItems: 'flex-end',
  },
  button: {
    width: 90,
    height: 29,
    borderRadius: 5,
    backgroundColor: '#742dfa',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  buttonText: {
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
});

const categories = [
  {
    label: '전체',
    value: 'all',
  },
  {
    label: '패스',
    value: 'pass',
  },
  {
    label: '구독',
    value: 'subscription',
  },
];
