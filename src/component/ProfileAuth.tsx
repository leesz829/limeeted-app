import * as React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { SimpleGrid } from 'react-native-super-grid';
import { ICON } from 'utils/imageUtils';
const { width } = Dimensions.get('window');

export default function ProfileAuth({ data }) {
  return (
    <>
      <View style={styles.profileTitleContainer}>
        <Text style={styles.title}>프로필 인증</Text>
        <View style={styles.levelBadge}>
          <Text style={[styles.levelText, { color: 'white' }]}>LV.7</Text>
        </View>
      </View>
      <SimpleGrid
        style={{ marginTop: 10 }}
        staticDimension={width}
        itemContainerStyle={{
          width: '32%',
        }}
        spacing={width * 0.01}
        data={
          data?.second_auth_list?.length > 0 ? data?.second_auth_list : dummy
        }
        renderItem={renderAuthInfo}
      />
    </>
  );
}

const renderAuthInfo = ({ item }: { item: auth }) => (
  <View
    style={
      item?.auth_status === 'ACCEPT'
        ? styles.certificateItemContainerOn
        : styles.certificateItemContainerOff
    }
  >
    <View style={styles.rowCenter}>
      <Image
        source={convertTypeToImage(item)}
        style={styles.certificateItemImage}
      />
      <Text
        style={
          item?.auth_status === 'ACCEPT'
            ? styles.certificateItemTextOn
            : styles.certificateItemTextOff
        }
      >
        {item.code_name}
      </Text>
    </View>
    {item?.auth_status === 'ACCEPT' && (
      <Text style={styles.levelText}>
        LV.
        <Text style={{ fontSize: 15 }}>{item.auth_level}</Text>
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  profileTitleContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    // lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    // marginTop: 20,
  },
  levelBadge: {
    width: 51,
    height: 21,
    borderRadius: 5,
    backgroundColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginLeft: 8,
  },
  levelText: {
    // opacity: 0.83,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    // letterSpacing: 0,
    textAlign: 'left',
    color: 'white',
  },

  certificateItemContainerOn: {
    width: '100%',
    height: 39,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  certificateItemContainerOff: {
    width: '100%',
    height: 39,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#b7b7b9',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  certificateItemImage: {
    width: 15.6,
    height: 13.9,
  },
  certificateItemTextOn: {
    marginLeft: 5,
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
  },
  certificateItemTextOff: {
    marginLeft: 5,
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#b1b1b1',
  },
  rowCenter: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
});
const dummy = [
  {
    member_auth_seq: 26,
    auth_level: 1,
    auth_status: 'ACCEPT',
    code_name: '직업',
    member_seq: 9,
    common_code: 'JOB',
  },
  {
    member_auth_seq: 25,
    auth_level: 1,
    auth_status: 'ACCEPT',
    code_name: '학업',
    member_seq: 9,
    common_code: 'EDU',
  },
  { code_name: '소득', common_code: 'INCOME' },
  {
    member_auth_seq: 27,
    auth_level: 1,
    auth_status: 'ACCEPT',
    code_name: '자산',
    member_seq: 9,
    common_code: 'ASSET',
  },
  { code_name: 'SNS', common_code: 'SNS' },
  { code_name: '차량', common_code: 'VEHICLE' },
];

function convertTypeToImage(auth: auth) {
  switch (auth.common_code) {
    case 'JOB':
      if (auth.auth_status === 'ACCEPT') return ICON.job_on;
      else return ICON.job_off;

    case 'EDU':
      if (auth.auth_status === 'ACCEPT') return ICON.degree_on;
      else return ICON.degree_off;

    case 'INCOME':
      if (auth.auth_status === 'ACCEPT') return ICON.income_on;
      else return ICON.income_off;
    case 'ASSET':
      if (auth.auth_status === 'ACCEPT') return ICON.asset_on;
      else return ICON.asset_off;

    case 'SNS':
      if (auth.auth_status === 'ACCEPT') return ICON.sns_on;
      else return ICON.sns_off;

    case 'VEHICLE':
      if (auth.auth_status === 'ACCEPT') return ICON.vehicle_on;
      else return ICON.vehicle_off;
    default:
      break;
  }
}
