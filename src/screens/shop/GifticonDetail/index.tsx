import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import React from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Barcode from '@kichiyaki/react-native-barcode-generator';

export default function GifticonDetail() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <CommonHeader title="기프티콘 정보" />
      <View style={styles.thumb} />
      <View style={styles.nameWrap}>
        <Text style={styles.nameText}>이마트금액권 1만원</Text>
      </View>
      <View style={styles.padding}>
        <Barcode
          format="CODE128B"
          value="8591 5098 2744 9668"
          text="8591 5098 2744 9668"
          maxWidth={Dimensions.get('window').width - 40}
        />
        <TouchableOpacity style={styles.copyButton}>
          <Text style={styles.copyText}>번호복사</Text>
        </TouchableOpacity>
        <Text>
          {`
[상품명] 이마트금액권 1만원

[상품설명] 이마트금액권 1만원

[이용안내]

*본 상품은 발송 후 번호변경 발송이 불가합니다.
*본 상품은 1회 최대 발송 가능 수량이 999개입니다. 대량 발송 시 유의하여 주시기 바랍니다.
* 상품권 카테고리 內 상품의 경우, 신용카드로 결제 시 월 100만원까지 구매 가능합니다. (*카드사별 동일 명의자 기준)
*상품권 대량 구매를 원하시는 기업회원의 경우, 고객센터 > 1:1 문의로 문의하여 주시기 바랍니다.
- 교환 유효기간은 발행일로부터 30일입니다.
- 유효기간 만료 시 결제금액의 90% 환불만 가능 (기간연장 불가)

[사용처]
※ GS칼텍스 주유소/충전소 또는 GS25편의점 또는 GS THE FRESH 또는 GS SHOP 또는 이마트에서 사용 가능(택1)
- GS칼텍스 사용처: 전국 GS칼텍스 주유소/충전소(일부매장 제외) - GS25 사용처: 전국 GS25 편의점(군부대 PX점포 및 고속도로 휴게소 점포 등 특수 점포 제외)
- GS THE FRESH 사용처: 전국 GS THE FRESH 오프라인 매장 (온라인몰 사용 불가)
- GS SHOP 사용처: GS SHOP WEB/APP
- 이마트 사용처: 전국 이마트 상품권 교환 KIOSK에서 교환 가능(백화점 제외)

[사용처별 유의사항]
- http://bit.ly/3O8L28s`}
        </Text>
        <View style={{ height: 50 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width * 2) / 3,
    backgroundColor: Color.grayF8F8,
  },
  nameWrap: {
    width: '100%',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginTop: 20,
  },
  nameText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
  },
  padding: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  copyButton: {
    backgroundColor: Color.primary,
    width: `100%`,
    height: 35,
    borderRadius: 5,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginTop: 10,
  },
  copyText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 32,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
});
