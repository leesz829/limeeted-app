import { ColorType, StackParamList, BottomParamList, ScreenNavigationProp, MemberBaseData, MemberIdealTypeData} from '@types';
import { useState, useEffect} from 'react';
import React, { useRef } from 'react';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { Color } from 'assets/styles/Color';
import { CommonBtn } from 'component/CommonBtn';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ToolTip } from 'component/Tooltip';
import TopNavigation from 'component/TopNavigation';
import { Image, ScrollView, View, TouchableOpacity, ImagePropTypes, Dimensions, Modal } from 'react-native';
import { ICON, IMAGE, PROFILE_IMAGE } from 'utils/imageUtils';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import { RouteProp, useNavigation } from '@react-navigation/native';
import * as properties from 'utils/properties';
import axios from 'axios';
import { CommonDatePicker } from 'component/CommonDatePicker';
import * as dataUtils from 'utils/data';
import AsyncStorage from '@react-native-community/async-storage';


/* ################################################################################################################
###### 로비
################################################################################################################ */

interface Props {
   navigation : StackNavigationProp<BottomParamList, 'Roby'>;
   route : RouteProp<BottomParamList, 'Roby'>;
}

export const Roby = (props : Props) => {
   const navigation = useNavigation<ScreenNavigationProp>();

   const [profileReAprPopup, setProfileReAprPopup] = useState(false);   // 프로필 재심사 팝업
   const [useReportPopup, setUseReportPopup] = useState(false);      // 사용자 신고하기 팝업

   // 회원 기본 데이터
   const [member, setMember] = React.useState({
      base : MemberBaseData
   });

   /*
    * 회원 실시간 데이터
    * - 받은관심, 매칭대상, 평점
    */

   // 회원 받은 관심 목록
   const [resLikeCnt, setResLikeCnt] = React.useState<any>('');
   const [resLikeList, setResLikeList] = React.useState<any>([{
      req_member_seq : String,
      img_path : ''
   }]);

   // 회원 매칭 대상 목록
   const [matchCnt, setMatchCnt] = React.useState<any>('');
   const [matchList, setMatchList] = React.useState<any>([{
      req_member_seq : String,
      img_path : ''
   }]);

   // ###### 첫 렌더링 때 fetchNews() 한 번 실행
   React.useEffect(() => {
      if(props.route.params.memberBase != null) {
         let base:any = props.route.params.memberBase;
         setMember({
            ...member
            , base: base
         });
      } else {
         initData();
      }

      getRealTimeMemberInfo();
      //selectMemberInfo();
   }, [props]);

   const initData = async () => {
      try {
         const memberBase = await AsyncStorage.getItem('memberBase');
         if(memberBase !== null) {
            setMember({
               ...member
               , base : JSON.parse(memberBase)
            })
         }

      } catch (e) {
         console.log(e);
      }
   };

   // 실시간성 회원 데이터 조회
   const getRealTimeMemberInfo = async () => {

      const result = await axios.post(properties.api_domain + '/member/getRealTimeMemberInfo', {
         'api-key' : 'U0FNR09CX1RPS0VOXzAx'
         , 'member_seq' : String(await properties.get_json_data('member_seq'))
      }
      , {
         headers: {
            'jwt-token' : String(await properties.jwt_token())
         }
      })
      .then(function (response) {
         console.log("response.data :::: ", response.data);

         // 관심 목록 셋팅
         let resLikeDataList = new Array();
         response.data?.memberResLikeList?.map(({ req_member_seq, file_name, file_path }: { req_member_seq: any, file_name: any, file_path: any }) => {
            const img_path = properties.api_domain + '/uploads' + file_path + file_name;
            const dataJson = { req_member_seq : String, img_path : '' };

            dataJson.req_member_seq(req_member_seq);
            dataJson.img_path = img_path;

            resLikeDataList.push(dataJson);
         });
         
         // 매칭 목록 셋팅
         let matchDataList = new Array();
         response.data?.memberMatchTrgtList?.map(({ trgt_member_seq, file_name, file_path }: { trgt_member_seq: any, file_name: any, file_path: any }) => {
            const img_path = properties.api_domain + '/uploads' + file_path + file_name;
            const dataJson = { trgt_member_seq : String, img_path : '' };

            dataJson.trgt_member_seq(trgt_member_seq);
            dataJson.img_path = img_path;

            matchDataList.push(dataJson);
         });

         setResLikeCnt(resLikeDataList.length);
         setResLikeList(resLikeDataList);
         setMatchCnt(matchDataList.length);
         setMatchList(matchDataList);         
      })
      .catch(function (error) {
         console.log('error ::: ' , error);
      });
   }

   // 회원 정보 조회
   const selectMemberInfo = async () => {

      const result = await axios.post(properties.api_domain + '/member/selectMemberInfo', {
         'api-key' : 'U0FNR09CX1RPS0VOXzAx'
         , 'member_seq' : String(await properties.get_json_data('member_seq'))
      }
      , {
         headers: {
            'jwt-token' : String(await properties.jwt_token())
         }
      })
      .then(function (response) {
         console.log("response.data :::: ", response.data);
         
         if(response.data.result_code != '0000'){
            console.log(response.data.result_msg);
            return false;
         } else {
            const member = JSON.parse(JSON.stringify(response.data));

            // 회원 데이터 AsyncStorage 저장
            AsyncStorage.clear();
            AsyncStorage.setItem('jwt-token', response.data.token_param.jwt_token);
            AsyncStorage.setItem('member_seq', String(response.data.member_seq));
            AsyncStorage.setItem('member_info', JSON.stringify(response.data), (err)=> {
               if(err){
                  console.log("an error");
                  throw err;
               }
               console.log("success");
            }).catch((err)=> {
               console.log("error is: " + err);
            });

            // 관심 목록 셋팅
            let resLikeDataList = new Array();
            response.data?.resLikeList?.map(({ req_member_seq, file_name, file_path }: { req_member_seq: any, file_name: any, file_path: any }) => {
               console.log("req_member_seq ::: ", req_member_seq);

               const img_path = properties.api_domain + '/uploads' + file_path + file_name;
               const dataJson = { req_member_seq : String, img_path : '' };

               dataJson.req_member_seq(req_member_seq);
               dataJson.img_path = img_path;

               resLikeDataList.push(dataJson);
            });
            
            // 매칭 목록 셋팅
            let matchDataList = new Array();
            response.data?.matchTrgtList?.map(({ trgt_member_seq, file_name, file_path }: { trgt_member_seq: any, file_name: any, file_path: any }) => {
               console.log("trgt_member_seq ::: ", trgt_member_seq);

               const img_path = properties.api_domain + '/uploads' + file_path + file_name;
               const dataJson = { trgt_member_seq : String, img_path : '' };

               dataJson.trgt_member_seq(trgt_member_seq);
               dataJson.img_path = img_path;

               matchDataList.push(dataJson);
            });

            // 선호 이성 정보 셋팅
            let idealTypeData = {};
            if(response.data?.memberIdealType != null) {
               idealTypeData = response.data?.memberIdealType;
            }

            setMember({
               ...member
               , base: member
               , resLikeCnt: resLikeDataList.length
               , resLikeList: resLikeDataList
               , matchCnt: matchDataList.length
               , matchList: matchDataList
               , idealType: idealTypeData
            });
             
         }
      })
      .catch(function (error) {
         console.log('error ::: ' , error);
      });
   }

   // 회원 정보 수정
   const updateMemberInfo = async (type:string, value:string) => {
      let matchYnParam = '';
      let friendMatchParam = '';

      let dataJson = {};

      /*
       * 01 : 내 프로필 공개 
       * 02 : 아는 사람 소개
       */
      if(type == '01') {
         matchYnParam = value;
         friendMatchParam = member.base.friend_match_yn;

         dataJson = {
            'api-key' : 'U0FNR09CX1RPS0VOXzAx'
            , 'member_seq' : String(await properties.get_json_data('member_seq'))
            , 'match_yn' : matchYnParam
         }
      } else {
         matchYnParam = member.base.match_yn;
         friendMatchParam = value;

         dataJson = {
            'api-key' : 'U0FNR09CX1RPS0VOXzAx'
            , 'member_seq' : String(await properties.get_json_data('member_seq'))
            , 'friend_match_yn' : friendMatchParam
         }
      }

      const result = await axios.post(properties.api_domain + '/member/updateMemberBase', dataJson
      , {
         headers: {
            'jwt-token' : String(await properties.jwt_token())
         }
      })
      .then(function (response) {
         console.log("response.data :::: ", response.data);
      })
      .catch(function (error) {
         console.log('error ::: ' , error);
      });
   }

   // 보관함 이동 함수
   const goStorage = async () => {
      const result = await axios.post(properties.api_domain + '/member/selectMemberStorage', {
         'api-key' : 'U0FNR09CX1RPS0VOXzAx'
         , 'member_seq' : String(await properties.get_json_data('member_seq'))
      }
      , {
         headers: {
            'jwt-token' : String(await properties.jwt_token())
         }
      })
      .then(function (response) {
         console.log("resLikeList :::: ", response.data.resLikeList);

         if(response.data.result_code != '0000'){
            console.log(response.data.result_msg);
            return false;
         } else {
            let resLikeListData:any = dataUtils.getStorageListData(response.data.resLikeList);
            let reqLikeListData:any = dataUtils.getStorageListData(response.data.reqLikeList);
            let matchTrgtListData:any = dataUtils.getStorageListData(response.data.matchTrgtList);

            navigation.navigate('Main', { 
               screen: 'Storage',
               params: {
                  resLikeList: resLikeListData
                  , reqLikeList: reqLikeListData
                  , matchTrgtList: matchTrgtListData
               }
            });
         }
      })
      .catch(function (error) {
         console.log('error ::: ' , error);
      });
   }

   // 프로필 재심사 실행
   const profileReexProc = async () => {
      const result = await axios.post(properties.api_domain + '/member/updateProfileReex', {
         'api-key' : 'U0FNR09CX1RPS0VOXzAx'
         , 'member_seq' : String(await properties.get_json_data('member_seq'))
      }
      , {
         headers: {
            'jwt-token' : String(await properties.jwt_token())
         }
      })
      .then(function (response) {
         console.log("response :::: ", response.data);

         if(response.data.result_code != '0000'){
            console.log(response.data.result_msg);
            return false;
         } else {
            setProfileReAprPopup(false);
         }
      })
      .catch(function (error) {
         console.log('error ::: ' , error);
      });
   }


   // 내 선호 이성 Pop
   const ideal_modalizeRef = useRef<Modalize>(null);
   const ideal_onOpen = () => { ideal_modalizeRef.current?.open(); };
   const ideal_onClose = () => {   ideal_modalizeRef.current?.close(); };

   

   // 이용약관 팝업
   const terms_modalizeRef = useRef<Modalize>(null);
   const terms_onOpen = () => { terms_modalizeRef.current?.open(); };
   const terms_onClose = () => { terms_modalizeRef.current?.close(); };

   // 개인정보 취급방침 팝업
   const privacy_modalizeRef = useRef<Modalize>(null);
   const privacy_onOpen = () => { privacy_modalizeRef.current?.open(); };
   const privacy_onClose = () => { privacy_modalizeRef.current?.close(); };

   
   const { width, height } = Dimensions.get('window');

   return (
      <>
         <TopNavigation currentPath={''} />
         <ScrollView contentContainerStyle={styles.scrollContainer}>
            <SpaceView mb={16}>
               <CommonText fontWeight={'700'} type={'h3'}>
                  내 정보
               </CommonText>
            </SpaceView>

            <SpaceView mb={48} viewStyle={layoutStyle.alignCenter}>
               <SpaceView mb={8}>
                  <Image source={{ uri : properties.img_domain + member.base.mst_img_path }} style={styles.profileImg} />
                  {/* <Image source={PROFILE_IMAGE.profileM1} style={styles.profileImg} /> */}
                  {/* <Image source={{uri : props.route.params.mstImg}} style={styles.profileImg} /> */}
                  <View style={styles.profilePenContainer}>
                     <TouchableOpacity onPress={() => {
                                       navigation.navigate('Introduce', {
                                          member_seq : member.base.member_seq
                                          , introduce_comment : member.base.introduce_comment
                                          , business : member.base.business
                                          , job : member.base.job
                                          , job_name : member.base.job_name
                                          , height : member.base.height
                                          , form_body : member.base.form_body
                                          , religion : member.base.religion
                                          , drinking : member.base.drinking
                                          , smoking : member.base.smoking
                                       });
                                    }}>
                        <Image source={ICON.pen} style={styles.iconSize24} />
                     </TouchableOpacity>
                  </View>
               </SpaceView>

               <SpaceView mb={4}>
                  <CommonText fontWeight={'700'} type={'h4'}>
                     {member.base.nickname}, {member.base.age}
                  </CommonText>
               </SpaceView>
               <SpaceView mb={16} viewStyle={styles.levelContainer}>
                  <CommonText color={ColorType.gray6666} type={'h6'}>
                     LV.{member.base.member_level != null ? member.base.member_level : 1}
                  </CommonText>
               </SpaceView>

               <CommonText color={ColorType.gray6666}>{member.base.introduce_comment}</CommonText>
            </SpaceView>

            <View>
               <SpaceView mb={16}>
                  <TouchableOpacity style={[layoutStyle.row, layoutStyle.alignCenter]}
                                 onPress={() => {

                                    const goPress = async () => {
                                       try {
                                          const memberImgList:any = await AsyncStorage.getItem('memberImgList');
                                          const memberSndAuthList:any = await AsyncStorage.getItem('memberSndAuthList');
                                          const memberInterviewList:any = await AsyncStorage.getItem('memberInterviewList');

                                          if (memberImgList !== null || memberSndAuthList !== null || memberInterviewList !== null) {
                                             navigation.navigate('Profile1', {
                                                imgList: JSON.parse(memberImgList)
                                                , authList: JSON.parse(memberSndAuthList)
                                                , interviewList: JSON.parse(memberInterviewList)
                                             });   
                                          }

                                       } catch (e) {
                                          console.log(e);
                                       }
                                    };

                                    goPress();
                                 }}>
                     <CommonText type={'h3'} fontWeight={'700'}>
                        프로필 관리
                     </CommonText>
                     <Image source={ICON.arrRight} style={styles.iconSize} />
                  </TouchableOpacity>
               </SpaceView>

               <SpaceView mb={16} viewStyle={styles.halfContainer}>
                  <View style={[styles.halfItemLeft, styles.profileContainer, layoutStyle.alignCenter]}>
                     <SpaceView mb={4}>
                        <CommonText fontWeight={'700'} type={'h2'}>
                           {member.base.profile_score}
                        </CommonText>
                     </SpaceView>

                     <SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
                        <Image source={ICON.star} style={styles.iconSize24} />
                     </SpaceView>
                     <ToolTip position={'bottomLeft'} title={'프로필 평점'} desc={'<라이브>에 소개된 내 프로필에 다른 이성들이 부여한 프로필 평점'} />
                  </View>

                  <View style={[styles.halfItemRight, styles.profileContainer, layoutStyle.alignCenter]}>
                     <SpaceView mb={4}>
                        <CommonText fontWeight={'700'} type={'h2'}>
                           0
                        </CommonText>
                     </SpaceView>
                     <SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
                        <Image source={ICON.star} style={styles.iconSize24} />
                     </SpaceView>
                     <ToolTip position={'bottomRight'} title={'기여 평점'} desc={'LIMEETED에서 발생한 활동 지표를 통해 부여된 기여 평점'} />
                  </View>
               </SpaceView>

               <SpaceView mb={48}>
                  <CommonBtn
                     type="purple"
                     value="프로필 재심사"
                     icon={ICON.refresh}
                     iconSize={24}
                     iconPosition={'right'}
                     onPress={() => setProfileReAprPopup(true)}
                  />
               </SpaceView>
            </View>

            <SpaceView mb={48}>
               <SpaceView mb={16}>
                  <SpaceView mb={16}>
                     <CommonText fontWeight={'700'} type={'h3'}>
                        보관함
                     </CommonText>
                  </SpaceView>

                  <View style={styles.rowStyle}>
                     <CommonText fontWeight={'500'}>
                        새 관심
                        <CommonText color={ColorType.primary}> {resLikeCnt}</CommonText>건
                     </CommonText>
                     <TouchableOpacity 
                        onPress={() => {
                           goStorage();
                        }}>
                        <Image source={ICON.arrRight} style={styles.iconSize} />
                     </TouchableOpacity>                  
                  </View>

                  <ScrollView horizontal={true}>
                     {resLikeList.map(({ req_member_seq, img_path } : { req_member_seq: any, img_path: string }) => (
                        <SpaceView key={req_member_seq} viewStyle={styles.circleBox} mr={16}>
                           <Image source={{ uri: img_path !== "" ? img_path : undefined }} style={styles.circleBoxImg} />
                        </SpaceView>
                     ))}
                  </ScrollView>
               </SpaceView>

               <View style={styles.rowStyle}>
                  <CommonText fontWeight={'500'}>
                     새 매칭
                     <CommonText color={ColorType.primary}> {matchCnt}</CommonText>건
                  </CommonText>
                  <TouchableOpacity 
                     onPress={() => {
                        goStorage();
                     }}>
                     <Image source={ICON.arrRight} style={styles.iconSize} />
                  </TouchableOpacity>         
               </View>

               <ScrollView horizontal={true}>
                  {matchList.map(({ trgt_member_seq, img_path } : { trgt_member_seq: any, img_path: string }) => (
                     <SpaceView key={img_path} viewStyle={styles.circleBox} mr={16}>
                        <Image source={{ uri: img_path !== "" ? img_path : undefined }} style={styles.circleBoxImg} />
                     </SpaceView>
                  ))}
               </ScrollView>
            </SpaceView>

            <SpaceView mb={48}>
               <SpaceView mb={16}>
                  <CommonText fontWeight={'700'} type={'h3'}>
                     매칭 설정
                  </CommonText>
               </SpaceView>

               <TouchableOpacity style={styles.rowStyle} 
                              onPress={() => { 
                                 const goPress = async () => {
                                    try {
                                       const memberIdealType = await AsyncStorage.getItem('memberIdealType');
                                       console.log("memberIdealType ::: ", memberIdealType);
                                       if (null != memberIdealType && 'null' != memberIdealType) {
                                          const jsonData:any = JSON.parse(memberIdealType);
                                          navigation.navigate('Preference', {
                                             ideal_type_seq: jsonData.ideal_type_seq
                                             , want_local1: jsonData.want_local1
                                             , want_local2: jsonData.want_local2
                                             , want_age_min: jsonData.want_age_min
                                             , want_age_max: jsonData.want_age_max
                                             , want_business1: jsonData.want_business1
                                             , want_business2: jsonData.want_business2
                                             , want_business3: jsonData.want_business3
                                             , want_job1: jsonData.want_job1
                                             , want_job2: jsonData.want_job2
                                             , want_job3: jsonData.want_job3
                                             , want_person1: jsonData.want_person1
                                             , want_person2: jsonData.want_person2
                                             , want_person3: jsonData.want_person3
                                             , gender: member.base.gender
                                          });
                                       } else {
                                          navigation.navigate('Preference', {
                                             ideal_type_seq: ''
                                             , want_local1: ''
                                             , want_local2: ''
                                             , want_age_min: ''
                                             , want_age_max: ''
                                             , want_business1: ''
                                             , want_business2: ''
                                             , want_business3: ''
                                             , want_job1: ''
                                             , want_job2: ''
                                             , want_job3: ''
                                             , want_person1: ''
                                             , want_person2: ''
                                             , want_person3: ''
                                             , gender: member.base.gender
                                          });      
                                       }
                                    } catch (e) {
                                       console.log(e);
                                    }
                                 };

                                 goPress();
                              }}>
                  <CommonText fontWeight={'500'}>내 선호 이성</CommonText>
                  <Image source={ICON.arrRight} style={styles.iconSize} />
               </TouchableOpacity>

               <View style={styles.rowStyle}>
                  <ToolTip title={'내 프로필 공개'} desc={'내 프로필을 이성들에게 공개할지 설정하는 기능입니다.'} />
                  <CommonSwich callbackFn={(value:boolean) => { updateMemberInfo('01', value ? 'Y' : 'N'); }} 
                            isOn={member.base.match_yn == 'Y' ? true : false} />
               </View>

               <View style={styles.rowStyle}>
                  <ToolTip title={'아는 사람 소개'} desc={'아는 사람에게 내 프로필을 공개할지 설정할지 하는 기능입니다.'} />
                  <CommonSwich callbackFn={(value:boolean) => { updateMemberInfo('02', value ? 'Y' : 'N'); }}  
                           isOn={member.base.friend_match_yn == 'Y' ? true : false} />
               </View>
            </SpaceView>

            <SpaceView mb={40}>
               <SpaceView mb={16}>
                  <CommonText fontWeight={'700'} type={'h3'}>
                     그 외
                  </CommonText>
               </SpaceView>
               <TouchableOpacity 
                  style={styles.rowStyle} 
                  onPress={() => { 

                     // 실시간성 회원 데이터 조회
                     const goPage = async () => {

                        const result = await axios.post(properties.api_domain + '/board/selectBoardList', {
                           'api-key' : 'U0FNR09CX1RPS0VOXzAx'
                        }
                        , {
                           headers: {
                              'jwt-token' : String(await properties.jwt_token())
                           }
                        })
                        .then(function (response) {
                           console.log("response.data :::: ", response.data);

                           navigation.navigate('Board0', {
                              boardList : response.data.boardList
                           });

                           // 게시판 목록 셋팅
                           let boardList = new Array();
                           /* response.data?.boardList?.map(({ board_seq, board_code, title, contents }: { board_seq: any, board_code: any, title: any, contents: any }) => {
                              const dataJson = { req_member_seq : String, img_path : '' };

                              dataJson.req_member_seq(req_member_seq);
                              dataJson.img_path = img_path;

                              resLikeDataList.push(dataJson);
                           }); */
                           
                        })
                        .catch(function (error) {
                           console.log('error ::: ' , error);
                        });
                     }

                     goPage();
                  }}>

                  <CommonText fontWeight={'500'}>최근 소식</CommonText>
                  <Image source={ICON.arrRight} style={styles.iconSize} />
               </TouchableOpacity>
               <TouchableOpacity 
                  style={styles.rowStyle} 
                  onPress={() => { 
                     navigation.navigate('Profile', {
                        nickname : member.base.nickname
                        , name: member.base.name
                        , gender: member.base.gender
                        , age: member.base.age
                        , phone_number: member.base.phone_number
                     })
                  }}>

                  <CommonText fontWeight={'500'}>내 계정 정보</CommonText>
                  <Image source={ICON.arrRight} style={styles.iconSize} />
               </TouchableOpacity>
               <TouchableOpacity style={styles.rowStyle} onPress={terms_onOpen}>
                  <CommonText fontWeight={'500'}>이용약관</CommonText>
                  <Image source={ICON.arrRight} style={styles.iconSize} />
               </TouchableOpacity>
               <TouchableOpacity style={styles.rowStyle} onPress={privacy_onOpen}>
                  <CommonText fontWeight={'500'}>개인정보 취급방침</CommonText>
                  <Image source={ICON.arrRight} style={styles.iconSize} />
               </TouchableOpacity>
            </SpaceView>
         </ScrollView>


         {/* ###############################################
                     내 선호 이성 팝업
         ############################################### */}
         {/* <Modalize
            ref={ideal_modalizeRef}
            adjustToContentHeight={false}
            handleStyle={modalStyle.modalHandleStyle}
            modalStyle={modalStyle.modalContainer}>

            <Preference onCloseFn={ideal_onClose} idealTypeData={member.idealType} />
         </Modalize> */}

         {/* ###############################################
                     프로필 재심사 팝업
         ############################################### */}
         <Modal visible={profileReAprPopup} transparent={true}>
            <View style={modalStyle.modalBackground}>
               <View style={modalStyle.modalStyle1}>
                  <SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
                     <CommonText fontWeight={'700'} type={'h4'}>
                        프로필 재심사
                     </CommonText>
                  </SpaceView>

                  <SpaceView viewStyle={layoutStyle.alignCenter}>
                     <CommonText type={'h5'}>프로필 재심사 대기열에 등록하시겠습니까?</CommonText>
                  </SpaceView>

                  <View style={modalStyle.modalBtnContainer}>
                     <TouchableOpacity style={modalStyle.modalBtn} onPress={() => setProfileReAprPopup(false)}>
                        <CommonText fontWeight={'500'}>취소</CommonText>
                     </TouchableOpacity>
                     <View style={modalStyle.modalBtnline} />
                     <TouchableOpacity style={modalStyle.modalBtn} onPress={() => profileReexProc()} >
                        <CommonText fontWeight={'500'} color={ColorType.red}>
                           확인
                        </CommonText>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>

         {/* ###############################################
                     이용약관 팝업
         ############################################### */}
         <Modalize
            ref={terms_modalizeRef}
            handleStyle={modalStyle.modalHandleStyle}
            modalStyle={modalStyle.modalContainer}
         >
            <View style={modalStyle.modalHeaderContainer}>
               <CommonText fontWeight={'700'} type={'h3'}>
                  이용약관
               </CommonText>
               <TouchableOpacity onPress={terms_onClose}>
                  <Image source={ICON.xBtn} style={styles.iconSize24} />
               </TouchableOpacity>
            </View>

            <View style={[modalStyle.modalBody, layoutStyle.flex1]}>
               <SpaceView mb={24}>
                  <CommonDatePicker />
               </SpaceView>

               <SpaceView
                  mb={24}
                  viewStyle={{ width: width - 32, height: height - 300, backgroundColor: Color.grayF8F8 }} />
               <View>
                  <CommonBtn value={'확인'} type={'primary'} onPress={terms_onClose} />
               </View>
            </View>
         </Modalize>

         {/* ###############################################
                     개인정보 취급방침 팝업
         ############################################### */}
         <Modalize
            ref={privacy_modalizeRef}
            handleStyle={modalStyle.modalHandleStyle}
            modalStyle={modalStyle.modalContainer} >

            <View style={modalStyle.modalHeaderContainer}>
               <CommonText fontWeight={'700'} type={'h3'}>
                  개인정보 취급방침
               </CommonText>
               <TouchableOpacity onPress={privacy_onClose}>
                  <Image source={ICON.xBtn} style={styles.iconSize24} />
               </TouchableOpacity>
            </View>

            <View style={[modalStyle.modalBody, layoutStyle.flex1]}>
               <SpaceView mb={24}>
                  <CommonDatePicker />
               </SpaceView>

               <SpaceView
                  mb={24}
                  viewStyle={{ width: width - 32, height: height - 300, backgroundColor: Color.grayF8F8 }} />
               <View>
                  <CommonBtn value={'확인'} type={'primary'} onPress={privacy_onClose} />
               </View>
            </View>
         </Modalize>

      </>
   );
};