import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';
import LinearGradient from 'react-native-linear-gradient';
import { STACK, ROUTES } from 'constants/routes';
import { modalStyle, layoutStyle, commonStyle, styles } from 'assets/styles/Styles';
import { isEmptyData } from 'utils/functions';
import AuthLevel from 'component/common/AuthLevel';
import ProfileGrade from 'component/common/ProfileGrade';
import { useUserInfo } from 'hooks/useUserInfo';


const { width, height } = Dimensions.get('window');

export default function InterestRender({ memberData, isEditBtn, interestList }) {
  const navigation = useNavigation<ScreenNavigationProp>();

  const memberBase = useUserInfo();

  return (
    <>
      {(interestList.length > 0) ? (

        <SpaceView>
          <LinearGradient
            colors={['#F1B10E', '#EEC80C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={_styles.introWrap}
          >
            <SpaceView mb={20}>
              <SpaceView mb={5}>
                <SpaceView mb={8} viewStyle={_styles.titArea}>
                  <Text style={_styles.titText}>{memberData?.nickname}님의 관심사</Text>
                </SpaceView>
                <SpaceView>
                  <Text style={_styles.titDescText}>공통 관심사가 있다면 관심을 보내보면 어때요?</Text>
                </SpaceView>
              </SpaceView>
            </SpaceView>

            {(isEmptyData(isEditBtn) && isEditBtn) && (
              <TouchableOpacity 
                onPress={() => { navigation.navigate(STACK.COMMON, { screen: ROUTES.PROFILE_INTEREST }); }} 
                style={_styles.modBtn}>
                <Image source={ICON.squarePen} style={styles.iconSize16} />
                <Text style={_styles.modBtnText}>수정</Text>
              </TouchableOpacity>
            )}

            <SpaceView>
              {interestList.length > 0 &&
                <SpaceView viewStyle={_styles.interestWrap}>
                  <SpaceView mt={8} viewStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {interestList.map((item, index) => {
                      const isOn = item.dup_chk == 0 ? false : true;
                      return (
                        <View key={index} style={_styles.interestItem(isOn)}>
                          <Text style={_styles.interestText(isOn)}>{item.code_name}</Text>
                        </View>
                      );
                    })}
                  </SpaceView>
                </SpaceView>
              }
            </SpaceView>
            
          </LinearGradient>          
        </SpaceView>
      ) : (
        <>

        </>
      )}
    </>
  );

}


{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  introWrap: {
    minHeight: 150,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  titArea: {
    flexDirection: 'row',
  },
  titText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#4A4846',
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#FFF8CC',
    borderRadius: 20,
  },
  titDescText : {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#FFF8CC',
  },
  interestWrap: {
    
  },
  interestItem: (isOn) => {
    return {
      borderRadius: 20,
      backgroundColor: 'rgba(135,135,135,0.5)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginRight: 5,
      marginBottom: 3,
      overflow: 'hidden',
    };
  },
  interestText: (isOn) => {
    return {
      fontFamily: 'Pretendard-Regular',
      fontSize: 14,
      color: isOn ? '#08D2F2' : '#EEEAEB',
    };
  },
  modBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  modBtnText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#D5CD9E',
    marginLeft: 3,
  },
});