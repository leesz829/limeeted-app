import { Color } from 'assets/styles/Color';
import type { FC } from 'react';
import * as React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Tooltip from 'rn-tooltip';
import { ICON } from 'utils/imageUtils';
import { CommonText } from './CommonText';
import SpaceView from './SpaceView';

const { width, height } = Dimensions.get('window');

interface Props {
  title: string;
  desc: string;
  position?: 'topRight' | 'topLeft' | 'bottomLeft' | 'bottomRight';
}

/**
 *
 * @param {string} title 툴팁 타이틀
 * @param {string} desc 툴팁 설명
 * @param {string} position 툴팁 위치
 * @returns
 */
export const ToolTip: FC<Props> = (props) => {
  return (
    <>
      <View style={styles.tooltipWrap}>
        <View style={styles.tooltipTextContainer}>
          <CommonText fontWeight={'500'}>{props.title}</CommonText>
          <Tooltip
            withPointer={false}
            backgroundColor="white"
            containerStyle={[styles.tooltipDescContainer]}
            popover={
              <View style={[styles.tooltipDescContainer]}>
                <View style={styles.tooptipCloseBtnContainer}>
                  <Image source={ICON.xBtn} style={styles.tooltipIcon} />
                </View>
                <CommonText>{props.desc}</CommonText>
              </View>
            }
          >
            <SpaceView ml={4}>
              <Image source={ICON.tooltip} style={styles.tooltipIcon} />
            </SpaceView>
          </Tooltip>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tooltipBackground: {
    width,
    height,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  tooltipWrap: {
    overflow: 'visible',
  },
  tooltipTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tooltipDescContainer: {
    position: 'absolute',
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Color.grayDDDD,
    borderRadius: 12,
    maxWidth: 300,
    minWidth: 250,
    zIndex: 20,
  },
  tooltipIcon: {
    width: 16,
    height: 16,
  },
  tooptipCloseBtnContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
});
