import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { ColorType, ScreenNavigationProp } from '@types';
import { Color } from 'assets/styles/Color';
import { StackNavigationProp } from '@react-navigation/stack';
import { commonStyle, layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useMemo, useState, useEffect } from 'react';
import { StackParamList } from '@types';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';
import { ICON } from 'utils/imageUtils';
import { useInterView } from 'hooks/useInterView';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { get_member_interview, update_interview } from 'api/models';
import { usePopup } from 'Context';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import { useDispatch } from 'react-redux';
import { STACK } from 'constants/routes';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';


/* ################################################################################################################
###################################################################################################################
###### 인터뷰 화면
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Profile2'>;
  route: RouteProp<StackParamList, 'Profile2'>;
}

enum Mode {
  view = 'view',
  edit = 'edit',
}

const { width, height } = Dimensions.get('window');



export const Profile2 = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const tgtCode = props.route.params.tgtCode;

  const [text, setText] = useState('');
  const navi = useNavigation();
  const origin = useInterView();
  const [interview, setInterview] = useState(origin);
  const [target, setTarget] = useState(function() {
    let data = {}
    interview?.filter((item: any) => item?.common_code == props.route.params.tgtCode ? data = item : null);
    return data;
  });
  const [mode, setMode] = useState(Mode.view);

  const { show } = usePopup();  // 공통 팝업
  const isFocus = useIsFocused();

  const dispatch = useDispatch();

  // ############################################# 질문 초기화 핸들러 UI Function
  function onPressResetTarget() {
    setTarget(null);
  }

  // ############################################# 편집버튼 핸들러 UI Function
  function onPressModify() {
    setMode(mode === Mode.view ? Mode.edit : Mode.view);
  }

  // ############################################# 노출 여부 Toggle UI Function
  function toggleFunction(value, id) {
    updateDispYn(value, id);
  }

  // ############################################# 노출 여부 Toggle UI Function
  function onPressTarget(_item) {
    let isChk = false;
    interview.map((item: any) => {
      if(item.use_yn == 'Y' && _item.common_code == item.common_code) {
        isChk = true;
      }
    })

    /* if(isChk) {
      show({content: '이미 등록된 질문이에요.'});
    } else {
      setTarget(_item);
    } */

    setTarget(_item);
  }

  // ############################################# 순서 Drag UI Function
  function onDragEnd({
    from,
    to,
    data,
  }: {
    from: number;
    to: number;
    data: any;
  }) {
    setInterview(data);
  }

  const list = useMemo(() => {
    if (text === '') return interview;
    return interview?.filter((item: any) => item?.code_name?.includes(text));
  }, [text, interview]);
  
  // ############################################# 인터뷰 노출 여부 변경
  const updateDispYn = async (value: boolean, id:string) => {
    let applyInterview = [];
    interview.map((item: any) => {
      if(item.common_code === id) {
        //item.disp_yn = (value ? 'Y' : 'N');
        applyInterview.push(item);
      }
    })
    saveAPI(applyInterview, function(){
      console.log('ok');
    });
  };

  // ############################################# 인터뷰 전체 저장
  const saveAllInterview = async () => {

    if(typeof tgtCode != 'undefined') {
      if(tgtCode == target.common_code) {
        show({content: '변경할 인터뷰를 선택해 주세요.'});
        return;
      }
    } else {
      if(target != null && origin.length > 9) {
        show({content: '인터뷰는 최소 10개까지 등록 가능합니다.'});
        return;
      }
    }

    // ### 적용할 인터뷰 데이터 구성
    let applyInterviewList = [];
    interview.map((item: any, index) => {
      if(target != null && item.common_code === target.common_code) {
        item.use_yn = 'Y';
      } else if(typeof tgtCode != 'undefined' && tgtCode === item.common_code) {
        item.use_yn = 'N';
      }
      item.order_seq = index+1;
      applyInterviewList.push(item);
    })

    saveAPI(applyInterviewList, function() {
      navigation.navigate(STACK.COMMON, { screen: 'Profile1' });
    });
  };

  // ############################################# 인터뷰 정보 저장 API 호출
  const saveAPI = async (dataList: [], callbackFn : Function) => {

    show({ 
      content: '저장하시겠습니까?' ,
      cancelCallback: function() {
        
      },
      confirmCallback: async function() {
        const body = {
          interview_list : dataList
        };
        try {
          const { success, data } = await update_interview(body);
          if(success) {
            if(data.result_code == '0000') {
              //setInterview(data.mbr_interview_list);
              dispatch(setPartialPrincipal({mbr_interview_list : data.mbr_interview_list}));
              callbackFn(); // 콜백함수 실행
            } else {
              show({ 
                content: '오류입니다. 관리자에게 문의해주세요.' ,
                confirmCallback: function() {}
              });
              return false;
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          
        }
      }
    });
  };

  // ############################################# 인터뷰 목록 조회
  const getInterviewList = async () => {
    const body = {
      use_yn : ''
      , disp_yn : ''
    };
    try {
      const { success, data } = await get_member_interview(body);
      console.log('data :::::::: ', data);
      if(success) {
        if(data.result_code == '0000') {
          setInterview(data.interview_list);
        } else {
          show({ 
            content: '오류입니다. 관리자에게 문의해주세요.' ,
            confirmCallback: function() {
              
            }
          });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }
  };

  useEffect(() => {
    getInterviewList();
    
  }, [isFocus]);

  return (
    <View style={{ flex: 1 }}>
      <CommonHeader title={'인터뷰'} />
      <View
        style={{
          paddingTop: 24,
          backgroundColor: 'white',
          flex: 1,
        }}>

        <SpaceView viewStyle={layoutStyle.rowCenter} mb={32}>
          <SpaceView viewStyle={styles.questionContainer} mr={16}>
            <CommonText 
              textStyle={layoutStyle.textCenter}
              type={'h4'} 
              fontWeight={'700'}
              color={target?.use_yn == 'Y' ? Color.grayC3C3C3 : Color.black2222}>

              {target !== null && Object.keys(target).length > 0
                ? target?.code_name
                : `질문을 선택해주세요!`}
            </CommonText>
            
            {target?.use_yn == 'Y' ? (
              <CommonText textStyle={_style.targetDupTxt} fontWeight={'200'}>
                  이미 등록된 질문이에요!
              </CommonText>
            ) : (
              <CommonText textStyle={_style.targetBaseTxt} fontWeight={'200'}>
                  질문에 성실하게 답해주세요.
              </CommonText>
            )}
          </SpaceView>
          {/* <TouchableOpacity onPress={onPressResetTarget}>
            <Image source={ICON.refreshDark} style={styles.iconSize24} />
          </TouchableOpacity> */}
        </SpaceView>

        <SpaceView viewStyle={styles.interviewContainer} mb={20}>
          {/* <SpaceView viewStyle={{ alignItems: 'flex-end' }}>
            <TouchableOpacity
              style={_style.modifyButton}
              onPress={onPressModify}
            >
              <CommonText
                type={'h5'}
                textStyle={{ color: 'white' }}
                color={ColorType.gray6666}
              >
                {mode === Mode.view ? '편집' : '종료'}
              </CommonText>
            </TouchableOpacity>
          </SpaceView> */}
          <SpaceView viewStyle={layoutStyle.rowBetween} mb={24}>
            <SpaceView viewStyle={styles.searchInputContainer}>
              <TextInput
                value={text}
                onChangeText={(e) => setText(e)}
                style={styles.searchInput}
                placeholder={'검색어를 입력하세요.'}
                placeholderTextColor={Color.grayE5E5E5}
              />
              <View style={styles.searchInputIconContainer}>
                <Image source={ICON.searchBlue} style={styles.iconSize22} />
              </View>
              {text.length > 0 && (
                <TouchableOpacity
                  style={styles.searchDeleteBtnContainer}
                  onPress={() => setText('')}
                >
                  <Image source={ICON.xBtn} style={styles.iconSize24} />
                </TouchableOpacity>
              )}
            </SpaceView>
          </SpaceView>

          <DraggableFlatList
            data={interview}
            showsVerticalScrollIndicator={false}
            containerStyle={{ marginBottom: 60 }}
            keyExtractor={(item, index) => index}
            //onDragEnd={onDragEnd}
            onDragEnd={({ data }) => {
              setInterview(data);
            }}
            renderItem = {({ item, drag, isActive }) => (
              <ScaleDecorator activeScale={0.95}>
                <SpaceView viewStyle={[layoutStyle.rowBetween, !isActive ? _style.itemArea: _style.itemAreaActive]} mb={5}>

                  <TouchableOpacity onPress={() => onPressTarget(item)}>
                    <View style={_style.questionRow}>
                      <Text style={[_style.questionText, item?.use_yn === 'Y' && _style.questionActive]}>Q.</Text>
                      <Text style={_style.questionBoldText}>
                      <Text style={[_style.questionNormalText, item?.use_yn === 'Y' && _style.questionActive]}>{item?.code_name}</Text>
                      </Text>
                    </View>

                    {/* {item.use_yn === 'Y' ? (
                      <SpaceView viewStyle={styles.questionItemTextContainerActive}>
                        <CommonText color={Color.white}>{item?.code_name}</CommonText>
                      </SpaceView>
                    ) : (
                      <SpaceView viewStyle={styles.questionItemTextContainer}>
                        <CommonText>{item?.code_name}</CommonText>
                      </SpaceView>
                    )} */}
                  </TouchableOpacity>

                  <View style={styles.questionIconContainer}>
                    {mode === Mode.edit ? (
                      <CommonSwich
                        isOn={item.disp_yn === 'Y'}
                        callbackFn={(value) =>
                          toggleFunction(value, item.common_code)
                        }
                      />
                    ) : (
                      <TouchableOpacity onPressIn={drag} disabled={isActive}>
                        <Image source={ICON.align} style={styles.iconSize24} />
                      </TouchableOpacity>
                    )}
                  </View>
                </SpaceView>
              </ScaleDecorator>
            )}
          />
        </SpaceView>

        <SpaceView mb={10} viewStyle={commonStyle.paddingHorizontal15}>
          <CommonBtn 
            value={'저장'} 
            type={'black'}
            onPress={saveAllInterview} />
        </SpaceView>
      </View>
    </View>
  );
};





const renderItem = gestureHandlerRootHOC(({ item, drag, isActive }) => {
  return (
    <ScaleDecorator activeScale={0.95}>
      <SpaceView viewStyle={[layoutStyle.rowBetween, !isActive ? _style.itemArea: _style.itemAreaActive]} mb={5}>

        <TouchableOpacity onPress={() => onPressTarget(item)}>
          <View style={_style.questionRow}>
            <Text style={[_style.questionText, item?.use_yn === 'Y' && _style.questionActive]}>Q.</Text>
            <Text style={_style.questionBoldText}>
            <Text style={[_style.questionNormalText, item?.use_yn === 'Y' && _style.questionActive]}>{item?.code_name}</Text>
            </Text>
          </View>

          {/* {item.use_yn === 'Y' ? (
            <SpaceView viewStyle={styles.questionItemTextContainerActive}>
              <CommonText color={Color.white}>{item?.code_name}</CommonText>
            </SpaceView>
          ) : (
            <SpaceView viewStyle={styles.questionItemTextContainer}>
              <CommonText>{item?.code_name}</CommonText>
            </SpaceView>
          )} */}
        </TouchableOpacity>

        <View style={styles.questionIconContainer}>
          <TouchableOpacity onPressIn={drag} disabled={isActive}>
            <Image source={ICON.align} style={styles.iconSize24} />
          </TouchableOpacity>
        </View>
      </SpaceView>
    </ScaleDecorator>
  )
});


{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _style = StyleSheet.create({
  modifyButton: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    backgroundColor: Color.purple,
    borderRadius: 8,
    marginBottom: 5,
  },
  itemArea: {
    backgroundColor: ColorType.white,
    borderWidth: 1,
    borderColor: ColorType.white,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 3,
  },
  itemAreaActive : {
    backgroundColor: ColorType.white,
    borderWidth: 1,
    borderColor: ColorType.white,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 3,
  },
  questionRow: {
    flexDirection: 'row',
    width: width - 150,
  },
  questionText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: ColorType.black0000,
  },
  questionActive: {
    color: ColorType.blue7986,
  },
  questionBoldText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#272727',
    marginLeft: 10,
    marginTop: 2,
  },
  questionNormalText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'left',
    color: ColorType.black0000,
  },
  targetBaseTxt: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 13,
    marginHorizontal: 70,
    textAlignVertical: 'center',
    color: Color.grayC3C3C3,
  },
  targetDupTxt: {
    textAlign: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: ColorType.black0000,
    fontSize: 11,
    marginHorizontal: 70,
    textAlignVertical: 'center',
  }
});
