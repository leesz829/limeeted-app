import React, { FC, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ICON } from 'utils/imageUtils';

/**
 *
 * 별점 컴포넌트
 */
interface Props {
  callBackFunction: (value: string) => void;
}
// export const LivePopup = () => {
export const RatingStar: FC<Props> = (props) => {
  const [starRatingOnOff, setStarRatingOnOff] = useState<boolean[]>([]);
  const [isHasHalfStar, setHasHalfStar] = useState(-1);

  const pressStarRating = (inx: number, isHalf: boolean) => {
    setHasHalfStar(-1);
    let tempStarRating: Array<boolean> = [];
    let score = '';

    for (let i = 0; i < 5; i++) {
      if (i <= inx) {
        tempStarRating.push(true);
      } else {
        tempStarRating.push(false);
      }
    }
    if (isHalf) {
      setHasHalfStar(inx);
      score = String(inx + 0.5);
    } else {
      score = String(inx + 1);
    }

    setStarRatingOnOff(tempStarRating);
    props.callBackFunction(score);
  };

  useEffect(() => {
    let starRatingState: Array<boolean> = [];
    for (let i = 0; i < 5; i++) {
      starRatingState.push(false);
    }
    setStarRatingOnOff(starRatingState);
  }, []);

  const calcImg = (starNum: number) => {
    return starRatingOnOff[starNum]
      ? isHasHalfStar === starNum
        ? ICON.starHalf
        : ICON.star
      : ICON.starEmpty;
    /* return starRatingOnOff[starNum]
    ? isHasHalfStar === starNum
      ? ICON.starHalfNew
      : ICON.starNew
    : ICON.starEmptyNew; */
  };

  const Star = ({ starNum }: { starNum: number }) => {
    return (
      <>
        <View>
          <TouchableOpacity
            style={styles.overlayLeftContainer}
            onPress={() => {
              pressStarRating(starNum, true);
            }}
          />
          <Image source={calcImg(starNum)} style={styles.iconSize} />
          <TouchableOpacity
            style={styles.overlayRightContainer}
            onPress={() => {
              pressStarRating(starNum, false);
            }}
          />
        </View>

        {/* <View style={{marginHorizontal: 5}}>
          <TouchableOpacity
            style={styles.overlayLeftContainer}
            onPress={() => {
              pressStarRating(starNum, true);
            }}
          />
          <Image source={calcImg(starNum)} style={{width: 40, height: 40}} />
          <TouchableOpacity
            style={styles.overlayRightContainer}
            onPress={() => {
              pressStarRating(starNum, false);
            }}
          /> 
        </View> */}
      </>
      
    );
  };

  return (
    <View style={styles.starRatingContainer}>
      {[0, 1, 2, 3, 4].map((i, index) => {
        return <Star starNum={i} key={'star' + index} />;
      })}
    </View>
  );
};

export default RatingStar;

const styles = StyleSheet.create({
  starRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSize: {
    width: 48,
    height: 48,
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
