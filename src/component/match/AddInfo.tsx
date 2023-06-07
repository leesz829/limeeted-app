import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';


const { width, height } = Dimensions.get('window');

export default function AddInfo({ memberData }) {
  const navigation = useNavigation<ScreenNavigationProp>();

  return (
    <>
      {((memberData.height != null && memberData.height != '') || (memberData.form_body_type != null && memberData.form_body_type != '') ||
      (memberData.job_name != null && memberData.job_name != '') || (memberData.religion_type != null && memberData.religion_type != '') ||
      (memberData.drink_type != null && memberData.drink_type != '') || (memberData.smoke_type != null && memberData.smoke_type != '')) &&
        
        <SpaceView>
          <Text style={_styles.title}>추가 정보</Text>
          <SpaceView mt={20} viewStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {memberData.height != null && memberData.height != '' &&
              <View style={_styles.addItemArea}>
                <Image source={ICON.addHeightIcon} style={{width:11, height:16, marginRight: 10}} />
                <Text style={_styles.addItemAreaText}><Text style={_styles.addItemAreaTextBold}>{memberData.height}</Text>cm</Text>
              </View>
            }

            {memberData.form_body_type != null && memberData.form_body_type != '' &&
              <View style={_styles.addItemArea}>
                <Image source={ICON.addCategoryIcon} style={{width:16, height:16, marginRight: 10}} />
                <Text style={_styles.addItemAreaText}>{memberData.form_body_type}</Text>
              </View>
            }

            {memberData.job_name != null && memberData.job_name != '' &&
              <View style={_styles.addItemArea}>
                <Image source={ICON.addFlagIcon} style={{width:11, height:16, marginRight: 10}} />
                <Text style={_styles.addItemAreaText}>{memberData.job_name}</Text>
              </View>
            }

            {memberData.religion_type != null && memberData.religion_type != '' &&
              <View style={_styles.addItemArea}>
                <Image source={ICON.addPlayIcon} style={{width:17, height:20, marginRight: 10}} />
                <Text style={_styles.addItemAreaText}>{memberData.religion_type}</Text>
              </View>
            }

            {memberData.drink_type != null && memberData.drink_type != '' &&
              <View style={_styles.addItemArea}>
                <Image source={ICON.addWineIcon} style={{width:13, height:20, marginRight: 10}} />
                <Text style={_styles.addItemAreaText}>{memberData.drink_type}</Text>
              </View>
            }

            {memberData.smoke_type != null && memberData.smoke_type != '' &&
              <View style={_styles.addItemArea}>
                <Image source={ICON.addSmokeIcon} style={{width:20, height:13, marginRight: 10}} />
                <Text style={_styles.addItemAreaText}>{memberData.smoke_type}</Text>
              </View>
            }
          </SpaceView>
        </SpaceView> 
      }
    </>
  );

}




{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  title: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginTop: 20,
  },
  addItemArea: {
    borderWidth: 1,
    borderColor: '#A6A9C5',
    borderRadius: 20,
    width: width / 3.5,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    marginBottom: 8,
  },
  addItemAreaText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 12,
    color: '#7986EE',
    width: '60%',
    textAlign: 'center',
  },
  addItemAreaTextBold: {
    fontSize: 14,
  },
});