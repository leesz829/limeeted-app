import React, { FC, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, PanResponder, Animated, Text } from 'react-native';
import { ICON } from 'utils/imageUtils';
import { isEmptyData } from 'utils/functions';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import { useIsFocused, useNavigation, useFocusEffect  } from '@react-navigation/native';
import {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';

/**
 *
 * 별점 컴포넌트
 */
interface Props {
  callBackFunction: (value: number) => void;
  isFixed?: boolean;
  score?: number;
  starSize?: number;
}

export const RatingStar: FC<Props> = (props) => {

  const [starRatingOnOff, setStarRatingOnOff] = useState<boolean[]>([]);
  const [isHasHalfStar, setIsHasHalfStar] = useState(-1);

  const [rating, setRating] = useState(-1);
  const starContainerRef = React.useRef(null);

  // ########################################################################## 별점 선택 함수
  const pressStarRating = (inx: number) => {

    if(inx % 1 === 0) {
      setIsHasHalfStar(-1);
      inx = inx-1;
    } else {
      setIsHasHalfStar(Math.floor(inx));
    }

    let tempStarRating: Array<boolean> = [];
    let score = '';

    for (let i = 0; i < 5; i++) {
      if (i <= inx) {
        tempStarRating.push(true);
      } else {
        tempStarRating.push(false);
      }
    }

    setStarRatingOnOff(tempStarRating);
  }

  // ########################################################################## 별 이미지 계산 적용 함수
  const calcImg = (starNum: number) => {

    return starRatingOnOff[starNum]
    ? isHasHalfStar === starNum
      ? ICON.starHalfNew
      : ICON.starNew
    : ICON.starEmptyNew;
  };


  let storedTouchX = 0; // 변수 추가
      //const panX = useSharedValue(0); // 사용자의 드래그 위치를 저장하는 변수
  
  // ########################################################################## 터치 드래그 움직임 처리 함수
  const handleMove = (e, gestureState, type, eventPageX) => {
    if(!isEmptyData(props.isFixed) || !props.isFixed) {
      const starContainer = starContainerRef.current;
      starContainer.measure((x, y, width, height, pageX, pageY) => {
        const maxRating = 5;
        const starWidth = width / (maxRating * 2);
        let newRating = 0;

        if(type == 'move') {
          const touchX = gestureState.moveX - pageX;

          if(touchX > 0) {
            storedTouchX = touchX;
            newRating = Math.floor(touchX / starWidth) * 0.5 + 0.5;
            newRating = Math.max(0, Math.min(maxRating, newRating));
            setRating(newRating);
            pressStarRating(newRating);
          };
        } else if(type == 'grant') {
          const touchX = eventPageX - pageX;

          if(touchX > 0) {
            storedTouchX = touchX;
            newRating = Math.floor(touchX / starWidth) * 0.5 + 0.5;
            newRating = Math.max(0, Math.min(maxRating, newRating));
            setRating(newRating);
            pressStarRating(newRating);
          };
        } else if(type == 'responder') {
          newRating = Math.floor(storedTouchX / starWidth) * 0.5 + 0.5;
          newRating = Math.max(0, Math.min(maxRating, newRating));
          const score = newRating;
          props.callBackFunction(score);
          setRating(-1);
        }
      });
    }
  };

  // ########################################################################## 터치 컨트롤 함수
  const panResponder = React.useRef(
    PanResponder.create({
      /* onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true, */
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (event, gestureState) => {
        handleMove(event, gestureState, 'move', null);
      },
      onPanResponderGrant: (event, gestureState) => {
        handleMove(event, gestureState, 'grant', event.nativeEvent.pageX);
      },
      onPanResponderRelease: (event, gestureState) => {
        handleMove(event, gestureState, 'responder', null);
      },
    })
  ).current;

  // ########################################################################## rating hook
  /* useEffect(() => {
    
  }, [rating]); */

  // ########################################################################## 초기 실행 hook
  useEffect(() => {
    if(isEmptyData(props.isFixed) && props.isFixed && typeof props.score != 'undefined') {
      pressStarRating(props.score);
    } else {
      let starRatingState: Array<boolean> = [];
      for (let i = 0; i < 5; i++) {
        starRatingState.push(false);
      }
      setStarRatingOnOff(starRatingState);
    }
  }, []);

  const Star = ({ starNum }: { starNum: number }) => {
    return (
      <>
        <View style={{marginHorizontal: 5}}>
          <Image source={calcImg(starNum)} style={styles.iconSquareSize(isEmptyData(props.starSize) ? props.starSize : 40)} />
        </View>
      </>
    );
  };

  return (
    <>
      <View 
        ref={starContainerRef} 
        style={_styles.starRatingContainer} 
        onLayout={() => {
          // starContainerRef의 레이아웃이 측정된 후에 호출됨
          setRating(-1); // 초기화하여 올바른 너비를 사용하여 측정
        }}
        {...panResponder.panHandlers} >

        {[0, 1, 2, 3, 4].map((i, index) => {
          return <Star starNum={i} key={'star' + index} />;
        })}
      </View>
    </>
  );

};

export default RatingStar;

const _styles = StyleSheet.create({
  starRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLeftContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '50%',
    height: 40,
    zIndex: 1,
  },
  overlayRightContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
    height: 40,
    zIndex: 1,
  },
});
