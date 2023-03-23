import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';

import {
  ScalingDot,
  SlidingBorder,
  ExpandingDot,
  SlidingDot,
} from 'react-native-animated-pagination-dots';
import { Color } from 'assets/styles/Color';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export default function ViewPager({ style, data, renderItem }) {
  const width = Dimensions.get('window').width;
  const ref = React.useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [0, data.length];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, data.length * width],
  });

  const onPageScroll = React.useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <SafeAreaView style={style || styles.flex}>
      <AnimatedPagerView
        initialPage={0}
        ref={ref}
        style={styles.PagerView}
        onPageScroll={onPageScroll}
      >
        {data?.map(({ item, index }) => renderItem({ item, index }))}
      </AnimatedPagerView>
      <ExpandingDot
        data={data}
        expandingDotWidth={20}
        //@ts-ignore
        scrollX={scrollX}
        inActiveDotOpacity={0.6}
        dotStyle={{
          width: 10,
          height: 10,
          backgroundColor: Color.primary,
          borderRadius: 5,
          marginHorizontal: 5,
        }}
        containerStyle={{
          top: 200,
        }}
      />
      {/* <View style={styles.dotsContainer}>
        <View style={styles.dotContainer}>
           <Text>Expanding Dot</Text> 
        </View>
        <View style={styles.dotContainer}>
          <Text>Scaling Dot</Text>
          <ScalingDot
            data={data}
            //@ts-ignore
            scrollX={scrollX}
            containerStyle={{
              top: 30,
            }}
          />
        </View>

        <View style={styles.dotContainer}>
          <Text>Sliding Border</Text>
          <SlidingBorder
            containerStyle={{ top: 30 }}
            data={data}
            //@ts-ignore
            scrollX={scrollX}
            dotSize={24}
          />
        </View>
        <View style={styles.dotContainer}>
          <Text>Sliding Dot</Text>
          <SlidingDot
            marginHorizontal={3}
            containerStyle={{ top: 30 }}
            data={data}
            //@ts-ignore
            scrollX={scrollX}
            dotSize={12}
          />
        </View> 
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    // backgroundColor: 'red',
  },
  PagerView: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#63a4ff',
  },
  progressContainer: { flex: 0.1, backgroundColor: '#63a4ff' },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 30,
  },
  separator: {
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  touchableTitle: {
    textAlign: 'center',
    color: '#000',
  },
  touchableTitleActive: {
    color: '#fff',
  },
  dotsContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  dotContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  contentSlider: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dots: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 310,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
});
