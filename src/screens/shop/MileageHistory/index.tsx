import { Color } from 'assets/styles/Color';
import { styles } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import { SectionGrid } from 'react-native-super-grid';
import { ICON } from 'utils/imageUtils';

const DATA = [
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['Pizza', 'Burger', 'Risotto', 'Pizza', 'Burger', 'Risotto'],
  },
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];

export default function MileageHistory() {
  const [data, setData] = useState(DATA);
  const ListHeaderComponent = () => (
    <View>
      <View style={listHeader.limitBox}>
        <Text style={listHeader.limitText}>LIMIT</Text>
      </View>
      <Text style={listHeader.mainInfo}>방배동 아이유님의{'\n'}리밋이력</Text>
      <View style={listHeader.filterBox}>
        <Text style={listHeader.filterText}>최신순 23.01.04 ~ 23.02.03</Text>
      </View>
      <View style={listHeader.spacer} />
    </View>
  );
  const sectionHeader = ({ section }) => (
    <View style={itemStyle.sectionHeader}>
      <Text style={itemStyle.sectionText}>{section.title}</Text>
    </View>
  );
  const renderItem = ({ item, index }) => {
    return (
      <View style={itemStyle.container}>
        <View style={{ flexDirection: 'row' }}>
          {/* 분기해서 쓰기 */}
          <Image source={ICON.roundCrown} style={{ width: 19, height: 19 }} />
          <Image source={ICON.delevery} style={{ width: 19, height: 19 }} />
          {/* 분기해서 쓰기 */}
          <View style={{ marginLeft: 6 }}>
            <Text style={itemStyle.typeText}>
              제품/모델명에 입찰
              <Text style={itemStyle.actionText}>하였습니다</Text>
            </Text>
            <Text style={itemStyle.dateText}>15:10 | 차감</Text>
            {/* 분기해서 쓰기 */}
            <Text style={itemStyle.targetTextNormal}>
              리밋수량
              <Text style={itemStyle.targetTextEnd}>이 차감되었습니다</Text>
            </Text>
            <Text style={itemStyle.targetTextPositive}>
              리밋수량
              <Text style={itemStyle.targetTextEnd}>을 돌려 받았습니다</Text>
            </Text>
            <TouchableOpacity>
              <Text style={itemStyle.checkOrder}>주문내역 확인하기</Text>
            </TouchableOpacity>
            {/* 분기해서 쓰기 */}
          </View>
        </View>
        {/* 분기해서 쓰기 */}
        <View>
          <Text style={itemStyle.amountText}>-10,000</Text>
        </View>
        <View style={itemStyle.copyCode}>
          <Text style={itemStyle.copyCodeText}>송장번호 복사</Text>
        </View>
        {/* 분기해서 쓰기 */}
      </View>
    );
  };
  const ItemSeparatorComponent = () => (
    <View style={{ height: 1, opacity: 0.1, backgroundColor: '#707070' }} />
  );
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <CommonHeader />

      <SectionGrid
        style={{ paddingHorizontal: 16 }}
        itemDimension={Dimensions.get('window').width}
        sections={data}
        fixed={true}
        ListHeaderComponent={ListHeaderComponent}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderSectionHeader={sectionHeader}
        renderItem={renderItem}
      />
    </View>
  );
}

const listHeader = StyleSheet.create({
  limitBox: {
    width: 57,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#8854d2',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  limitText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  mainInfo: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 22,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginTop: 10,
  },
  filterBox: {
    marginTop: 26,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  filterText: {
    opacity: 0.28,
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#2c2c2c',
  },
  spacer: {
    marginTop: 10,
    height: 1,
    opacity: 0.27,
    backgroundColor: '#707070',
  },
});

const itemStyle = StyleSheet.create({
  container: {
    padding: 10,
    width: Dimensions.get('window').width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 13,
    fontWeight: 'normal',
    color: '#575757',
  },
  actionText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 13,
    fontWeight: 'normal',
    color: '#575757',
  },
  dateText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#bababa',
    marginTop: 4,
  },
  targetTextNormal: {
    opacity: 0.57,
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#575757',
    marginTop: 12,
  },
  targetTextPositive: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7c79e7',
    marginTop: 12,
  },
  targetTextEnd: {
    fontFamily: 'AppleSDGothicNeoSB00',
  },
  amountText: {
    fontFamily: 'AppleSDGothicNeoH00',
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#212121',
  },
  checkOrder: {
    opacity: 0.57,
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#575757',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  copyCode: {
    width: 69,
    height: 22,

    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#C4ACF2',
    alignItems: `center`,
    justifyContent: `center`,
  },
  copyCodeText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 9,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#8C54F4',
  },
  sectionHeader: {
    marginTop: 13,
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#2c2c2c',
  },
  sectionText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#2c2c2c',
  },
  crown: {
    width: 12.7,
    height: 8.43,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
