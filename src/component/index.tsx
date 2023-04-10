import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import * as React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import { BarGrap } from './BarGrap';
import { CommonBtn } from './CommonBtn';
import CommonHeader from './CommonHeader';
import SpaceView from './SpaceView';
import { CommonCheckBox } from './CommonCheckBox';
import { CommonDatePicker } from './CommonDatePicker';
import { CommonInput } from './CommonInput';
import { CommonSelect } from './CommonSelect';
import { CommonSwich } from './CommonSwich';
import { CommonText } from './CommonText';
import { ColorType } from '@types';
import { EventRow } from './EventRow';
import { MainProfileSlider, ProfileItem } from './MainProfileSlider';
import RatingStar from './RatingStar';
import TopNavigation from './TopNavigation';
import { ToolTip } from './Tooltip';
import { Modalize } from 'react-native-modalize';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from 'assets/styles/Color';
import { RadioCheckBox } from './RadioCheckBox';
import { ImagePicker } from './ImagePicker';

const Component = () => {
  const [popup1, setPopup1] = React.useState(false);
  const [text, setText] = React.useState('검색 글자');
  const modalizeRef = React.useRef<Modalize>(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  return (
    <>
      {/* 공통 헤더 */}
      <CommonHeader title={'공통헤더'} />
      <ScrollView style={styles.scrollContainer}>
        {/* 상단 네비게이션 */}
        <TopNavigation currentPath={''} />
        {/* 바 그래프 */}
        <SpaceView mb={24}>
          <BarGrap score={8} />
        </SpaceView>
        {/* 프로파일 뱃지 */}
        <SpaceView mb={16}>
          <View style={styles.halfContainer}>
            <TouchableOpacity style={styles.halfItemLeft}>
              <View style={styles.badgeBox}>
                <SpaceView mb={16}>
                  <Image source={ICON.asset} style={styles.iconSize40} />
                </SpaceView>

                <SpaceView mb={8}>
                  <View style={[layoutStyle.row, layoutStyle.alignCenter]}>
                    <CommonText fontWeight={'700'}>소득</CommonText>
                    <Image source={ICON.arrRight} style={styles.iconSize} />
                  </View>
                </SpaceView>

                <CommonText color={ColorType.gray6666} type={'h5'}>
                  프로필 2차 인증 위한{'\n'}
                  소득 설명 문구
                </CommonText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.halfItemRight}>
              <View style={styles.badgeBox}>
                <SpaceView mb={16}>
                  <Image source={ICON.income} style={styles.iconSize40} />
                </SpaceView>

                <SpaceView mb={8}>
                  <View style={[layoutStyle.row, layoutStyle.alignCenter]}>
                    <CommonText fontWeight={'700'}>자산</CommonText>
                    <Image source={ICON.arrRight} style={styles.iconSize} />
                  </View>
                </SpaceView>

                <CommonText color={ColorType.gray6666} type={'h5'}>
                  프로필 2차 인증 위한{'\n'}
                  자산 설명 문구
                </CommonText>
              </View>
            </TouchableOpacity>
          </View>
        </SpaceView>
        {/* 메인 프로파일 뱃지 */}
        <SpaceView mb={48}>
          <View style={[layoutStyle.rowBetween]}>
            <View style={styles.profileBox}>
              <Image source={ICON.asset} style={styles.iconSize48} />
              <CommonText type={'h5'}>자산</CommonText>
            </View>

            <View style={styles.profileBox}>
              <Image source={ICON.sns} style={styles.iconSize48} />
              <CommonText type={'h5'}>SNS</CommonText>
              <View style={styles.disabled} />
            </View>

            <View style={styles.profileBox}>
              <Image source={ICON.vehicle} style={styles.iconSize48} />
              <CommonText type={'h5'}>차량</CommonText>
            </View>
          </View>
        </SpaceView>
        {/* 임시 박스 */}
        <SpaceView mb={48} viewStyle={styles.halfContainer}>
          <View style={styles.halfItemLeft}>
            <View style={styles.tempBoxBig} />
          </View>

          <View style={styles.halfItemRight}>
            <SpaceView mb={16} viewStyle={layoutStyle.row}>
              <SpaceView mr={8}>
                <View style={styles.tempBoxSmall} />
              </SpaceView>
              <SpaceView ml={8}>
                <View style={styles.tempBoxSmall} />
              </SpaceView>
            </SpaceView>

            <SpaceView viewStyle={layoutStyle.row}>
              <SpaceView mr={8}>
                <View style={styles.tempBoxSmall} />
              </SpaceView>
              <SpaceView ml={8}>
                <View style={styles.tempBoxSmall} />
              </SpaceView>
            </SpaceView>
          </View>
        </SpaceView>
        {/* 이미지 추가 박스 큰것 */}
        <SpaceView mb={24}>
          <ImagePicker isBig={true} />
        </SpaceView>
        {/* 이미지 추가 박스 작은 것 */}
        <SpaceView mb={24}>
          <ImagePicker isBig={false} />
        </SpaceView>
        {/* 스크롤 박스 */}
        <SpaceView mb={40}>
          <ScrollView horizontal={true}>
            <SpaceView mr={16}>
              <View style={styles.tempBoxMiddle} />
            </SpaceView>
            <SpaceView mr={16}>
              <View style={styles.tempBoxMiddle} />
            </SpaceView>
            <SpaceView mr={16}>
              <View style={styles.tempBoxMiddle} />
            </SpaceView>
            <SpaceView mr={16}>
              <View style={styles.tempBoxMiddle} />
            </SpaceView>
            <SpaceView mr={16}>
              <View style={styles.tempBoxMiddle} />
            </SpaceView>
            <SpaceView mr={16}>
              <View style={styles.tempBoxMiddle} />
            </SpaceView>
          </ScrollView>
        </SpaceView>
        {/* 스크롤 서클 박스 */}
        <SpaceView mb={40}>
          <ScrollView horizontal={true}>
            <SpaceView viewStyle={styles.circleBox} mr={16} />
            <SpaceView viewStyle={styles.circleBox} mr={16} />
            <SpaceView viewStyle={styles.circleBox} mr={16} />
            <SpaceView viewStyle={styles.circleBox} mr={16} />
            <SpaceView viewStyle={styles.circleBox} mr={16} />
            <SpaceView viewStyle={styles.circleBox} mr={16} />
            <SpaceView viewStyle={styles.circleBox} mr={16} />
            <SpaceView viewStyle={styles.circleBox} mr={16} />
            <SpaceView viewStyle={styles.circleBox} />
          </ScrollView>
        </SpaceView>
        {/* 1자 rowStyle */}
        <SpaceView mb={40}>
          <TouchableOpacity style={styles.rowStyle}>
            <CommonText>내 선호 이성</CommonText>
            <Image source={ICON.arrRight} style={styles.iconSize} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowStyle}>
            <CommonText>내 계정 정보</CommonText>
            <Image source={ICON.arrRight} style={styles.iconSize} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowStyle}>
            <CommonText>이용약관</CommonText>
            <Image source={ICON.arrRight} style={styles.iconSize} />
          </TouchableOpacity>
          <View style={styles.rowStyle}>
            <ToolTip title={'내 프로필 공개'} desc={'내 프로필 공개'} />
            <CommonSwich />
          </View>
        </SpaceView>
        {/* favorite box */}
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
                  D-2
                </CommonText>
              </View>
            </View>
          </View>
        </SpaceView>
        {/* status 버튼 */}
        <SpaceView mb={40} viewStyle={layoutStyle.row}>
          <View style={styles.statusBtn}>
            <CommonText type={'h6'} color={ColorType.white}>
              ALL
            </CommonText>
          </View>
        </SpaceView>
        {/* purple box */}
        <SpaceView
          viewStyle={[styles.purpleContainer, layoutStyle.rowBetween]}
          mb={48}
        >
          <View>
            <CommonText fontWeight={'700'} color={ColorType.white}>
              추천 패키지
            </CommonText>
            <CommonText>300 패스 + 10 로얄패스</CommonText>
          </View>
          <View style={layoutStyle.rowCenter}>
            <SpaceView viewStyle={styles.whiteCircleBox30} mr={8}>
              <CommonText
                fontWeight={'700'}
                textStyle={styles.lineHeight16}
                type={'h6'}
                color={ColorType.white}
              >
                D.C {'\n'}30%
              </CommonText>
            </SpaceView>
            <CommonText fontWeight={'700'} color={ColorType.white} type={'h4'}>
              ₩9,900
            </CommonText>
          </View>
        </SpaceView>
        {/* gray dot text */}
        <SpaceView mb={60}>
          <SpaceView viewStyle={styles.dotTextContainer}>
            <View style={styles.dot} />
            <CommonText color={ColorType.gray6666}>
              모든 상품은 VAT 포함된 가격입니다.
            </CommonText>
          </SpaceView>
        </SpaceView>
        {/* 프로필 star box */}
        <SpaceView mb={16} viewStyle={styles.halfContainer}>
          <View
            style={[
              styles.halfItemLeft,
              styles.profileContainer,
              layoutStyle.alignCenter,
            ]}
          >
            <SpaceView mb={4}>
              <CommonText fontWeight={'700'} type={'h2'}>
                7.5
              </CommonText>
            </SpaceView>

            <SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
              <Image source={ICON.star} style={styles.iconSize24} />
              <Image source={ICON.star} style={styles.iconSize24} />
              <Image source={ICON.star} style={styles.iconSize24} />
              <Image source={ICON.starHalf} style={styles.iconSize24} />
              <Image source={ICON.starEmpty} style={styles.iconSize24} />
            </SpaceView>
            <ToolTip
              title={'기여 평점'}
              desc={'프로필 평점'}
              position={'bottomLeft'}
            />
          </View>

          <View
            style={[
              styles.halfItemRight,
              styles.profileContainer,
              layoutStyle.alignCenter,
            ]}
          >
            <SpaceView mb={4}>
              <CommonText fontWeight={'700'} type={'h2'}>
                7.5
              </CommonText>
            </SpaceView>

            <SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
              <Image source={ICON.star} style={styles.iconSize24} />
              <Image source={ICON.star} style={styles.iconSize24} />
              <Image source={ICON.star} style={styles.iconSize24} />
              <Image source={ICON.starHalf} style={styles.iconSize24} />
              <Image source={ICON.starEmpty} style={styles.iconSize24} />
            </SpaceView>
            <ToolTip
              position={'bottomRight'}
              title={'프로필 평점'}
              desc={'프로필 평점'}
            />
          </View>
        </SpaceView>
        {/* questioncontainer */}
        <SpaceView viewStyle={layoutStyle.rowCenter} mb={32}>
          <SpaceView viewStyle={styles.questionContainer} mr={16}>
            <CommonText textStyle={layoutStyle.textCenter}>
              첫번째 질문이에요{'\n'}
              질문에 성실하게 답해주세요
            </CommonText>
          </SpaceView>
          <Image source={ICON.refreshDark} style={styles.iconSize24} />
        </SpaceView>
        {/* 인터뷰 서치 인풋 */}
        <SpaceView viewStyle={layoutStyle.rowBetween} mb={24}>
          <SpaceView viewStyle={styles.searchInputContainer} mr={16}>
            <TextInput
              value={text}
              onChangeText={(e) => setText(e)}
              style={styles.searchInput}
              placeholder={'검색'}
              placeholderTextColor={Color.gray6666}
            />
            <View style={styles.searchInputIconContainer}>
              <Image source={ICON.searchGray} style={styles.iconSize24} />
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

          <View>
            <CommonText
              type={'h5'}
              textStyle={layoutStyle.lineFontGray}
              color={ColorType.gray6666}
            >
              편집
            </CommonText>
          </View>
        </SpaceView>
        <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
          <SpaceView viewStyle={styles.questionItemTextContainer}>
            <CommonText>새 질문1에 대답해주세요</CommonText>
          </SpaceView>

          <View style={styles.questionIconContainer}>
            <CommonSwich />
          </View>
        </SpaceView>
        <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
          <SpaceView viewStyle={styles.questionItemTextContainer}>
            <CommonText>새 질문1에 대답해주세요</CommonText>
          </SpaceView>

          <View style={styles.questionIconContainer}>
            <Image source={ICON.align} style={styles.iconSize24} />
          </View>
        </SpaceView>
        {/* 공통 버튼 */}
        <SpaceView mb={24}>
          <SpaceView mb={8}>
            <CommonBtn value={'기본버튼'} />
          </SpaceView>
          <SpaceView mb={8}>
            <CommonBtn value={'버튼1'} type={'primary'} />
          </SpaceView>
          <SpaceView mb={8}>
            <CommonBtn
              value={'카카오톡 열기'}
              type={'kakao'}
              icon={ICON.kakao}
              iconSize={24}
            />
          </SpaceView>
          <SpaceView mb={8}>
            <CommonBtn value={'신고'} icon={ICON.siren} iconSize={24} />
          </SpaceView>
          <SpaceView mb={8}>
            <CommonBtn
              value={'등록 및 수정'}
              height={48}
              type={'white'}
              icon={ICON.plus}
            />
          </SpaceView>
          <SpaceView>
            <CommonBtn
              type="purple"
              value="프로필 재심사"
              icon={ICON.refresh}
              iconSize={24}
              iconPosition={'right'}
            />
          </SpaceView>
        </SpaceView>
        {/* 공통 체크박스 */}
        <SpaceView mb={24}>
          <CommonCheckBox label={'체크박스'} />
        </SpaceView>
        {/* 공통 데이트 피커 */}
        <SpaceView mb={24}>
          <CommonDatePicker />
        </SpaceView>
        {/* 공통 인풋 */}
        <SpaceView mb={24}>
          <SpaceView mb={16}>
            <CommonInput label={'인풋 라벨'} />
          </SpaceView>
          <CommonInput label={'with pen'} rightPen={true} />
        </SpaceView>
        {/* 공통 select */}
        <SpaceView mb={24}>
          <CommonSelect label={'셀릭트 라벨'} />
        </SpaceView>
        {/* 공통 swich */}
        <SpaceView mb={24}>
          <CommonSwich />
        </SpaceView>
        {/* 공통 텍스트 */}
        <SpaceView mb={24}>
          <CommonText type={'h2'} color={ColorType.primary} fontWeight={'300'}>
            공통 텍스트
          </CommonText>
          <CommonText type={'h2'} color={ColorType.primary}>
            공통 텍스트
          </CommonText>
          <CommonText type={'h2'} color={ColorType.primary} fontWeight={'500'}>
            공통 텍스트
          </CommonText>
          <CommonText type={'h2'} color={ColorType.primary} fontWeight={'700'}>
            공통 텍스트
          </CommonText>
          <CommonText type={'h3'} color={ColorType.black2222}>
            공통 텍스트
          </CommonText>
          <CommonText type={'h4'} color={ColorType.gray6666}>
            공통 텍스트
          </CommonText>
          <CommonText type={'h5'} color={ColorType.gray8888}>
            공통 텍스트
          </CommonText>
          <CommonText type={'h6'} color={ColorType.grayAAAA}>
            공통 텍스트
          </CommonText>
        </SpaceView>
        {/* 이벤트 페이지 행 */}
        <SpaceView mb={24}>
          <EventRow label={'라벨'} title={'타이틀'} desc={'디스크립션'} />
        </SpaceView>
        {/* 이벤트 페이지 행 */}
        <SpaceView mb={24}>
          <SpaceView mb={24}>
            <MainProfileSlider />
          </SpaceView>
          <ProfileItem isOnlyProfileItem={true} />
        </SpaceView>
        {/* 별점 */}
        <SpaceView mb={24}>
          <RatingStar />
        </SpaceView>
        {/* 라디오박스 일자형 */}
        <RadioCheckBox
          items={[
            { label: '라디오박스', value: 'value' },
            { label: '라디오박스2', value: 'value2' },
            { label: '라디오박스3', value: 'value3' },
            { label: '라디오박스4', value: 'value4' },
            { label: '라디오박스5', value: 'value5' },
          ]}
        />
        {/* 클릭 시 나오는 툴팁 */}
        <SpaceView mb={124}>
          <ToolTip title={'타이틀'} desc={'설명'} />
          <ToolTip title={'아래 왼쪽'} desc={'설명'} position={'bottomLeft'} />
          <ToolTip
            title={'아래 오른쪽'}
            desc={'설명'}
            position={'bottomRight'}
          />
          <ToolTip title={'상단 왼쪽'} desc={'설명'} position={'topLeft'} />
          <ToolTip title={'상단 오른쪽'} desc={'설명'} position={'topRight'} />
        </SpaceView>
        <SpaceView mb={24}>
          <CommonBtn
            value={'모달라이즈 열기'}
            onPress={onOpen}
            type={'primary'}
          />
        </SpaceView>

        <SpaceView mb={124}>
          <CommonBtn
            value={'모달 열기'}
            onPress={() => setPopup1(true)}
            type={'primary'}
          />
        </SpaceView>

        {/* 메인 비쥬얼 슬라이드 */}
        {/* <SpaceView mb={120}>
					<SpaceView mb={40}>
						<ViualSlider />
					</SpaceView>

					<SpaceView mb={40}>
						<ViualSlider onlyImg={true} />
					</SpaceView>

					<SpaceView mb={40}>
						<ViualSlider isNew={true} status={'ing'} />
					</SpaceView>

					<SpaceView mb={40}>
						<ViualSlider isNew={true} status={'end'} />
					</SpaceView>
				</SpaceView> */}
        {/* 모달라이즈 */}
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={true}
          handleStyle={modalStyle.modalHandleStyle}
          modalStyle={modalStyle.modalContainer}
        >
          <View style={modalStyle.modalHeaderContainer}>
            <CommonText type={'h3'}>사용자 신고하기</CommonText>
            <TouchableOpacity onPress={onClose}>
              <Image source={ICON.xBtn} style={styles.iconSize24} />
            </TouchableOpacity>
          </View>

          <View style={modalStyle.modalBody}>
            <SpaceView mb={16}>
              <CommonText>신고 사유를 선택해주세요.</CommonText>
            </SpaceView>

            <SpaceView mb={24}>
              {[
                { text: '비속어 사용' },
                { text: '과도한 성적 표현' },
                { text: '불쾌감을 주는 표현' },
                { text: '성차별 적 표현' },
                { text: '기타' },
              ].map((i, index) => (
                <CommonCheckBox label={i.text} key={index + 'checkbox'} />
              ))}
            </SpaceView>

            <SpaceView mb={32}>
              <CommonBtn value={'취소'} />
            </SpaceView>
          </View>
        </Modalize>
        {/* 팝업 */}
        <Modal visible={popup1} transparent={true}>
          <View style={modalStyle.modalBackground}>
            <View style={modalStyle.modalStyle1}>
              <SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
                <CommonText type={'h4'}>찐심</CommonText>
              </SpaceView>

              <SpaceView viewStyle={layoutStyle.alignCenter}>
                <CommonText type={'h5'}>보유 찐심 [0]</CommonText>
              </SpaceView>

              <View style={modalStyle.modalBtnContainer}>
                <TouchableOpacity
                  style={modalStyle.modalBtn}
                  onPress={() => setPopup1(false)}
                >
                  <CommonText color={ColorType.gray8888}>취소</CommonText>
                </TouchableOpacity>
                <View style={modalStyle.modalBtnline} />
                <TouchableOpacity style={modalStyle.modalBtn}>
                  <CommonText color={ColorType.primary}>구매</CommonText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

export default Component;
