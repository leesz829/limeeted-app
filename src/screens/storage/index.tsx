import { ColorType, BottomParamList, ScreenNavigationProp } from '@types';
import { styles, layoutStyle, modalStyle } from 'assets/styles/Styles';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { Image, ScrollView, View, TouchableOpacity, Modal, Alert } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import * as properties from 'utils/properties';
import * as dataUtils from 'utils/data';
import * as hooksMember from 'hooks/member';
import { useDispatch } from 'react-redux';
import * as mbrReducer from 'redux/reducers/mbrReducer';

/* ################################################################################################################
###### 보관함
################################################################################################################ */

interface Props {
   navigation : StackNavigationProp<BottomParamList, 'Storage'>;
   route : RouteProp<BottomParamList, 'Storage'>;
}

export const Storage = (props : Props) => {
   const navigation = useNavigation<ScreenNavigationProp>();
   const isFocusStorage = useIsFocused();

   const jwtToken = hooksMember.getJwtToken();      // 토큰
   const memberSeq = hooksMember.getMemberSeq();   // 회원번호

   const [btnStatus, setBtnStatus] = useState(true);
   const [btnStatus1, setBtnStatus1] = useState(true);
   const [btnStatus2, setBtnStatus2] = useState(true);

   const [isResSpecialVisible, setIsResSpecialVisible] = React.useState(false);
   const [isReqSpecialVisible, setIsReqSpecialVisible] = React.useState(false);
   const [isMatchSpecialVisible, setIsMatchSpecialVisible] = React.useState(false);

   /* ################################################
   ######## Storage Data 구성
   ######## - resLikeList : 내가 받은 관심 목록
   ######## - reqLikeList : 내가 받은 관심 목록
   ######## - matchTrgtList : 내가 받은 관심 목록
   #################################################*/
   const [data, setData] = React.useState<any>({
      resLikeList : []
      , reqLikeList : []
      , matchTrgtList : []
      , resSpecialCnt : 0
      , reqSpecialCnt : 0
      , matchSpecialCnt : 0
   });

   // 매칭 상세 이동하기 위한 저장 데이터
   const [detailMatchData, setDetailMatchData] = React.useState<any>({
      match_seq: ''
      , tgt_member_seq: ''
      , type: ''
      , profile_open_yn: ''
   })

   /* let detailMatchData:any = {
      match_seq: ''
      , tgt_member_seq: ''
      , type: ''
      , profile_open_yn: ''
   };
 */
   React.useEffect(() => {
      /* detailMatchData = {
         match_seq: ''
         , tgt_member_seq: ''
         , type: ''
      } */

      getStorageData();      
   }, [isFocusStorage]);

   // 찐심 설정
   const specialInterestFn = async (type:string, value:string) => {
      if(type == "RES") { setIsResSpecialVisible(value == 'Y' ? true : false);
      } else if(type == "REQ") { setIsReqSpecialVisible(value == 'Y' ? true : false);
      } else if(type == "MATCH") { setIsMatchSpecialVisible(value == 'Y' ? true : false); }
   }

   // 보관함 정보 조회
   const getStorageData = async () => {
      const result = await axios.post(properties.api_domain + '/member/selectMemberStorage', {
         'api-key' : 'U0FNR09CX1RPS0VOXzAx'
         , 'member_seq' : memberSeq
      }
      , {
         headers: {
           'jwt-token' : jwtToken
         }
      })
      .then(function (response) {  
         if(response.data.result_code != '0000'){
            console.log(response.data.result_msg);
            return false;
         } else {
            let resLikeListData:any = dataUtils.getStorageListData(response.data.resLikeList);
            let reqLikeListData:any = dataUtils.getStorageListData(response.data.reqLikeList);
            let matchTrgtListData:any = dataUtils.getStorageListData(response.data.matchTrgtList);

            let tmpResSpecialCnt = 0;
            let tmpReqSpecialCnt = 0;
            let tmpMatchSpecialCnt = 0;

            if(response.data.resLikeList.length > 0) [
               response.data.resLikeList.map(({ special_interest_yn } : { special_interest_yn:any }) => {
                  if(special_interest_yn == 'Y') { tmpResSpecialCnt++; }
               })
            ]

            if(response.data.reqLikeList.length > 0) [
               response.data.reqLikeList.map(({ special_interest_yn } : { special_interest_yn:any }) => {
                  if(special_interest_yn == 'Y') { tmpReqSpecialCnt++; }
               })
            ]

            if(response.data.matchTrgtList.length > 0) [
               response.data.matchTrgtList.map(({ special_interest_yn } : { special_interest_yn:any }) => {
                  if(special_interest_yn == 'Y') { tmpMatchSpecialCnt++; }
               })
            ]

            setData({
               ...data
               , resLikeList : resLikeListData
               , reqLikeList : reqLikeListData
               , matchTrgtList : matchTrgtListData
               , resSpecialCnt : tmpResSpecialCnt
               , reqSpecialCnt : tmpReqSpecialCnt
               , matchSpecialCnt : tmpMatchSpecialCnt
            });
         }
      })
      .catch(function (error) {
         console.log('error ::: ' , error);
      });
   }

   // 프로필 열람 팝업 활성화
   const popupProfileOpen = async (match_seq: any, tgt_member_seq: any, type: any, profile_open_yn: any) => {
      setDetailMatchData({
         match_seq: match_seq
         , tgt_member_seq: tgt_member_seq
         , type: type
         , profile_open_yn: profile_open_yn
      });

      if(profile_open_yn == 'N') {
         setProfileOpenPopup(true);
      } else {
         navigation.navigate('StorageProfile', {
            matchSeq: detailMatchData.match_seq,
            memberSeq: detailMatchData.tgt_member_seq,
            type: detailMatchData.type
         });
      }
   }

   // 프로필 열람 이동
   const goProfileOpen = async () => {
      let req_profile_open_yn = '';
      let res_profile_open_yn = '';

      if(detailMatchData.type == 'REQ') {
         req_profile_open_yn = 'Y';
      } else if(detailMatchData.type == 'RES') {
         res_profile_open_yn = 'Y';
      }

      const result = await axios.post(properties.api_domain + '/match/updateMatchInfo',
         {
            'api-key': 'U0FNR09CX1RPS0VOXzAx',
            match_seq: detailMatchData.match_seq,
            req_profile_open_yn: req_profile_open_yn,
            res_profile_open_yn: res_profile_open_yn,
            member_seq: memberSeq
         },
         {
            headers: {
               'jwt-token': jwtToken
            },
         },
      )
      .then(function (response) {
         console.log(response);
         if (response.data.result_code != '0000') {
            console.log(response.data.result_msg);
            Alert.alert('오류입니다. 관리자에게 문의해주세요.');
         } else {
            navigation.navigate('StorageProfile', {
               matchSeq: detailMatchData.match_seq,
               memberSeq: detailMatchData.tgt_member_seq,
               type: detailMatchData.type
            });
         }
      })
      .catch(function (error) {
         console.log('error ::: ', error);
      });
   }










   // 매칭 상태 변경
   /* const updateMatchStatus = async (status:any) => {
      const result = await axios
         .post(
            properties.api_domain + '/match/updateMatchStatus',
            {
               'api-key': 'U0FNR09CX1RPS0VOXzAx',
               match_seq: matchSeq,
               match_status: status,
               member_seq: memberSeq
            },
            {
               headers: {
                  'jwt-token': jwtToken,
               },
            },
         )
         .then(function (response) {
            console.log(response);
            if (response.data.result_code != '0000') {
               console.log(response.data.result_msg);
               Alert.alert('오류입니다. 관리자에게 문의해주세요.');
            } else {
               navigation.navigate('Main', {
                  screen: 'Storage',
               });
            }
         })
         .catch(function (error) {
            console.log('error ::: ', error);
         });
   }; */









   // ################### 팝업 관련 #####################

   const [profileOpenPopup, setProfileOpenPopup] = useState(false); // 프로필 열람 팝업








   return (
      <>
         <TopNavigation currentPath={''} />
         <ScrollView contentContainerStyle={styles.scrollContainer}>

            {/* ################################################################
            ######################   내가 받은 관심 목록 영역 ######################
            ################################################################ */}
            <SpaceView mb={32}>
               <SpaceView mb={16}>
                  <CommonText fontWeight={'700'} type={'h3'}>
                     내가 받은 관심
                  </CommonText>
               </SpaceView>

               <SpaceView mb={16} viewStyle={styles.rowStyle}>
                  <CommonText fontWeight={'500'}>찐심만 보기</CommonText>
                  <CommonSwich
                     callbackFn={(value:boolean) => { specialInterestFn('RES', value ? 'Y' : 'N'); }} 
                     isOn={false} />
               </SpaceView>

               <View>
                  {data.resLikeList.length > 0 && (!isResSpecialVisible || isResSpecialVisible && data.resSpecialCnt > 0) ? (
                  <>
                     {data.resLikeList.map((item:any,index:any) => (
                        <SpaceView key={index} mb={16} viewStyle={styles.halfContainer}>
                           {item.map((
                              { 
                                 match_seq
                                 , req_member_seq
                                 , img_path, dday
                                 , special_interest_yn 
                                 , req_profile_open_yn
                              } : { 
                                 match_seq:any
                                 , req_member_seq: any
                                 , img_path: any
                                 , dday: any
                                 , special_interest_yn: any 
                                 , req_profile_open_yn: any
                              }) =>
                                             
                              !isResSpecialVisible || (isResSpecialVisible && special_interest_yn == 'Y') ? (
                                 <TouchableOpacity onPress={() => { popupProfileOpen(match_seq, req_member_seq, 'REQ', req_profile_open_yn); }}>

                                    <View key={match_seq} style={styles.halfItemLeft}>
                                       <View style={styles.favoriteBox}>

                                          {/* 관심/찐심 구분 아이콘 */}
                                          <View style={styles.posTopRight}>
                                             {special_interest_yn != '' && special_interest_yn == 'Y' ? (
                                                <Image source={ICON.royalpass} style={styles.iconSize32} />
                                             ) : (
                                                <Image source={ICON.like} style={styles.iconSize32} />
                                             )}
                                          </View>

                                          {/* 썸네일 이미지 */}
                                          <Image source={{ uri: img_path !== "" ? img_path : undefined }} style={styles.favoriteImg} />

                                          {/* 썸네일 이미지 그라데이션 효과 */}
                                          <LinearGradient
                                             colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                                             style={styles.dim}
                                             start={{ x: 0, y: 0 }}
                                             end={{ x: 1, y: 1 }}
                                          />

                                          {/* 보관 기간 표시 */}
                                          <View style={styles.posBottomLeft}>
                                             <CommonText fontWeight={'700'} color={ColorType.white}>
                                                D-{dday}
                                             </CommonText>
                                          </View>
                                       </View>
                                    </View>   

                                 </TouchableOpacity>
                              ) : (
                                 <></>
                              )
                           )}
                        </SpaceView>
                     ))}                     
                  </>
                  ) : (
                  <>
                     <View><CommonText>내가 받은 관심이 없습니다.</CommonText></View>
                  </>
                  )}

                  {/* <View style={styles.halfItemLeft}>
                     <View style={styles.favoriteBox}>
                        <View style={styles.posTopRight}>
                           <Image source={ICON.like} style={styles.iconSize32} />
                        </View>
                        <Image source={IMAGE.main} style={styles.favoriteImg} />
                        <LinearGradient
                           colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                           style={styles.dim}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 1, y: 1 }}
                        />
                        <View style={styles.posBottomLeft}>
                           <CommonText fontWeight={'700'} color={ColorType.white}>
                              D-1
                           </CommonText>

                        </View>
                     </View>
                  </View>
                  <View style={styles.halfItemLeft}>
                     <View style={styles.favoriteBox}>
                        <View style={styles.posTopRight}>
                           <Image source={ICON.like} style={styles.iconSize32} />
                        </View>
                        <Image source={IMAGE.main} style={styles.favoriteImg} />
                        <LinearGradient
                           colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                           style={styles.dim}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 1, y: 1 }}
                        />
                        <View style={styles.posBottomLeft}>
                           <CommonText fontWeight={'700'} color={ColorType.white}>
                              D-1
                           </CommonText>

                        </View>
                     </View>
                  </View> */}

                  {!btnStatus && (
                     <>
                        <SpaceView mb={16} viewStyle={styles.halfContainer}>
                           <View style={styles.halfItemLeft}>
                              <View style={styles.favoriteBox}>
                                 <View style={styles.posTopRight}>
                                    <Image source={ICON.like} style={styles.iconSize32} />
                                 </View>
                                 <Image source={IMAGE.main} style={styles.favoriteImg} />
                                 <LinearGradient
                                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                                    style={styles.dim}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                 />
                                 <View style={styles.posBottomLeft}>
                                    <CommonText fontWeight={'700'} color={ColorType.white}>
                                       D-1
                                    </CommonText>
                                 </View>
                              </View>
                           </View>
                           <View style={styles.halfItemRight}>
                              <View style={styles.favoriteBox}>
                                 <View style={styles.posTopRight}>
                                    <Image source={ICON.like} style={styles.iconSize32} />
                                 </View>
                                 <Image source={IMAGE.main} style={styles.favoriteImg} />
                                 <LinearGradient
                                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                                    style={styles.dim}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                 />
                                 <View style={styles.posBottomLeft}>
                                    <CommonText fontWeight={'700'} color={ColorType.white}>
                                       D-2
                                    </CommonText>
                                 </View>
                              </View>
                           </View>
                        </SpaceView>
                        <SpaceView mb={16} viewStyle={styles.halfContainer}>
                           <View style={styles.halfItemLeft}>
                              <View style={styles.favoriteBox}>
                                 <View style={styles.posTopRight}>
                                    <Image source={ICON.royalpass} style={styles.iconSize32} />
                                 </View>
                                 <Image source={IMAGE.main} style={styles.favoriteImg} />
                                 <LinearGradient
                                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                                    style={styles.dim}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                 />
                                 <View style={styles.posBottomLeft}>
                                    <CommonText fontWeight={'700'} color={ColorType.white}>
                                       D-3
                                    </CommonText>
                                 </View>
                              </View>
                           </View>
                           <View style={styles.halfItemRight}>
                              <View style={styles.favoriteBox}>
                                 <View style={styles.posTopRight}>
                                    <Image source={ICON.royalpass} style={styles.iconSize32} />
                                 </View>
                                 <Image source={IMAGE.main} style={styles.favoriteImg} />
                                 <LinearGradient
                                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                                    style={styles.dim}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                 />
                                 <View style={styles.posBottomLeft}>
                                    <CommonText fontWeight={'700'} color={ColorType.white}>
                                       D-4
                                    </CommonText>
                                 </View>
                              </View>
                           </View>
                        </SpaceView>
                     </>
                  )}

                  {/* <TouchableOpacity style={styles.openCloseBtn} onPress={() => setBtnStatus(!btnStatus)}>
                     <SpaceView mr={4}>
                        <CommonText>{btnStatus ? '더보기' : '접기'}</CommonText>
                     </SpaceView>
                     <Image
                        source={ICON.arrRight}
                        style={[styles.iconSize, btnStatus ? styles.rotate90 : styles.rotateN90]}
                     />
                  </TouchableOpacity>
                  <SpaceView /> */}
               </View>
            </SpaceView>

            {/* ################################################################
            ######################   내가 보낸 관심 목록 영역 ######################
            ################################################################ */}
            <SpaceView mb={32}>
               <SpaceView mb={16}>
                  <CommonText fontWeight={'700'} type={'h3'}>
                     내가 보낸 관심
                  </CommonText>
               </SpaceView>

               <SpaceView mb={16} viewStyle={styles.rowStyle}>
                  <CommonText fontWeight={'500'}>찐심만 보기</CommonText>
                  <CommonSwich
                     callbackFn={(value:boolean) => { specialInterestFn('REQ', value ? 'Y' : 'N'); }} 
                     isOn={false} />
               </SpaceView>

               <View>
                  {data.reqLikeList.length > 0 && (!isReqSpecialVisible || isReqSpecialVisible && data.reqSpecialCnt > 0) ? (
                  <>
                     {data.reqLikeList.map((item:any,index:any) => (
                        <SpaceView key={index} mb={16} viewStyle={styles.halfContainer}>
                           {item.map((
                              { 
                                 match_seq
                                 , res_member_seq
                                 , img_path, dday
                                 , special_interest_yn
                                 , res_profile_open_yn
                              } : { 
                                 match_seq:any
                                 , res_member_seq: any
                                 , img_path: any
                                 , dday: any
                                 , special_interest_yn: any
                                 , res_profile_open_yn: any
                              }) =>   

                              !isReqSpecialVisible || (isReqSpecialVisible && special_interest_yn == 'Y') ? (

                                 <TouchableOpacity onPress={() => { popupProfileOpen(match_seq, res_member_seq, 'RES', res_profile_open_yn); }} >

                                    <View key={match_seq} style={styles.halfItemLeft}>
                                       <View style={styles.favoriteBox}>

                                          {/* 관심/찐심 구분 아이콘 */}
                                          <View style={styles.posTopRight}>
                                             {special_interest_yn != '' && special_interest_yn == 'Y' ? (
                                                <Image source={ICON.royalpass} style={styles.iconSize32} />
                                             ) : (
                                                <Image source={ICON.like} style={styles.iconSize32} />
                                             )}
                                          </View>

                                          {/* 썸네일 이미지 */}
                                          <Image source={{ uri: img_path !== "" ? img_path : undefined }} style={styles.favoriteImg} />

                                          {/* 썸네일 이미지 그라데이션 효과 */}
                                          <LinearGradient
                                             colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                                             style={styles.dim}
                                             start={{ x: 0, y: 0 }}
                                             end={{ x: 1, y: 1 }}
                                          />

                                          {/* 보관 기간 표시 */}
                                          <View style={styles.posBottomLeft}>
                                             <CommonText fontWeight={'700'} color={ColorType.white}>
                                                D-{dday}
                                             </CommonText>
                                          </View>
                                       </View>
                                    </View>   
                                    
                                 </TouchableOpacity>
                              ) : (
                                 <></>
                              )
                           )}
                        </SpaceView>
                     ))}                     
                  </>
                  ) : (
                  <>
                     <View><CommonText>내가 보낸 관심이 없습니다.</CommonText></View>
                  </>
                  )}


                  


                  {!btnStatus1 && (
                     <SpaceView mb={16} viewStyle={styles.halfContainer}>
                        <View style={styles.halfItemLeft}>
                           <View style={styles.favoriteBox}>
                              <View style={styles.posTopRight}>
                                 <Image source={ICON.like} style={styles.iconSize32} />
                              </View>
                              <Image source={IMAGE.main} style={styles.favoriteImg} />
                              <LinearGradient
                                 colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                                 style={styles.dim}
                                 start={{ x: 0, y: 0 }}
                                 end={{ x: 1, y: 1 }}
                              />
                              <View style={styles.posBottomLeft}>
                                 <CommonText fontWeight={'700'} color={ColorType.white}>
                                    D-1
                                 </CommonText>
                              </View>
                           </View>
                        </View>
                        <View style={styles.halfItemRight}>
                           <View style={styles.favoriteBox}>
                              <View style={styles.posTopRight}>
                                 <Image source={ICON.like} style={styles.iconSize32} />
                              </View>
                              <Image source={IMAGE.main} style={styles.favoriteImg} />
                              <LinearGradient
                                 colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                                 style={styles.dim}
                                 start={{ x: 0, y: 0 }}
                                 end={{ x: 1, y: 1 }}
                              />
                              <View style={styles.posBottomLeft}>
                                 <CommonText fontWeight={'700'} color={ColorType.white}>
                                    D-2
                                 </CommonText>
                              </View>
                           </View>
                        </View>
                     </SpaceView>
                  )}

                  {/* <TouchableOpacity style={styles.openCloseBtn} onPress={() => setBtnStatus1(!btnStatus1)}>
                  <SpaceView mr={4}>
                     <CommonText>{btnStatus1 ? '더보기' : '접기'}</CommonText>
                  </SpaceView>
                  <Image
                     source={ICON.arrRight}
                     style={[styles.iconSize, btnStatus1 ? styles.rotate90 : styles.rotateN90]}
                  />
                  </TouchableOpacity>
                  <SpaceView /> */}

               </View>

            </SpaceView>

            {/* ################################################################
            ######################   성공 매칭 목록 영역 ######################
            ################################################################ */}
            <SpaceView mb={40}>
               <SpaceView mb={16}>
                  <CommonText fontWeight={'700'} type={'h3'}>
                     성공 매칭
                  </CommonText>
               </SpaceView>

               <SpaceView mb={16} viewStyle={styles.rowStyle}>
                  <CommonText fontWeight={'500'}>찐심만 보기</CommonText>
                  <CommonSwich
                     callbackFn={(value:boolean) => { specialInterestFn('MATCH', value ? 'Y' : 'N'); }} 
                     isOn={false} />
               </SpaceView>

               <View>
                  {data.matchTrgtList.length > 0 && (!isMatchSpecialVisible || isMatchSpecialVisible && data.matchSpecialCnt > 0) ? (
                  <>
                  {data.matchTrgtList.map((item:any,index:any) => (
                     <SpaceView key={index} mb={16} viewStyle={styles.halfContainer}>
                        {item.map(({ 
                           match_seq
                           , req_member_seq
                           , res_member_seq
                           , img_path, dday
                           , special_interest_yn 
                        } : { 
                           match_seq:any
                           , req_member_seq: any
                           , res_member_seq: any
                           , img_path: any
                           , dday: any
                           , special_interest_yn:any 
                        }) =>
                           
                           !isMatchSpecialVisible || (isMatchSpecialVisible && special_interest_yn == 'Y') ? (

                              <TouchableOpacity 
                                 onPress={() => { 
                                    if(req_member_seq != memberSeq) {
                                       popupProfileOpen(match_seq, req_member_seq, 'MATCH', 'Y'); 
                                    } else {
                                       popupProfileOpen(match_seq, res_member_seq, 'MATCH', 'Y'); 
                                    }
                                 }} >

                                 <View key={match_seq} style={styles.halfItemLeft}>
                                    <View style={styles.favoriteBox}>

                                       {/* 관심/찐심 구분 아이콘 */}
                                       <View style={styles.posTopRight}>
                                          {special_interest_yn != '' && special_interest_yn == 'Y' ? (
                                             <Image source={ICON.royalpass} style={styles.iconSize32} />
                                          ) : (
                                             <Image source={ICON.like} style={styles.iconSize32} />
                                          )}
                                       </View>

                                       {/* 썸네일 이미지 */}
                                       <Image source={{ uri: img_path !== "" ? img_path : undefined }} style={styles.favoriteImg} />

                                       {/* 썸네일 이미지 그라데이션 효과 */}
                                       <LinearGradient
                                          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                                          style={styles.dim}
                                          start={{ x: 0, y: 0 }}
                                          end={{ x: 1, y: 1 }}
                                       />

                                       {/* 보관 기간 표시 */}
                                       {/* <View style={styles.posBottomLeft}>
                                          <CommonText fontWeight={'700'} color={ColorType.white}>
                                             D-{dday}
                                          </CommonText>
                                       </View> */}
                                    </View>
                                 </View>
                              </TouchableOpacity>

                           ) : (
                              <></>
                           )
                        )}
                     </SpaceView>
                  ))}                     
                  </>
                  ) : (
                  <>
                     <View><CommonText>성공 매칭이 없습니다.</CommonText></View>
                  </>
                  )}

               </View>

            </SpaceView>
         </ScrollView>



         {/* ###############################################
                        프로필 열람 팝업
            ############################################### */}
         <Modal visible={profileOpenPopup} transparent={true}>
            <View style={modalStyle.modalBackground}>
               <View style={modalStyle.modalStyle1}>
                  <SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
                     <CommonText fontWeight={'700'} type={'h4'}>
                        프로필 열람
                     </CommonText>
                  </SpaceView>

                  <SpaceView viewStyle={layoutStyle.alignCenter}>
                     <CommonText type={'h5'}>패스를 소모하여 프로필을 열람하시겠습니까?</CommonText>
                     <CommonText type={'h5'} color={ColorType.red}>패스 x5</CommonText>
                  </SpaceView>

                  <View style={modalStyle.modalBtnContainer}>
                     <TouchableOpacity
                        style={modalStyle.modalBtn}
                        onPress={() => setProfileOpenPopup(false)}
                     >
                        <CommonText fontWeight={'500'}>취소</CommonText>
                     </TouchableOpacity>
                     <View style={modalStyle.modalBtnline} />
                     <TouchableOpacity style={modalStyle.modalBtn} onPress={() => goProfileOpen() }>
                        <CommonText fontWeight={'500'} color={ColorType.red}>
                           확인
                        </CommonText>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>


      </>
   );
};