import { styles, layoutStyle, modalStyle, commonStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform, Text, TextInput } from 'react-native';
import * as React from 'react';
import { FC, useState, useEffect, useRef } from 'react';
import { CommonSelect } from 'component/CommonSelect';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import { CommonTextarea } from 'component/CommonTextarea';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { ColorType, StackParamList, BottomParamList, ScreenNavigationProp } from '@types';
import { useDispatch } from 'react-redux';
import { STACK } from 'constants/routes';
import { useUserInfo } from 'hooks/useUserInfo';
import { get_common_code, update_additional, get_member_introduce, save_member_introduce } from 'api/models';
import { usePopup } from 'Context';
import { myProfile } from 'redux/reducers/authReducer';
import { Color } from 'assets/styles/Color';
import { ICON } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { SUCCESS } from 'constants/reusltcode';
import { isEmptyData } from 'utils/functions';
import { CommonLoading } from 'component/CommonLoading';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import LinearGradient from 'react-native-linear-gradient';


/* ################################################################################################################
###################################################################################################################
###### 프로필 소개 상세
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Profile_Introduce'>;
  route: RouteProp<StackParamList, 'Profile_Introduce'>;
}

const { width, height } = Dimensions.get('window');

export const Profile_Introduce = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const dispatch = useDispatch();

  const { show } = usePopup();  // 공통 팝업
	const isFocus = useIsFocused();
	const [isLoading, setIsLoading] = React.useState(false); // 로딩 여부
	const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

  const memberBase = useUserInfo(); // 회원 기본정보

  const [introduceComment, setIntroduceComment] = React.useState('');	// 자기 소개
  const [comment, setComment] = React.useState(memberBase?.comment);	// 한줄 소개
  const [interviewList, setInterviewList] = React.useState([]); // 인터뷰 목록


  /* ############################################################################# 인터뷰 답변 핸들러 */
	const answerChangeHandler = (common_code: any, text: any) => {
		setInterviewList((prev) =>
			prev.map((item: any) =>
			item.common_code === common_code
				? { ...item, answer: text }
				: item
			)
		);
		//callbackAnswerFn && callbackAnswerFn(member_interview_seq, text);
	};

  // ############################################################ 회원 소개 정보 조회 함수
  const getMemberIntro = async () => {
    const body = {
      exp_interest_yn: 'N',
      exp_interview_yn: 'Y',
    };
    try {
      setIsLoading(true);
      const { success, data } = await get_member_introduce(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:

            setIntroduceComment(data?.member_add?.introduce_comment);
            setInterviewList(data?.interview_list);
          
          break;
        default:
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
          break;
        }
      } else {
        show({ content: '오류입니다. 관리자에게 문의해주세요.' });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ############################################################ 내 소개하기 저장
  const saveFn = async () => {

    // 중복 클릭 방지 설정
    if(isClickable) {
      setIsClickable(false);
      setIsLoading(true);

      try {
        const body = {
          business: addData.business,
          job: addData.job,
          height: addData.height,
          form_body: addData.form_body,
          religion: addData.religion,
          drinking: addData.drinking,
          smoking: addData.smoking,
        };
    
        /* const body = {
          comment: comment,
          business: business,
          job: job,
          job_name: job_name,
          height: mbrHeight,
          form_body: form_body,
          religion: religion,
          drinking: drinking,
          smoking: smoking,
          interest_list : checkIntList,
          introduce_comment: introduceComment,
        }; */

        const { success, data } = await save_member_introduce(body);
        if(success) {
          switch (data.result_code) {
          case SUCCESS:

            // 갱신된 회원 기본 정보 저장
            //dispatch(setPartialPrincipal({ mbr_base : data.mbr_base }));

            show({ type: 'RESPONSIVE', content: '내 소개 정보가 저장되었습니다.' });

            /* navigation.navigate(STACK.TAB, {
              screen: 'Roby',
            }); */

            navigation.goBack();
            
            break;
          default:
            show({ content: '오류입니다. 관리자에게 문의해주세요.' });
            break;
          }
        } else {
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsClickable(true);
        setIsLoading(false);
      }
    }
  };

  // 첫 렌더링 때 실행
  React.useEffect(() => {
    if(isFocus) {
      getMemberIntro();
    }

  }, [isFocus]);

  return (
    <>
      {isLoading && <CommonLoading />}

      <LinearGradient
				colors={['#3D4348', '#1A1E1C']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={_styles.wrap}
			>
				<ScrollView showsVerticalScrollIndicator={false} style={{height: height-200}}>
					<SpaceView mt={20} mb={30}>
						<Text style={_styles.title}><Text style={{color: '#F3E270'}}>{memberBase?.nickname}</Text>님의{'\n'}프로필 정보 수정하기</Text>
					</SpaceView>

          <SpaceView>
            <SpaceView>
              <Text style={_styles.introduceText}>한줄 소개</Text>
            </SpaceView>
            <SpaceView>
              <TextInput
                value={comment}
                onChangeText={(text) => setComment(text)}
                autoCapitalize={'none'}
                multiline={true}
                style={_styles.textInputBox(70)}
                placeholder={'프로필 카드 상단에 공개되는 내 상세 소개 입력'}
                placeholderTextColor={'#FFFDEC'}
                maxLength={50}
                caretHidden={true}
              />
              <SpaceView mt={5}>
                <Text style={_styles.countText}>({isEmptyData(comment) ? comment.length : 0}/50)</Text>
              </SpaceView>
            </SpaceView>
          </SpaceView>

					<SpaceView>
            <SpaceView>
              <Text style={_styles.introduceText}>프로필 소개</Text>
            </SpaceView>
            <SpaceView>
              <TextInput
                value={introduceComment}
                onChangeText={(text) => setIntroduceComment(text)}
                autoCapitalize={'none'}
                multiline={true}
                style={_styles.textInputBox(110)}
                placeholder={'프로필 카드 상단에 공개되는 내 상세 소개 입력'}
                placeholderTextColor={'#FFFDEC'}
                maxLength={3000}
                caretHidden={true}
              />
              <SpaceView mt={5}>
                <Text style={_styles.countText}>({isEmptyData(introduceComment) ? introduceComment.length : 0}/3000)</Text>
              </SpaceView>
            </SpaceView>
          </SpaceView>

					<SpaceView mt={10}>
						{interviewList.map((item, index) => {

							console.log('item :::::: ',  item);

							return isEmptyData(item?.common_code) && (
								<>
									<SpaceView mb={15}>
										<Text style={_styles.introduceText}>Q. {item?.code_name}</Text>
										<TextInput
											defaultValue={item?.answer}
											onChangeText={(text) => answerChangeHandler(item?.common_code, text) }
											autoCapitalize={'none'}
											multiline={true}
											style={_styles.textInputBox(70)}
											placeholder={'인터뷰 답변 입력(가입 후 변경 가능)'}
											placeholderTextColor={'#FFFDEC'}
											maxLength={200}
											caretHidden={true}
										/>
									</SpaceView>
								</>
							)
						})}
					</SpaceView>
				</ScrollView>

        <SpaceView mb={10} viewStyle={_styles.btnArea}>
          <SpaceView mt={10}>
            <CommonBtn
              value={'저장하기'}
              type={'reNewId'}
              fontSize={16}
              fontFamily={'Pretendard-Bold'}
              borderRadius={5}
              onPress={() => {
                //saveFn();
              }}
            />
          </SpaceView>

          <SpaceView mt={10}>
            <CommonBtn
              value={'이전으로'}
              type={'reNewGoBack'}
              isGradient={false}
              fontFamily={'Pretendard-Light'}
              fontSize={14}
              borderRadius={5}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </SpaceView>
        </SpaceView>
			</LinearGradient>

    </>
  );
};



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}
const _styles = StyleSheet.create({
  wrap: {
		minHeight: height,
		padding: 30,
	},
	title: {
		fontSize: 30,
		fontFamily: 'Pretendard-Bold',
		color: '#D5CD9E',
	},
	textInputBox: (_hegiht: number) => {
		return {
			width: '100%',
			height: _hegiht,
			backgroundColor: '#445561',
			borderRadius: 5,
			textAlign: 'center',
			fontFamily: 'Pretendard-Light',
			color: '#FFFDEC',
		};
	  },
	introduceText: {
		fontFamily: 'Pretendard-Regular',
		color: '#FFDD00',
		marginBottom: 10,
	},
	countText: {
		marginLeft: 3,
		fontFamily: 'Pretendard-Regular',
		fontSize: 12,
		color: '#fff',
		textAlign: 'right',
	},
  btnArea: {
    
  },

});