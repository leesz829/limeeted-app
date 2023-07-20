import { ColorType } from '@types';
import { Color } from 'assets/styles/Color';
import { commonStyle, layoutStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Modal, TouchableOpacity, View, Image, Text, ScrollView, Dimensions, Animated, StyleSheet } from 'react-native';
import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel';
import { useUserInfo } from 'hooks/useUserInfo';
import LinearGradient from 'react-native-linear-gradient';
import { IMAGE, PROFILE_IMAGE, findSourcePath } from 'utils/imageUtils';


/* ################################################################################################################
###################################################################################################################
###### 반응형 팝업 Component
###################################################################################################################
################################################################################################################ */

interface Props {
  popupVisible?: boolean; // popup state
  setPopupVIsible?: any; // popup setState
  text?: string; // 팝업 문구
  subText?: string;
}

const { width, height } = Dimensions.get('window');

export const ResponsivePopup = (props: Props) => {

  /* const ref = React.useRef();
  const pageIndex = 0;
  const [currentIndex, setCurrentIndex] = React.useState(pageIndex);

  const memberBase = useUserInfo();

  const onPressConfirm = (isNextChk) => {
    if(props.confirmCallbackFunc == null && typeof props.confirmCallbackFunc != 'undefined') {

    } else {
      props.confirmCallbackFunc && props.confirmCallbackFunc(isNextChk);
      props.setPopupVIsible(false);
    };
  };

  const onPressEtc = (pop_bas_seq:number, sub_img_path:string) => {
    props.etcCallbackFunc(pop_bas_seq, sub_img_path);
    props.setPopupVIsible(false);
  }

  const onPressDot = (index) => {
    ref?.current?.snapToItem(index);
  };

  React.useEffect(() => {
    setCurrentIndex(0);
    //setIsNextChk(false);
  }, [props]); */

  const [isVisible, setIsvisible] = React.useState(true);
  const fadeAnimation = React.useRef(new Animated.Value(0)).current;
  const transYAnimation = React.useRef(new Animated.Value(-50)).current;

  const action02 = (isActive:boolean) => {
		if(isActive) {
		  	Animated.parallel([
				Animated.timing(fadeAnimation, {
				toValue: 1,
				duration: 400,
				useNativeDriver: true,
				}),
				Animated.timing(transYAnimation, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
				}),
			]).start();

		  	// 팝업이 표시된 후 1초 후에 자동으로 닫히도록 설정
			const timer = setTimeout(() => {

				Animated.parallel([
					Animated.timing(fadeAnimation, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
					}),
					Animated.timing(transYAnimation, {
					toValue: -50,
					duration: 1200,
					useNativeDriver: true,
					}),
				]).start();

				/* fadeAnimation.setValue(0);
		  		transYAnimation.setValue(-50); */

				props.setPopupVIsible(false);
			}, 1300);

			// 컴포넌트가 언마운트될 때 타이머를 정리하여 메모리 누수 방지
			return () => clearTimeout(timer);

		} else {
		  //fadeAnimation.setValue(0);
		  //transYAnimation.setValue(-50);
		}
	};

  React.useEffect(() => {
    action02(true);
  }, [props]);

  /* React.useEffect(() => {
		if (isVisible) {
			// 팝업이 표시된 후 3초 후에 자동으로 닫히도록 설정
			const timer = setTimeout(() => {
			setIsvisible(false);
			}, 2000);

			// 컴포넌트가 언마운트될 때 타이머를 정리하여 메모리 누수 방지
			return () => clearTimeout(timer);
		}
	}, [isVisible]); */

  // ################################################################ 초기 실행 함수

  return (
    <>
		{props.popupVisible &&
			<Animated.View style={[_styles.animateArea(height), { 
				opacity: fadeAnimation,
				transform: [{translateY: transYAnimation}]
			}]}>

				<Text style={[_styles.animateAreaText]}>{props.text}</Text>
			</Animated.View>
		}
    </>
  );
};




{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
	animateArea: (height) => {
		return {
			position: 'absolute',
			top: height/2.4,
			left: 0,
			right: 0,
			backgroundColor: 'rgba(70, 70, 70, 0.85)',
			zIndex: 99999,
			marginHorizontal: 50,
			borderRadius: 50,
		};
	},
	animateAreaText: {
		textAlign: 'center',
		color: '#fff',
		paddingVertical: 5,
	},
});