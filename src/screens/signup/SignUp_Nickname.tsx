import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { commonStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Image, ScrollView, StyleSheet, View, Platform, Text, Dimensions } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import { usePopup } from 'Context';
import { SUCCESS } from 'constants/reusltcode';
import { regist_member_add_info, get_member_introduce_guide } from 'api/models';
import { ROUTES } from 'constants/routes';
import { isEmptyData } from 'utils/functions';
import LinearGradient from 'react-native-linear-gradient';
import { TextInput } from 'react-native-gesture-handler';


/* ################################################################################################################
###################################################################################################################
###### 회원가입 - 닉네임과 한줄소개
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'SignUp_Nickname'>;
  route: RouteProp<StackParamList, 'SignUp_Nickname'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Nickname = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const isFocus = useIsFocused();
  const { show } = usePopup();  // 공통 팝업
  const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부
  const [isLoading, setIsLoading] = React.useState(false); // 로딩 여부

  const memberSeq = props.route.params?.memberSeq; // 회원 번호
  const gender = props.route.params?.gender; // 성별
  const mstImgPath = props.route.params?.mstImgPath; // 대표 사진 경로

  const [nickname, setNickname] = React.useState('');	// 닉네임
	const [comment, setComment] = React.useState(''); // 한줄 소개


  // ############################################################ 회원 소개 정보 조회
	const getMemberIntro = async() => {
		const body = {
			member_seq : memberSeq
		};
		try {
			const { success, data } = await get_member_introduce_guide(body);
			if(success) {
				switch (data.result_code) {
				case SUCCESS:
          setNickname(data?.member?.nickname);
          setComment(data?.member?.comment);

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
			
		}
	};

  // ############################################################################# 저장 함수
  const saveFn = async () => {

    let special_pattern = /[^a-zA-Z0-9ㄱ-힣]/g;

		if(!isEmptyData(nickname) || !nickname.trim()) {
			show({ content: '닉네임을 입력해 주세요.' });
			return;
		}
		if(!isEmptyData(comment) || !comment.trim()) {
			show({ content: '한줄 소개를 입력해 주세요.' });
			return;
		}

		if(nickname.length > 12 || special_pattern.test(nickname) == true) {
			show({ content: '한글, 영문, 숫자 12글자까지 입력할 수 있어요.' });
			return;
		}

    // 중복 클릭 방지 설정
    if(isClickable) {
      setIsClickable(false);
      setIsLoading(true);

      const body = {
        member_seq: memberSeq,
        nickname: nickname,
        comment: comment,
        join_status: '02',
      };
      try {
        const { success, data } = await regist_member_add_info(body);
        if (success) {
          switch (data.result_code) {
            case SUCCESS:
              /* navigation.navigate(ROUTES.SIGNUP_ADDINFO, {
                memberSeq: memberSeq,
                gender: gender,
                mstImgPath: mstImgPath,
                nickname: nickname,
              }); */

              navigation.navigate(ROUTES.SIGNUP_ADDINFO, {
                memberSeq: memberSeq,
                gender: gender,
                mstImgPath: mstImgPath,
                nickname: nickname,
              });
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
      };
    }
  };

  // ############################################################ 최초 실행
	React.useEffect(() => {
		getMemberIntro();		
	}, [isFocus]);

  return (
    <>
      <LinearGradient
        colors={['#3D4348', '#1A1E1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={_styles.wrap}
      >
        <ScrollView>
          <SpaceView mt={20}>
            <Text style={_styles.title}>닉네임을 알려 주세요!</Text>
            <View style={_styles.inputContainer}>
              <TextInput
                value={nickname}
                onChangeText={(text) => setNickname(text)}
                autoCapitalize={'none'}
                style={_styles.textInput}
                /* placeholder={'닉네임을 입력해 주세요.'}
                placeholderTextColor={'#989898'} */
                maxLength={12}
                //caretHidden={true}
              />
              <SpaceView mt={10}>
                <Text style={_styles.validText}><Text>한글 영문 숫자 사용 가능,</Text> <Text>최대 12글자 입력 가능</Text></Text>
              </SpaceView>
            </View>
          </SpaceView>

          <SpaceView mt={80}>
            <View>
              <Text style={_styles.commentText}>반가워요. <Text style={{color: '#F3E270'}}>닉네임</Text>님.{'\n'}간단한 한줄소개를{'\n'}부탁드려요.</Text>
            </View>
            <View style={_styles.commentInputCont}>
              <TextInput
                value={comment}
                onChangeText={(text) => setComment(text)}
                //multiline={true}
                autoCapitalize={'none'}
                style={_styles.commentInput}
                placeholder='프로필 사진에 공개되는 한줄소개 입력'
                placeholderTextColor={'#FFFDEC'}
                maxLength={50}
                caretHidden={true}
              />
            </View>
          </SpaceView>

          <SpaceView mt={120}>
            <CommonBtn
              value={'간편 소개 작성하기'}
              type={'reNewId'}
              fontSize={16}
              fontFamily={'Pretendard-Bold'}
              borderRadius={5}
              onPress={() => {
                /* navigation.navigate(ROUTES.SIGNUP_ADDINFO, {
                  memberSeq: memberSeq,
                  gender: gender,
                  mstImgPath: mstImgPath,
                }); */

                saveFn();
              }}
            />
          </SpaceView>

          <SpaceView mt={20}>
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
        </ScrollView>
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
  inputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  textInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#445561',
    /* borderColor: '#FFFDEC',
    borderWidth: 1, */
    borderRadius: 50,
    color: '#F3E270',
    textAlign: 'center',
    fontFamily: 'Pretendard-Light',
  },
  validText: {
    fontFamily: 'Pretendard-Light',
    color: '#D5CD9E',
    fontSize: 12,
  },
  commentText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    color: '#D5CD9E',
  },
  commentInputCont: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  commentInput: {
    width: '100%',
    height: 60,
    backgroundColor: '#445561',
    /* borderWidth: 1,
    borderColor: '#FFFDEC', */
    borderRadius: 5,
    color: '#FFFDEC',
    textAlign: 'center',
    fontFamily: 'Pretendard-Light',
    fontSize: 14,
  },
});