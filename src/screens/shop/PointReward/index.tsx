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


export default function PointReward(element) {

  //const { prod_seq, modify_seq } = useRoute().params;

  const PAY_INFO = {
    member_buy_price: element.route.params.member_buy_price
    , target_buy_price: element.route.params.target_buy_price
    , price_persent: element.route.params.price_persent
    , tmplt_name: element.route.params.tmplt_name
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onPressGetReward = async (event_tmplt_seq: string) => {
    console.log('event_tmplt_seq :::: ' , event_tmplt_seq);

    const body = {
      event_tmplt_seq: event_tmplt_seq
    };
    try {
      const { success, data } = await cashback_item_receive(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            setIsModalOpen(true);
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
        /* show({
          content: '오류입니다. 관리자에게 문의해주세요.' ,
          confirmCallback: function() {}
        }); */
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }    
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const [tmplList, setTmplList] = useState(TMPL_LIST);

  useEffect(() => {
    const getCashBackPayInfo = async () => {
      const { success, data } = await get_cashback_detail_info();
      console.log('data.result :::: ', data);
      if (success) {
        setTmplList(data.result);
      }
    };
    
    getCashBackPayInfo();
  }, []);

  return (
    <View style={styles.container}>
      <CommonHeader title="리미티드 포인트 보상" right={<Wallet />} />
      <ScrollView style={styles.scroll}>
        <View style={styles.inner}>
          <View style={styles.gradeContainer}>
            <Text style={styles.gradeText}>{PAY_INFO?.tmplt_name}</Text>
          </View>
          <View style={styles.rankBox}>
            <Text style={styles.rankText}>RANK</Text>
          </View>
          {/* <Text style={styles.accReward}>누적보상 50,000</Text> 
          <Text style={styles.lmitPoint}>리미티드 포인트</Text>*/}
        </View>

        <View>
          <View>
            {/* <Text style={male.pointText}>
              리미티드 포인트 <Text>✌️</Text>
            </Text> */}
            <Text style={male.infoText}>
              즐거운 <Text style={male.cashbackText}>캐시백</Text> 생활 {CommaFormat(PAY_INFO?.member_buy_price)} /
              {CommaFormat(PAY_INFO?.target_buy_price)}
            </Text>
          </View>
          <Slider
            value={PAY_INFO?.price_persent}
            animateTransitions={true}
            renderThumbComponent={() => null}
            maximumTrackTintColor={ColorType.purple}
            minimumTrackTintColor={ColorType.purple}
            containerStyle={male.sliderContainer}
            trackStyle={male.sliderTrack}
            trackClickable={false}
            disabled
          />
        </View>
        
        {/* <View style={styles.buttonContainer}>
          <Text style={styles.hintText}>LIMIT 해제완료</Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>터치하고 보상받기</Text>
          </TouchableOpacity>
        </View> */}

        <View style={{ marginTop: 20 }}>

          {tmplList?.map((item) => (
            <View style={styles.itemContainer}>
              <Text style={styles.gradeText2}>{item.tmplt_name}</Text>
              <View style={styles.row}>
                <Image source={ICON.currency} />
                <Text style={styles.rowText}>{item.item_name}</Text>
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
                

              {
                item.receive_flag == 'Y' ? (
                  <Text style={styles.completeText}>보상 완료!</Text>
                ) : item.target_buy_price > item.member_buy_price ? (
                  <Text style={styles.moreText}>포인트 모으기</Text>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.rewardButton}
                    onPress={() => {onPressGetReward(item.event_tmplt_seq);}}
                  >
                    <Text style={styles.rewardButtonText}>보상받기</Text>
                  </TouchableOpacity>
                )
              }
			  
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
      <Modal isVisible={isModalOpen} style={styles.modalStyle}>
        <View style={styles.modalContainer}>
          {/* 아이콘 나오면 넣어야함 */}
          <Image style={styles.modalIcon} />
          <Text style={styles.normalText}>
            리미티드 <Text style={styles.boldText}>보상획득</Text>
          </Text>
          <Text style={styles.infoText}>
            리미티드 포인트 A등급 보상을 획득하셨습니다.
          </Text>
          <TouchableOpacity style={styles.confirmButton} onPress={closeModal}>
            <Text style={{ color: Color.gray6666 }}>확인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            {/* close 검정버튼 나오면 교체 */}
            <Image source={ICON.close} style={styles.closeImage} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
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

const styles = StyleSheet.create({
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
    flexDirection: 'column',
    alignItems: `center`,
    justifyContent: `center`,
  },
  gradeContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  gradeText: {
    fontSize: 72,
    color: Color.purple,
    fontWeight: 'bold',
  },
  rankBox: {
    borderRadius: 10,
    borderColor: Color.grayDDDD,
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  rankText: {
    fontSize: 10,
    color: Color.grayAAAA,
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
    justifyContent: `space-between`,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  gradeText2: {
    fontSize: 14,
    color: Color.gray8888,
  },
  row: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  rowText: {
    marginLeft: 4,
    fontSize: 14,
    color: Color.gray8888,
  },
  completeText: {
    fontSize: 14,
    color: Color.gray8888,
    fontWeight: 'bold',
  },
  rewardButton: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: Color.purple,
  },
  rewardButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
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
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
    color: Color.grayAAAA,
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
    height: 14,
    borderRadius: 13,
    backgroundColor: ColorType.primary,
  },
  sliderTrack: {
    height: 14,
    borderRadius: 13,
    backgroundColor: ColorType.grayDDDD,
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
