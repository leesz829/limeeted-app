import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
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
      <View style={_styles.profileTitleContainer}>
        <SpaceView viewStyle={{flexDirection: `row`, alignItems: `center`, justifyContent: `center`,}}>
          <Text style={_styles.title}>프로필 인증</Text>
          <View style={[_styles.levelBadge, {marginRight: 0, marginTop: 1}]}>

            {/* ############# 인증 레벨 노출 */}
            {level > 0 && level < 10 &&
              <LinearGradient colors={['#7986EE', '#7986EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.levelBadge}>
                <Text style={_styles.whiteText}>LV.{level}</Text>
              </LinearGradient>
            }

            {level >= 10 && level < 15 &&
              <LinearGradient colors={['#E0A9A9', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.levelBadge}>
                <Image source={ICON.level10Icon} style={[_styles.levelBadgeImg, {width: 23, height: 23}]} />
                <Text style={_styles.whiteText}>LV.{level}</Text>
              </LinearGradient>
            }

            {level >= 15 && level < 20 &&
              <LinearGradient colors={['#A9BBE0', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.levelBadge}>
                <Image source={ICON.level15Icon} style={[_styles.levelBadgeImg, {width: 23, height: 23}]} />
                <Text style={_styles.whiteText}>LV.{level}</Text>
              </LinearGradient>
            }

            {level >= 20 && level < 25 &&
              <LinearGradient colors={['#FEB961', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.levelBadge}>
                <Image source={ICON.level20Icon} style={[_styles.levelBadgeImg02, {width: 30, height: 30}]} />
                <Text style={_styles.whiteText}>LV.{level}</Text>
              </LinearGradient>
            }

            {level >= 25 && level < 30 &&
              <LinearGradient colors={['#9BFFB5', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.levelBadge}>
                <Image source={ICON.level25Icon} style={[_styles.levelBadgeImg02, {width: 30, height: 30}]} />
                <Text style={_styles.whiteText}>LV.{level}</Text>
              </LinearGradient>
            }

            {level >= 30 &&
              <LinearGradient colors={['#E84CEE', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.levelBadge}>
                <Image source={ICON.level30Icon} style={[_styles.levelBadgeImg02, {width: 30, height: 30}]} />
                <Text style={_styles.whiteText}>LV.{level}</Text>
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

      {/* <ScrollView horizontal style={_styles.authWrapper}>
        {data?.map((item, index) => (
          <RenderAuthInfoNew
            key={`RednerAuth-${index}`}
            item={item}
          />
        ))}
      </ScrollView> */}

    </>
  );
}

const renderAuthInfo = ({ item }: { item: auth }) => (

  <View
    style={
      item?.auth_status === 'ACCEPT'
        ? _styles.certificateItemContainerOn
        : _styles.certificateItemContainerOff
    }>

    <View style={_styles.rowCenter}>
      <Image
        source={convertTypeToImage(item)}
        style={_styles.certificateItemImage}
      />
      <Text
        style={
          item?.auth_status === 'ACCEPT'
            ? _styles.certificateItemTextOn
            : _styles.certificateItemTextOff
        }
      >
        {item.code_name}
      </Text>
    </View>

    {item?.auth_status === 'ACCEPT' && (
      <Text style={_styles.levelText}>
        LV.
        <Text style={{ fontSize: 15, color: '#000000' }}>{item.auth_level}</Text>
      </Text>
    )}
  </View>
);

function RenderAuthInfoNew({ item }) {

  const code = item?.common_code;
  let imgSrc = ICON.jobNew;
  let textDesc = '"비교불가의 전문성을 갖춘 리더이자 역경을 이겨낸 승리자"';

  if(code == 'JOB') {
    imgSrc = ICON.jobNew;
  } else if(code == 'EDU') {
    imgSrc = ICON.degreeNew;
  } else if(code == 'INCOME') {
    imgSrc = ICON.incomeNew;
  } else if(code == 'ASSET') {
    imgSrc = ICON.assetNew;
  } else if(code == 'SNS') { 
    imgSrc = ICON.snsNew;
  } else if(code == 'VEHICLE') {
    imgSrc = ICON.vehicleNew;
  }

  return (
      <LinearGradient
        colors={['#FFFFFF', '#E8FFFE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={_styles.authArea}>

        <SpaceView>
          <Image source={imgSrc} style={_styles.authIcon} resizeMode={'contain'} />
        </SpaceView>

        <SpaceView mt={8}>
          <Text style={_styles.authTit}>직업 LV 7</Text>
        </SpaceView>

        <SpaceView mt={20}>
          <Text style={_styles.authText}>{textDesc}</Text>
        </SpaceView>

        <SpaceView mt={20} viewStyle={_styles.authIntroArea}>
          <Text style={_styles.authIntroText}>앱스쿼드라는 이름의 전도유망한 IT회사를 운영하고 있습니다.</Text>
        </SpaceView>

      </LinearGradient>
  );
};



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
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
  authWrapper: {
    width: '100%',
    marginTop: 13,
  },
  authArea: {
    width: width - 65,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 15,
    marginRight: 7,
    marginLeft: 4,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 5.0,
    elevation: 5,
  },
  authIcon: {
    width: 95,
    height: 64,
  },
  authTit: {
    fontFamily: 'AppleSDGothicNeoH00',
    fontSize: 10,
    backgroundColor: '#7986EE',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  authText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 11,
    color: '#5A5A5A',
  },
  authIntroArea: {
    width: width - 80,
    backgroundColor: '#fff',
    borderRadius: 17,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  authIntroText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 11,
    color: '#7986EE',
    textAlign: 'center',
    paddingHorizontal: 40,
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
