import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SectionGrid } from 'react-native-super-grid';

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
      <View
        style={{
          width: 57,
          height: 22,
          borderRadius: 11,
          backgroundColor: '#8854d2',
          flexDirection: `row`,
          alignItems: `center`,
          justifyContent: `center`,
        }}
      >
        <Text
          style={{
            fontFamily: 'AppleSDGothicNeoB00',
            fontSize: 13,
            fontWeight: 'normal',
            fontStyle: 'normal',
            letterSpacing: 0,
            textAlign: 'left',
            color: '#ffffff',
          }}
        >
          LIMIT
        </Text>
      </View>
      <Text
        style={{
          fontFamily: 'AppleSDGothicNeoB00',
          fontSize: 22,
          fontWeight: 'normal',
          fontStyle: 'normal',
          letterSpacing: 0,
          textAlign: 'left',
          color: '#333333',
          marginTop: 10,
        }}
      >
        방배동 아이유님의{'\n'}리밋이력
      </Text>
      <View
        style={{
          marginTop: 26,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <Text
          style={{
            opacity: 0.28,
            fontFamily: 'AppleSDGothicNeoB00',
            fontSize: 13,
            fontWeight: 'normal',
            fontStyle: 'normal',
            letterSpacing: 0,
            textAlign: 'left',
            color: '#2c2c2c',
          }}
        >
          최신순 23.01.04 ~ 23.02.03
        </Text>
      </View>
      <View
        style={{
          marginTop: 10,
          height: 1,
          opacity: 0.27,
          backgroundColor: '#707070',
        }}
      />
    </View>
  );
  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          padding: 10,

          width: Dimensions.get('window').width - 32,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={{ width: 19, height: 19, backgroundColor: Color.primary }}
          />
          <View style={{ marginLeft: 6 }}>
            <Text
              style={{
                fontFamily: 'AppleSDGothicNeoB00',
                fontSize: 13,
                fontWeight: 'normal',
              }}
            >
              제품/모델명에 입찰
              <Text
                style={{
                  fontFamily: 'AppleSDGothicNeoR00',
                  fontSize: 13,
                  fontWeight: 'normal',
                  color: '#575757',
                }}
              >
                하였습니다
              </Text>
            </Text>
            <Text
              style={{
                fontFamily: 'AppleSDGothicNeoR00',
                fontSize: 11,
                fontWeight: 'normal',
                fontStyle: 'normal',
                letterSpacing: 0,
                textAlign: 'left',
                color: '#bababa',
                marginTop: 4,
              }}
            >
              23.01.24 15:10 | 차감
            </Text>
            <Text
              style={{
                opacity: 0.57,
                fontFamily: 'AppleSDGothicNeoB00',
                fontSize: 11,
                fontWeight: 'normal',
                fontStyle: 'normal',
                letterSpacing: 0,
                textAlign: 'left',
                color: '#575757',
                marginTop: 12,
              }}
            >
              리밋수량이 차감되었습니다
            </Text>
          </View>
        </View>
        <View>
          <Text>-10,000</Text>
        </View>
      </View>
    );
  };

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
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, opacity: 0.1, backgroundColor: '#707070' }}
          />
        )}
        renderSectionHeader={({ section }) => (
          <View
            style={{
              marginTop: 13,
              fontFamily: 'AppleSDGothicNeoB00',
              fontSize: 15,
              fontWeight: 'normal',
              fontStyle: 'normal',
              letterSpacing: 0,
              textAlign: 'left',
              color: '#2c2c2c',
            }}
          >
            <Text>{section.title}</Text>
          </View>
        )}
        renderItem={renderItem}
      />
    </View>
  );
}
