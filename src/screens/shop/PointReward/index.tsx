import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import React, { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ICON } from 'utils/imageUtils';
import Modal from 'react-native-modal';
import { Wallet } from 'component/TopNavigation';
import { get_cashback_detail_info, cashback_item_receive } from 'api/models';
import { Slider } from '@miblanchard/react-native-slider';
import { ColorType, ScreenNavigationProp } from '@types';
import { CommaFormat } from 'utils/functions';
import { SUCCESS } from 'constants/reusltcode';
import { usePopup } from 'Context';
import { CommonLoading } from 'component/CommonLoading';
import { layoutStyle } from 'assets/styles/Styles';
import LinearGradient from 'react-native-linear-gradient';


export default function PointReward(element) {

  const PAY_INFO = {
    member_buy_price: 0
    , target_buy_price: 0
    , price_persent: 0
    , tmplt_name: ''
    , tmplt_level: 1
  };

  const { show } = usePopup(); // 공통 팝업
  const [isLoading, setIsLoading] = useState(false);

  const [payInfo, setPayInfo] = useState(PAY_INFO);
  const [tmplList, setTmplList] = useState(TMPL_LIST);

  //const { prod_seq, modify_seq } = useRoute().params;

  /* const PAY_INFO = {
    member_buy_price: element.route.params.member_buy_price
    , target_buy_price: element.route.params.target_buy_price
    , price_persent: element.route.params.price_persent
    , tmplt_name: element.route.params.tmplt_name
    , tmplt_level: element.route.params.tmplt_level
  }; */

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onPressGetReward = async (event_tmplt_seq: string, item_name: string) => {
    setIsLoading(true);

    const body = {
      event_tmplt_seq: event_tmplt_seq
    };
    try {
      const { success, data } = await cashback_item_receive(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            setIsLoading(false);

            show({
              title: '보상획득',
              content: '리미티드 포인트' + item_name + '등급 보상을 획득하셨습니다.',
              confirmCallback: function() {
                getCashBackPayInfo();
              }
            });

            //setIsModalOpen(true);
            //navigation.navigate(STACK.TAB, { screen: 'Shop' });
            break;
          default:
            /* show({
              content: '오류입니다. 관리자에게 문의해주세요.' ,
              confirmCallback: function() {}
            }); */
            break;
        }
      } else {
        setIsLoading(false);
        /* show({
          content: '오류입니다. 관리자에게 문의해주세요.' ,
          confirmCallback: function() {}
        }); */
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }    
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getCashBackPayInfo = async () => {
    const { success, data } = await get_cashback_detail_info();
    console.log('data.result :::: ', data);
    if (success) {

      let lettmpltName = data?.pay_info.tmplt_name;
      let mbrPrice = data?.pay_info.member_buy_price;
      let trgtPrice = data?.pay_info.target_buy_price;
      let level = data?.pay_info.tmplt_level;

      let percent = (mbrPrice*100) / trgtPrice;
      if(percent > 0) {
        percent = percent / 100; 
      }

      setPayInfo({
        member_buy_price: mbrPrice
        , target_buy_price: trgtPrice
        , price_persent: percent
        , tmplt_name: lettmpltName.replace(/(\s*)/g, "")
        , tmplt_level: level
      });

      //setPayInfo(data.pay_info)
      setTmplList(data.tmpl_list);
    }
  };

  useEffect(() => {
    getCashBackPayInfo();
  }, []);

  return (
    <>
      {isLoading && <CommonLoading />}

      <View style={_styles.container}>
        <CommonHeader title="리미티드 포인트 보상" right={<Wallet />} />

        <ScrollView style={_styles.scroll}>
          
          <View style={_styles.inner}>
            <View style={_styles.innerArea01}>
              <Text style={_styles.innerText01}>상품을 구입하면{'\n'}리미티드 포인트가 충전돼요.</Text>
              <Text style={_styles.innerText02}>충전 등급이 올라가면 캐시백 보상이 지급됩니다.</Text>
            </View>

            <View>
              <View style={_styles.gradeContainer}>
                <Text style={_styles.gradeText}>{payInfo?.tmplt_name}</Text>
              </View>
              <View style={_styles.rankBox}>
                <Text style={_styles.rankText}>RANK</Text>
              </View>
            </View>
            {/* <Text style={styles.accReward}>누적보상 50,000</Text> 
            <Text style={styles.lmitPoint}>리미티드 포인트</Text>*/}
          </View>

          <View style={{marginTop: 10}}>
            <View>
              <LinearGradient
                colors={['#7986EE', '#8854D2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={_styles.gradient(payInfo?.price_persent)}>
              </LinearGradient>

              <Slider
                  //value={PAY_INFO?.price_persent}
                  animateTransitions={true}
                  renderThumbComponent={() => null}
                  //maximumTrackTintColor={ColorType.purple}
                  maximumTrackTintColor={'transparent'}
                  minimumTrackTintColor={'transparent'}
                  containerStyle={male.sliderContainer}
                  trackStyle={male.sliderTrack}
                  trackClickable={false}
                  disabled
                />
            </View>
            <View>
              {/* <Text style={male.pointText}>
                리미티드 포인트 <Text>✌️</Text>
              </Text> */}
              <Text style={male.infoText}>
                캐시백 보상까지 {CommaFormat(payInfo?.member_buy_price)} / {CommaFormat(payInfo?.target_buy_price)}
              </Text>
            </View>
          </View>
          
          {/* <View style={styles.buttonContainer}>
            <Text style={styles.hintText}>LIMIT 해제완료</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>터치하고 보상받기</Text>
            </TouchableOpacity>
          </View> */}

          <View style={{ marginTop: 20 }}>

            {tmplList?.map((item) => (
              <View style={_styles.itemContainer}>
                <View style={{width: '10%'}}>
                  <Text style={_styles.gradeText2}>{item.tmplt_name}</Text>
                </View>
                <View style={[_styles.row, {width: '65%'}]}>
                  <Image source={ICON.royalPassCircle} style={{width: 30, height: 30, marginTop: 6}} />
                  <Text style={_styles.rowText}>{item.item_name}</Text>
                </View>
                {/* <View style={styles.row}>
                  <Image source={ICON.ticket} />
                  <Text style={styles.rowText}>{item.ticket}</Text>
                </View> */}
                {/* {item.isComplete ? (
                  <Text style={styles.completeText}>보상 완료!</Text>
                ) : item.isNext ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.rewardButton}
                    onPress={onPressGetReward}
                  >
                    <Text style={styles.rewardButtonText}>보상받기</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.moreText}>포인트 모으기</Text>
                )} */}
                  
                <View style={{width: '30%', justifyContent: 'center', alignItems: 'center'}}>
                  {
                    item.receive_flag == 'Y' ? (
                      <Text style={_styles.completeText}>보상완료!</Text>
                    ) : item.target_buy_price > item.member_buy_price ? (
                      <Text style={_styles.moreText}>진행중</Text>
                    ) : (
                      <>
                        {payInfo?.tmplt_level < item.tmplt_level ? (
                          <TouchableOpacity activeOpacity={0.8} style={[_styles.rewardButton, {backgroundColor: Color.gray8888}]}>
                            <Text style={_styles.rewardButtonText}>보상받기!</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={_styles.rewardButton}
                            onPress={() => {onPressGetReward(item.event_tmplt_seq, item.tmplt_name);}}>
                            
                            <Text style={_styles.rewardButtonText}>보상받기!</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )
                  }
                </View>
              </View>
            ))}

            {/* {dummy?.map((item) => (
              <View style={styles.itemContainer}>
                <Text style={styles.gradeText2}>{item.grade}</Text>
                <View style={styles.row}>
                  <Image source={ICON.currency} />
                  <Text style={styles.rowText}>{item.reward}</Text>
                </View>
                <View style={styles.row}>
                  <Image source={ICON.ticket} />
                  <Text style={styles.rowText}>{item.ticket}</Text>
                </View>
                {item.isComplete ? (
                  <Text style={styles.completeText}>보상 완료!</Text>
                ) : item.isNext ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.rewardButton}
                    onPress={onPressGetReward}
                  >
                    <Text style={styles.rewardButtonText}>보상받기</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.moreText}>포인트 모으기</Text>
                )}
              </View>
            ))} */}
          </View>
        </ScrollView>

        <Modal isVisible={isModalOpen} style={_styles.modalStyle}>
          <View style={_styles.modalContainer}>
            {/* 아이콘 나오면 넣어야함 */}
            <Image style={_styles.modalIcon} />
            <Text style={_styles.normalText}>
              리미티드 <Text style={_styles.boldText}>보상획득</Text>
            </Text>
            <Text style={_styles.infoText}>
              리미티드 포인트 A등급 보상을 획득하셨습니다.
            </Text>
            <TouchableOpacity style={_styles.confirmButton} onPress={closeModal}>
              <Text style={{ color: Color.gray6666 }}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={_styles.closeButton} onPress={closeModal}>
              {/* close 검정버튼 나오면 교체 */}
              <Image source={ICON.close} style={_styles.closeImage} />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </>
  );
}

// 이벤트 템플릿 목록
const TMPL_LIST = [
  {
    tmplt_level: ''
    , tmplt_name: ''
    , item_name: ''
    , target_buy_price: 0
    , buy_price: 0
    , receive_flag: 'N'
  }
];





{/* ################################################################################################################
############### Style 영역
################################################################################################################ */}

const _styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: `center`,
    justifyContent: `space-between`,
  },
  innerArea01: {
    //marginTop: 65,
  },
  innerText01: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 22,
    color: '#333333',
    lineHeight: 27,
    marginBottom: 5,
  },
  innerText02: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 14,
    color: '#9D9D9D',
  },
  gradeContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  gradeText: {
    fontSize: 100,
    //color: Color.purple,
    color: '#8657D4',
    fontWeight: 'bold',
  },
  rankBox: {
    borderRadius: 15,
    borderColor: Color.grayDDDD,
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 14,
    marginTop: -13,
  },
  rankText: {
    fontSize: 12,
    color: Color.grayAAAA,
    textAlign: 'center',
  },
  accReward: {
    color: Color.gray8888,
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  lmitPoint: {
    color: 'black',
    marginTop: 6,
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    width: `100%`,
    flexDirection: 'column',
    justifyContent: `center`,
  },
  hintText: {
    color: Color.grayAAAA,
    fontSize: 10,
  },
  buttonStyle: {
    backgroundColor: Color.primary,
    width: `100%`,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  itemContainer: {
    width: `100%`,
    borderTopWidth: 1,
    borderTopColor: Color.grayDDDD,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  gradeText2: {
    fontSize: 14,
    color: Color.gray8888,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rowText: {
    marginLeft: 2,
    fontSize: 14,
    color: '#383838',
  },
  completeText: {
    fontSize: 14,
    color: Color.gray8888,
    fontWeight: 'bold',
  },
  rewardButton: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#8854D2',
  },
  rewardButtonText: {
    color: 'white',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 15,
  },
  moreText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalStyle: {
    margin: 0,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  modalContainer: {
    width: '80%',
    minHeight: '30%',
    flexDirection: 'column',
    alignItems: `center`,
    justifyContent: `center`,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  modalIcon: {
    width: 100,
    height: 100,
    borderWidth: 1,
  },
  normalText: {
    marginTop: 15,
    fontWeight: '600',
    fontSize: 16,
  },
  boldText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 10,
    color: Color.grayAAAA,
  },
  confirmButton: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Color.grayDDDD,
    paddingVertical: 8,
    paddingHorizontal: 40,
    marginTop: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  closeImage: {
    backgroundColor: 'black',
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  rewardDescArea: {
    flexDirection: 'row'
  },

  /* gradient: {
    position: 'absolute',
    width: '70%',
    height: 20,
    zIndex: 1,
    borderRadius: 20,
  }, */

  gradient: (value:any) => {
    console.log('value :::::: ' , value);
    let percent = 0;

    if(value != null && typeof value != 'undefined') {
      percent = value * 100;
    };

    return {
      position: 'absolute',
      width: percent + '%',
      height: 20,
      zIndex: 1,
      borderRadius: 20,
    };
  },
});

const male = StyleSheet.create({
  floatWrapper: {
    width: `100%`,
    marginTop: -60,
  },
  floatContainer: {
    position: 'relative',
    padding: 25,
    backgroundColor: 'white',
    width: '100%',
    height: 120,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    justifyContent: 'space-around',
  },
  pointText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
  },
  infoText: {
    marginTop: 15,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
    color: Color.grayAAAA,
    textAlign: 'right',
  },
  cashbackText: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
    color: Color.primary,
  },
  sliderContainer: {
    width: '100%',
    marginTop: 8,
    height: 4,
    borderRadius: 13,
    backgroundColor: '#E1E4FB',
  },
  sliderTrack: {
    height: 23,
    borderRadius: 13,
    //backgroundColor: ColorType.grayDDDD,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  TooltipButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  imageTooltip: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});






























const dummy = [
  {
    grade: 'E',
    reward: 50,
    ticket: 2,
    isComplete: true,
    isNext: false,
  },
  {
    grade: 'D',
    reward: 50,
    ticket: 2,
    isComplete: true,
    isNext: false,
  },
  {
    grade: 'C',
    reward: 50,
    ticket: 2,
    isComplete: true,
    isNext: false,
  },
  {
    grade: 'B',
    reward: 50,
    ticket: 2,
    isComplete: true,
    isNext: false,
  },
  {
    grade: 'A',
    reward: 50,
    ticket: 2,
    isComplete: false,
    isNext: true,
  },
  {
    grade: 'S',
    reward: 50,
    ticket: 2,
    isComplete: false,
    isNext: false,
  },
];
