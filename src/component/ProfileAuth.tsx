import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SimpleGrid } from 'react-native-super-grid';
import { ICON } from 'utils/imageUtils';
import { CommonBtn } from './CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from './SpaceView';
import { STACK } from 'constants/routes';
import LinearGradient from 'react-native-linear-gradient';


const { width } = Dimensions.get('window');

export default function ProfileAuth({ level, data, isButton }) {
  const navigation = useNavigation<ScreenNavigationProp>();

  return (
    <>
      <View style={styles.profileTitleContainer}>
        <SpaceView viewStyle={{flexDirection: `row`, alignItems: `center`, justifyContent: `center`,}}>
          <Text style={styles.title}>프로필 인증</Text>
          <View style={[styles.levelBadge, {marginRight: 0, marginTop: 1}]}>

            {/* ############# 인증 레벨 노출 */}
            {level > 0 && level < 10 &&
              <LinearGradient colors={['#7986EE', '#7986EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.levelBadge}>
                <Text style={styles.whiteText}>LV.{level}</Text>
              </LinearGradient>
            }

            {level >= 10 && level < 15 &&
              <LinearGradient colors={['#E0A9A9', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.levelBadge}>
                <Image source={ICON.level10Icon} style={[styles.levelBadgeImg, {width: 23, height: 23}]} />
                <Text style={styles.whiteText}>LV.{level}</Text>
              </LinearGradient>
            }

            {level >= 15 && level < 20 &&
              <LinearGradient colors={['#A9BBE0', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.levelBadge}>
                <Image source={ICON.level15Icon} style={[styles.levelBadgeImg, {width: 23, height: 23}]} />
                <Text style={styles.whiteText}>LV.{level}</Text>
              </LinearGradient>
            }

            {level >= 20 && level < 25 &&
              <LinearGradient colors={['#FEB961', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.levelBadge}>
                <Image source={ICON.level20Icon} style={[styles.levelBadgeImg02, {width: 30, height: 30}]} />
                <Text style={styles.whiteText}>LV.{level}</Text>
              </LinearGradient>
            }

            {level >= 25 && level < 30 &&
              <LinearGradient colors={['#9BFFB5', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.levelBadge}>
                <Image source={ICON.level25Icon} style={[styles.levelBadgeImg02, {width: 30, height: 30}]} />
                <Text style={styles.whiteText}>LV.{level}</Text>
              </LinearGradient>
            }

            {level >= 30 &&
              <LinearGradient colors={['#E84CEE', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.levelBadge}>
                <Image source={ICON.level30Icon} style={[styles.levelBadgeImg02, {width: 30, height: 30}]} />
                <Text style={styles.whiteText}>LV.{level}</Text>
              </LinearGradient>
            }

            {/* <Text style={[styles.levelText, { color: 'white' }]}>LV.{level}</Text> */}
          </View>
        </SpaceView>
        
        {typeof isButton != 'undefined' && isButton && 
          <SpaceView viewStyle={{flexDirection: `row`, alignItems: `center`, justifyContent: `center`,}}>
            <TouchableOpacity 
              onPress={() => { 
                navigation.navigate(STACK.COMMON, {
                  screen: 'SecondAuth',
                });
              }} 
              style={{marginTop: 1, borderWidth:1, borderColor: '#C7C7C7', borderRadius: 7, paddingHorizontal: 5}}>
              <CommonText 
                type={'h6'} 
                color={'#C7C7C7'}
                fontWeight={'200'}>
                프로필 인증 변경
              </CommonText>
            </TouchableOpacity>
          </SpaceView>
        }
      </View>
      <SimpleGrid
        style={{ marginTop: 10}}
        // staticDimension={width}
        staticDimension={width + 20}
        itemContainerStyle={{
          width: '32%',
        }}
        spacing={width * 0.01}
        data={
          data?.length > 0 ? data : dummy
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
    }>

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
        <Text style={{ fontSize: 15, color: '#000000' }}>{item.auth_level}</Text>
      </Text>
    )}
  </View>
);



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const styles = StyleSheet.create({
  profileTitleContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    //backgroundColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginLeft: 8,
  },
  levelBadgeImg: {
    marginLeft: -5,
    marginRight: -2,
    marginTop: 1
  },
  levelBadgeImg02: {
    marginLeft: -9,
    marginRight: -4,
    marginTop: -3
  },
  levelText: {
    // opacity: 0.83,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    // letterSpacing: 0,
    textAlign: 'left',
    color: '#000000',
  },
  whiteText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
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
      if (auth.auth_status === 'ACCEPT') return ICON.jobNew;
      else return ICON.jobNew;

    case 'EDU':
      if (auth.auth_status === 'ACCEPT') return ICON.degreeNew;
      else return ICON.degreeNew;

    case 'INCOME':
      if (auth.auth_status === 'ACCEPT') return ICON.incomeNew;
      else return ICON.incomeNew;
      
    case 'ASSET':
      if (auth.auth_status === 'ACCEPT') return ICON.assetNew;
      else return ICON.assetNew;

    case 'SNS':
      if (auth.auth_status === 'ACCEPT') return ICON.snsNew;
      else return ICON.snsNew;

    case 'VEHICLE':
      if (auth.auth_status === 'ACCEPT') return ICON.vehicleNew;
      else return ICON.vehicleNew;
    default:
      break;
  }
}
