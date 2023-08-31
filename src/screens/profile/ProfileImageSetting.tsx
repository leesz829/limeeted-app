import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { get_member_profile_info, update_profile, update_additional, save_profile_auth_comment, update_member_master_image } from 'api/models';
import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import { usePopup } from 'Context';
import { commonStyle, layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import { useProfileImg } from 'hooks/useProfileImg';
import { useSecondAth } from 'hooks/useSecondAth';
import React, { useEffect, useMemo, useState, useRef  } from 'react';
import { CommonImagePicker } from 'component/CommonImagePicker';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PanResponder,
} from 'react-native';
import { findSourcePath, ICON } from 'utils/imageUtils';
import { useUserInfo } from 'hooks/useUserInfo';
import { useDispatch } from 'react-redux';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import { CommonLoading } from 'component/CommonLoading';
import SpaceView from 'component/SpaceView';
import { isEmptyData } from 'utils/functions';
import SortableGridview from 'react-native-sortable-gridview';







const { width, height } = Dimensions.get('window');
interface Props {
  navigation: StackNavigationProp<StackParamList, 'ProfileImageSetting'>;
  route: RouteProp<StackParamList, 'ProfileImageSetting'>;
}

export const ProfileImageSetting = (props: Props) => {
  const { show } = usePopup(); // 공통 팝업
  const isFocus = useIsFocused();
  const secondAuth = useSecondAth();
  const myImages = useProfileImg();
  const dispatch = useDispatch();
  const navigation = useNavigation<ScreenNavigationProp>();
  const scrollViewRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const [images, setImages] = useState([]);

  const memberBase = useUserInfo();           // 회원 기본정보

  // 프로필 데이터
  const [profileData, setProfileData] = React.useState({
    authList: [],
    faceRankList: [],
  });

  const [imgList, setImgList] = React.useState([]);

  // ############################################################  프로필 데이터 조회
  const getMemberProfileData = async () => {
    setIsLoading(true);

    try {
      const { success, data } = await get_member_profile_info();
      if (success) {
        const auth_list = data?.mbr_second_auth_list.filter(item => item.auth_status == 'ACCEPT');
        setProfileData({
          authList: auth_list,
          faceRankList: data.mbr_face_rank_list,
        });

        profileDataSet(data.mbr_img_list);

        dispatch(setPartialPrincipal({
          mbr_base : data.mbr_base
          , mbr_img_list : data.mbr_img_list
          , mbr_second_auth_list : data.mbr_second_auth_list
        }));
      } else {
        show({
          content: '오류입니다. 관리자에게 문의해주세요.',
          confirmCallback: function () {},
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ################################################################ 프로필 이미지 구성
  const profileDataSet = async (imgList:any) => {

    let imgListMake:any = [];
    
    // ##### 프로필 이미지 구성
    if (imgList != null && imgList.length > 0) {
      let imgData: any = {
        orgImgUrl01: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl02: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl03: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl04: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl05: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl06: { memer_img_seq: '', url: '', delYn: '' },
      };

      imgList.map((item, index) => {
        const imgData = {
          member_img_seq: item.member_img_seq,
          img_file_path: item.img_file_path,
          order_seq: index+1,
          url: findSourcePath(item.img_file_path),
          delYn: 'N',
          status: item.status,
          return_reason: item.return_reason,
        };

        imgListMake.push(imgData);
      });

      //console.log('imgListMake :::::::: ' , imgListMake);


      /* imgList.map(
        ({
          member_img_seq,
          img_file_path,
          order_seq,
          status,
          return_reason,
        } : {
          member_img_seq: any;
          img_file_path: any;
          order_seq: any;
          status: any;
          return_reason: any;
        }) => {
          let data = {
            member_img_seq: member_img_seq,
            url: findSourcePath(img_file_path),
            delYn: 'N',
            status: status,
            return_reason: return_reason,
          };

          imgListMake.push(data);
        }
      ); */

      //setImgData({ ...imgData, imgData });
      //setImgList({...imgList, imgListMake});

      setImgList(imgListMake);
    }
  };

  const panResponders = imgList.map((item, index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newImgList = [...imgList];
        const dragIndex = imgList.indexOf(index);


        //console.log('dragIndex ::::: ' , dragIndex);

        /* const newIndex = Math.floor(
          (dragIndex * gestureState.moveX) / ((width - 46) / 3 + 10)
        );

        newImgList.splice(dragIndex, 1);
        newImgList.splice(newIndex, 0, index);

        console.log('newOrder :::::::: ' , newImgList);

        setImgList(newImgList); */
      },
    })
  );

  const onRelease = (newData, activeItem) => {
    // Check if activeItem is null to determine if it's a click without drag
    if (!activeItem) {
      // 클릭만 하고 드래그를 하지 않았을 때의 처리
      console.log('Clicked:', newData);
    } else {
      // 드래그가 끝났을 때의 처리
      //setData(newData);
      console.log('Drag and drop completed:', newData);
    }
  };



  // ############################################################################# 초기 실행 실행
  useEffect(() => {
    if(isFocus) {
      getMemberProfileData();
    };
  }, [isFocus]);

  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader
        title="프로필 사진 순서 관리"
        /* right={
          <TouchableOpacity onPress={() => { saveMemberProfile(); }}>
            <Text style={_styles.saveText}>저장</Text>
          </TouchableOpacity>
        } */
      />

      <View style={{ backgroundColor: 'white' }}>

        {/* ####################################################################################
					####################### 프로필 이미지 영역
					#################################################################################### */}
        <View style={_styles.wrapper}>
          {/* {imgList.map((item, index) => {
            return (
              <>
                <Animated.View 
                  style={[_styles.imageContainer, { zIndex: imgList.length - index }]}
                  {...panResponders[index].panHandlers}>
                  <ProfileImageItem index={index} imgData={item} delFn={null} fileCallBackFn={null}  />
                </Animated.View>
              </>
            )
          })} */}

          <SortableGridview
            style={{width: width}}
            data={imgList}
            onDragStart={() => {
              console.log('Default onDragStart');
            }}
            onDragRelease={(data) => {
              console.log('Default onDragRelease');
              setImgList(data);
            }}
            //itemWidth={(width - 46) / 3}
            //marginBetweenItems={2}
            gapWidth={0} // let the gap between items become to 8\. Default is 16
            numPerRow={3}
            sensitivity={5} // default 150(miliseconds)
            useNativeDriver={false}
            dragActivationThreshold={5} // 클릭 시 드래그가 빠르게 시작되는 픽셀 거리 설정
            selectAnimation='scale'
            selectStyle={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            
            renderItem={(item, index) => (
              <View
                uniqueKey={item.order_seq} // Important! Should add this props!!!
                /* onTap={() => {
                  console.log('On Tap ${item.name}!')
                }} */>
                <ProfileImageItem index={index} imgData={item} delFn={null} fileCallBackFn={null}  />
              </View>
            )}
          />

        </View>

        <View style={{ height: 10 }} />
      </View>
    </>
  );
};



{/* #######################################################################################################
###################### 프로필 이미지 렌더링
####################################################################################################### */}

function ProfileImageItem({ index, imgData, delFn, fileCallBackFn }) {
  const imgUrl = imgData.url;
  const imgDelYn = imgData.delYn;
  const imgStatus = imgData.status;

  return (
    <View style={_styles.container}>
      {isEmptyData(imgUrl) && imgDelYn == 'N' ? (
        <TouchableOpacity disabled>
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={_styles.imageStyle}
            key={imgUrl}
            source={imgUrl}
          />
          {(imgStatus == 'PROGRESS' || imgStatus == 'REFUSE') ? (
            <View style={_styles.imageDisabled(false)}>
              <Text style={[_styles.profileImageDimText(imgStatus)]}>{imgStatus == 'PROGRESS' ? '심사중' : '반려'}</Text>
            </View>
          ) : (imgStatus == 'ACCEPT' && index == 0) && (
            <View style={_styles.imageDisabled(true)}>
              <Text style={[_styles.masterImageDimText]}>대표 사진</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <CommonImagePicker isAuth={false} callbackFn={fileCallBackFn} uriParam={''} />
      )}
    </View>
  );
};



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  saveText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
  },
  wrapper: {
    width: width,
    height: height,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  container: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    backgroundColor: 'rgba(155, 165, 242, 0.12)',
    //backgroundColor: '#000',
    //marginHorizontal: 4,
    marginVertical: 5,
    borderRadius: 20,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  imageStyle: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    margin: 0,
    borderRadius: 20,
  },
  imageDisabled: (isMaster: boolean) => {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      backgroundColor: !isMaster ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
    };
  },
  masterImageDimText: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    paddingVertical: 3,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 13,
    color: '#fff',
  },
  profileImageDimText: (status: string) => {
    return {
      width: '100%',
      backgroundColor: '#000',
      textAlign: 'center',
      paddingVertical: 3,
      fontFamily: 'AppleSDGothicNeoEB00',
      fontSize: 12,
      color: status == 'REFUSE' ? ColorType.redF20456 : '#fff',
    };
  },




  imageContainer: {
    //marginRight: 10,
  },
});
