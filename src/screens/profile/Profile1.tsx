import { Slider } from '@miblanchard/react-native-slider';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '@types';
import { get_member_face_rank } from 'api/models';
import { Color } from 'assets/styles/Color';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import Interview from 'component/Interview';
import ProfileAuth from 'component/ProfileAuth';
import { usePopup } from 'Context';
import { useProfileImg } from 'hooks/useProfileImg';
import { useSecondAth } from 'hooks/useSecondAth';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ReactNativeModal from 'react-native-modal';
import { findSourcePath, ICON } from 'utils/imageUtils';

const options = {
  title: '이미지를 선택해 주세요.',
  type: 'library',
  options: {
    selectionLimit: 0,
    mediaType: 'photo',
    includeBase64: true,
    includeExtra: true,
  },
};

const { width } = Dimensions.get('window');
interface Props {
  navigation: StackNavigationProp<StackParamList, 'Profile1'>;
  route: RouteProp<StackParamList, 'Profile1'>;
}

export const Profile1 = (props: Props) => {
  const { show } = usePopup(); // 공통 팝업
  const secondAuth = useSecondAth();
  console.log(secondAuth);
  const myImages = useProfileImg();
  const [images, setImages] = useState([]);

  useEffect(() => {
    init();
  }, [myImages]);

  const init = () => {
    getMemberFaceRank();
    let result = [];
    let freeCount = 6;
    freeCount = freeCount - myImages.length;

    for (let i = 0; i < freeCount; i++) {
      result.push({});
    }
    setImages(myImages.concat(result));
  };
  // ############################################################  프로필 랭크 순위 조회
  const getMemberFaceRank = async () => {
    try {
      const { success, data } = await get_member_face_rank();
      if (success) {
      } else {
        show({
          content: '오류입니다. 관리자에게 문의해주세요.',
          confirmCallback: function () {},
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const deleteImage = (item) => {
    const deleted = images.filter((e) => e !== item);
    deleted.push({});
    setImages(deleted);
    // setImages((prev) => prev.filter((e) => e !== item).push({}));
  };
  const addImage = async () => {
    const validCount = images.filter((e) => e.img_file_path).length;
    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      return;
    }
    let temp = images.concat();

    temp[validCount] = {
      ...result.assets[0],
      img_file_path: result.assets[0].uri,
    };

    setImages(temp);
  };

  return (
    <>
      <CommonHeader
        title="프로필 관리"
        right={
          <TouchableOpacity>
            <Text style={styles.saveText}>저장</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView style={{ backgroundColor: 'white', flexGrow: 1 }}>
        <View style={styles.wrapper}>
          {images?.map((e) => (
            <ProfileImage item={e} onDelete={deleteImage} onAdd={addImage} />
          ))}
        </View>
        <View style={{ flexDirection: 'column', paddingHorizontal: 20 }}>
          <ProfileAuth data={secondAuth} />
          <Text style={styles.title}>내 인상 투표 결과</Text>
          <View style={styles.impressionContainer}>
            <View style={styles.itemRow}>
              <View style={styles.subRow}>
                <Image source={ICON.fashion} style={styles.icon} />
                <Text style={styles.contentsText}>패션감각이 좋아 보여요</Text>
              </View>
              <View style={styles.fashionPercent}>
                <Text style={styles.percentText}>59%</Text>
              </View>
            </View>
            <DashSpacer />
            <View style={styles.itemRow}>
              <View style={styles.subRow}>
                <Image source={ICON.fond} style={styles.icon} />
                <Text style={styles.contentsText}>다정해 보여요</Text>
              </View>
              <View style={styles.fontPercent}>
                <Text style={styles.percentText}>59%</Text>
              </View>
            </View>
            <DashSpacer />
            <View style={styles.itemRow}>
              <View style={styles.subRow}>
                <Image source={ICON.smile} style={styles.icon} />
                <Text style={styles.contentsText}>웃는 모습이 이뻐요</Text>
              </View>
              <View style={styles.smilePercent}>
                <Text style={styles.percentText}>59%</Text>
              </View>
            </View>
            <DashSpacer />
            <View style={styles.myImpressionContainer}>
              <Text style={styles.title}>내 평점은?</Text>
              <Slider
                value={7.5 / 10}
                animateTransitions={true}
                renderThumbComponent={() => null}
                maximumTrackTintColor={'#e3e3e3'}
                minimumTrackTintColor={'#8854d2'}
                containerStyle={styles.sliderContainerStyle}
                trackStyle={styles.trackStyle}
                trackClickable={false}
              />
            </View>
          </View>
          <View style={{ height: 30 }} />

          <Interview
            title={`방배동 아이유님을
알려주세요!`}
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
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
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  profileContainer: {
    backgroundColor: Color.grayF8F8,
    borderRadius: 16,
    padding: 24,
    marginRight: 0,
    paddingBottom: 30,
  },
  title: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginTop: 30,
  },
  impressionContainer: {
    width: '100%',

    opacity: 0.78,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d8d8d8',
    marginTop: 10,
    borderTopEndRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemRow: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subRow: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  contentsText: {
    marginLeft: 10,
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
  },
  fashionPercent: {
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#7986ee',
    paddingHorizontal: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  fontPercent: {
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#fe0456',
    paddingHorizontal: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  smilePercent: {
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#eda02b',
    paddingHorizontal: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  percentText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  myImpressionContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
  },
  sliderContainerStyle: {
    width: '100%',
    height: 27,
    marginTop: 10,
    borderRadius: 13,
  },
  trackStyle: {
    width: '100%',
    height: 27,
    borderRadius: 13,
  },
});

function ProfileImage({ item, onDelete, onAdd }) {
  const [modalVisible, setModalVisible] = useState(false);

  const close = () => {
    setModalVisible(false);
  };
  const open = () => {
    setModalVisible(true);
  };
  const onPressDelete = () => {
    onDelete && onDelete(item);
    close();
  };
  const onPressAdd = () => {
    onAdd && onAdd();
  };

  const isPending = item.status === 'PROGRESS';
  const filePath = useMemo(() => item.img_file_path, [item.img_file_path]);

  return item.img_file_path === undefined ? (
    <>
      <TouchableOpacity style={profileImage.container} onPress={onPressAdd}>
        <Image style={profileImage.plusStyle} source={ICON.plus_primary} />
      </TouchableOpacity>
    </>
  ) : (
    <>
      <TouchableOpacity disabled={isPending} onPress={open}>
        <Image
          source={findSourcePath(filePath)}
          style={profileImage.imageStyle}
        />
        {isPending && (
          <View style={profileImage.dim}>
            <Text style={profileImage.text}>심사중</Text>
          </View>
        )}
      </TouchableOpacity>
      <ReactNativeModal
        isVisible={modalVisible}
        style={profileImage.modalContainer}
      >
        <View style={profileImage.modalInnerView}>
          <View style={profileImage.title}>
            <Text style={profileImage.titleText}>프로필 사진 삭제</Text>
            <TouchableOpacity onPress={close}>
              <Image source={ICON.xBtn} style={profileImage.close} />
            </TouchableOpacity>
          </View>

          <View style={profileImage.margin}>
            <View>
              <CommonBtn
                value={'사진 삭제'}
                type={'danger'}
                onPress={onPressDelete}
              />
              <View style={{ height: 2 }} />
              <CommonBtn value={'취소'} type={'primary'} onPress={close} />
            </View>
          </View>
        </View>
      </ReactNativeModal>
    </>
  );
}

const profileImage = StyleSheet.create({
  container: {
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    backgroundColor: 'rgba(155, 165, 242, 0.12)',
    margin: 10,
    borderRadius: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  plusStyle: {
    width: (width - 80) / 10,
    height: (width - 80) / 10,
  },
  imageStyle: {
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    margin: 10,
    borderRadius: 10,
  },
  dim: {
    position: 'absolute',
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  close: {
    width: 24,
    height: 24,
  },
  modalContainer: {
    margin: 0,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  modalInnerView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    paddingBottom: 50,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 20,
  },
  margin: {
    marginTop: 30,
  },
});

function DashSpacer() {
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        borderWidth: 1,
        borderColor: '#d8d8d8',
        borderStyle: 'dashed',
      }}
    />
  );
}