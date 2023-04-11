import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ICON } from 'utils/imageUtils';

const DATA = [
  {
    condition: 'LIVE 투표 횟수',
    amount: '작음',
  },
  {
    condition: ' 관심 보내기',
    amount: '조금 작음',
  },
  {
    condition: '받은 관심 수락',
    amount: '보통',
  },
  /* {
    condition: '뽑기권 아이템 사용',
    amount: '작음',
  }, */
  {
    condition: '일일 출석',
    amount: '보통',
  },


  {
    condition: '찐심 수락',
    amount: '보통',
  },
  /* {
    condition: '찐심 LV1 수락',
    amount: '보통',
  },
  {
    condition: '찐심 LV2 수락',
    amount: '높음',
  },
  {
    condition: '찐심 LV3 수락',
    amount: '높음',
  },
  {
    condition: '찐심 LV4 수락',
    amount: '매우높음',
  },
  {
    condition: '찐심 LV5 수락',
    amount: '매우높음',
  }, */
  {
    condition: '찐심 보내기',
    amount: '높음',
  },
  {
    condition: '프로필 재평가 참여',
    amount: '높음',
  },
];

export default function LimitInfo() {
  const [data, setData] = useState(DATA);

  const ListHeaderComponent = () => (
    <>
      <ImageBackground
        source={require('../../../assets/dummy/bgImg.png')}
        style={{ paddingHorizontal: 16 }}
      >
        <View style={listHeader.limitBox}>
          <Text style={listHeader.limitText}>LIMIT</Text>
        </View>
        <Text style={listHeader.mainInfo}>
          월1회, 여성회원분들에게만{'\n'}열리는 리밋
        </Text>
        <Text style={listHeader.subInfo}>
          보유하고 있는 리밋으로{'\n'}공주들만의 특권을 누리세요!
        </Text>
      </ImageBackground>

      <View style={listHeader.tableHeader}>
        <View style={{ width: (Dimensions.get('window').width - 88) * 0.7 }}>
          <Text style={listHeader.tableHeaderText}> 획득조건</Text>
        </View>
        <View style={{ width: (Dimensions.get('window').width - 88) * 0.3 }}>
          <Text style={listHeader.tableHeaderText}> 획득량</Text>
        </View>
      </View>
    </>
  );

  const renderItem = ({ item, index }) => (
    <View style={itemStyle.itemContainer}>
      <View style={itemStyle.left}>
        <Text style={listHeader.tableHeaderText}>{item.condition}</Text>
      </View>
      <View style={itemStyle.right}>
        <Text style={listHeader.tableHeaderText}>{item.amount}</Text>
        <Image source={ICON.crown} style={itemStyle.crown} />
      </View>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <CommonHeader title="리밋정보" />
      <FlatList
        data={data}
        style={{ flexGrow: 1 }}
        ListHeaderComponent={ListHeaderComponent}
        keyExtractor={(item, index) => index.toString()}
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
    marginTop: 20,
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
  subInfo: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#9d9d9d',
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomColor: Color.grayDDDD,
    borderBottomWidth: 1,
    borderTopWidth: 3,
    borderTopColor: Color.grayDDDD,
    marginHorizontal: 30,
    marginTop: 30,
  },
  tableHeaderText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#2c2c2c',
  },
});

const itemStyle = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    marginHorizontal: 30,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Color.grayEEEE,
  },
  left: {
    width: (Dimensions.get('window').width - 88) * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    width: (Dimensions.get('window').width - 88) * 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  crown: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});
