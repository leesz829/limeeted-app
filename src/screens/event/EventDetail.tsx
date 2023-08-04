import { RouteProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList, ColorType, ScreenNavigationProp } from '@types';
import { get_popup_event_list } from 'api/models';
import { ROUTES, STACK } from 'constants/routes';
import CommonHeader from 'component/CommonHeader';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import { usePopup } from 'Context';
import { useUserInfo } from 'hooks/useUserInfo';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useDispatch } from 'react-redux'; 
import { IMAGE, PROFILE_IMAGE, findSourcePath } from 'utils/imageUtils';
import { event_receive } from 'api/models';
import { isEmptyData } from 'utils/functions';
import AutoHeightImage from 'react-native-auto-height-image';
import * as properties from 'utils/properties';



const { width, height } = Dimensions.get('window');
export default function EventDetail(element) {
  const { show } = usePopup(); // 공통 팝업
  const [isLoading, setIsLoading] = useState(false);
  const isFocus = useIsFocused();

  console.log('element.route.params :::::: ' , element.route.params);

  const view_type = element.route.params.view_type;
  
  const [subImgPath, setSubImgPath] = useState(element.route.params.sub_img_path);

  const [eventList, setEventList] = useState([]);
  
  const [index, setIndex] = useState(element.route.params.index);
  const [imgPosition, setImgPosition] = useState({ x:0, y:0 });
  const ref = useRef();
  
  const imgLayout = (event) => {
    const { x, y } = event.nativeEvent.layout;
    setImgPosition({x,y});
    ref.current.scrollTo({y:y, animated:true});
  };

  // 팝업 이벤트 목록 조회
  const getPopupEventList = async () => {
    const body = {
      view_type: view_type,
    };

    //console.log('body ::::: ' , body);

    try {
      const { success, data } = await get_popup_event_list(body);
      if(success) {
        //console.log('data :::::: ' , data);

        setEventList(data.event_list);
      }
    } catch {

    } finally {

    }
  };

  // 보상 처리
  const rewardProc = async (event_seq:number) => {
    const body = {
      event_seq: event_seq,
      reward_dup_yn: 'Y',
    };

    try {
      const { success, data } = await event_receive(body);
      console.log('data ::::: ' , data);
    
      if(success) {
        if(data.result_code == '0000') {
          getPopupEventList();
          show({ content: '이벤트 보상을 받았습니다.' });
        } else if(data.result_code == '4001') {
          show({ content: '이미 받은 이벤트 보상입니다.' });
        }
      }
    } catch {
      show({ content: '일시적인 오류가 발생했습니다.' });
    } finally {

    }
  };

  
  React.useEffect(() => {
    getPopupEventList();
  }, [isFocus]);

  return (
    <>
      <CommonHeader title="이벤트 상세"/>

      <ScrollView ref={ref}>

        {eventList.length > 0 &&
          <>
            {eventList.map((item, idx) => (
              <>
                <View key={'detail_' + idx} onLayout={index === idx ? imgLayout : null}>
                  <AutoHeightImage 
                    source={{ uri : properties.img_domain + item.sub_img_path}}
                    width={Dimensions.get('window').width} // 화면의 width로 이미지의 너비를 설정
                    resizeMode="contain"
                  />

                  {item.pop_bas_seq == 90014 &&
                    <View style={{position: 'absolute', bottom: '6%', width: '100%', alignItems: 'center'}}>

                      {item.mileage_rewarded_yn == 'Y' ? (
                        <Text style={_styles.eventBaseBtn('#FCAB35')}>이미 받은 보상</Text>
                      ) : (
                        <TouchableOpacity onPress={() => { rewardProc(item.event_seq); }}>
                          <Text style={_styles.eventBaseBtn('#FCAB35')}>100리밋 받기</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  }

                  {item.pop_bas_seq == 90016 &&
                    <View style={{position: 'absolute', bottom: '3%', width: '100%', alignItems: 'center'}}>

                      {item.mileage_rewarded_yn == 'Y' ? (
                        <Text style={_styles.eventBaseBtn('#992EC1')}>이미 받은 보상</Text>
                      ) : (
                        <TouchableOpacity onPress={() => { rewardProc(item.event_seq); }}>
                          <Text style={_styles.eventBaseBtn('#992EC1')}>리밋 받기</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  }
                </View>
              </>
            ))}
          </>
        }

        {/* <View onLayout={index === 0 ? imgLayout : null}><Image source={findSourcePath(subImgPath)} style={{width: width, height: height}} resizeMode={'cover'} /></View>
        <View onLayout={index === 1 ? imgLayout : null}><Image source={findSourcePath(subImgPath)} style={{width: width, height: height-340}} resizeMode={'cover'} /></View>
        <View onLayout={index === 2 ? imgLayout : null}><Image source={findSourcePath(subImgPath)} style={{width: width, height: height-460}} resizeMode={'cover'} /></View> 
        <View onLayout={index === 3 ? imgLayout : null}><Image source={findSourcePath(subImgPath)} style={{width: width, height: height+280}} resizeMode={'cover'} /></View>  */}
      </ScrollView>

      {/* <SpaceView>
        <TouchableOpacity onPress={() => { rewardProc(); }}>
          <Text style={_styles.exBtn}>보상 지급</Text>
        </TouchableOpacity>
      </SpaceView> */}
    </>
  );
}



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  exBtn: {
    textAlign: 'center',
    fontSize: 15,
    paddingVertical: 10,
    backgroundColor: '#697AE6',
    color: '#fff',
  },
  eventBaseBtn: (bgColor:string) => {
    let widthSize = 160;
    let fSize = 18;
    let vertical = 12;

    return {
      fontFamily: 'AppleSDGothicNeoB00',
      fontSize: fSize,
      backgroundColor: bgColor,
      color: '#fff',
      width: widthSize,
      textAlign: 'center',
      paddingVertical: vertical,
      borderRadius: 28,
      overflow: 'hidden',
    };
  },
});
