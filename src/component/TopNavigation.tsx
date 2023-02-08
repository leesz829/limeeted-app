import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@types';
import { Color } from 'assets/styles/Color';
import { ROUTES, STACK } from 'constants/routes';
import { usePopup } from 'Context';
import { useUserInfo } from 'hooks/useUserInfo';
import type { FC } from 'react';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BasePopup } from 'screens/commonpopup/BasePopup';

interface Props {
  currentPath: string;
}
/**
 * 상단 네비게이션
 * @param {string} currentPath 현재 경로
 * @returns
 */
const TopNavigation: FC<Props> = (props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const [currentNavi, setCurrentNavi] = useState<string>(props.currentPath);

  const memberBase = useUserInfo(); // 회원 기본정보

  const { show } = usePopup();

  React.useEffect(() => {
    setCurrentNavi(props.currentPath);
  }, [props]);

  function onPressLimeeted() {
    navigation.navigate(STACK.TAB, {
      screen: 'Matching',
    });
  }
  function onPressLive() {
    navigation.navigate('Live');
  }
  function onPressStory() {
    show({ title: '스토리', content: '준비중입니다.' });
  }

  return (
    <View style={styles.tabContainer}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={[styles.tab]} onPress={onPressLimeeted}>
          <Text
            style={[
              styles.tabText,
              currentNavi === 'LIMEETED' && styles.tabTextActive,
            ]}
          >
            LIMEETED
          </Text>

          {currentNavi === 'LIMEETED' && <View style={styles.activeDot} />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab]} onPress={onPressLive}>
          <Text
            style={[
              styles.tabText,
              currentNavi === 'LIVE' && styles.tabTextActive,
            ]}
          >
            LIVE
          </Text>
          {currentNavi === 'LIVE' && <View style={styles.activeDot} />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab]} onPress={onPressStory}>
          <Text
            style={[
              styles.tabText,
              currentNavi === 'STORY' && styles.tabTextActive,
            ]}
          >
            STORY
          </Text>
          {currentNavi === 'STORY' && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>

      {/* ######################################################################
			##### 팝업 영역
			###################################################################### */}
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.itemContainer, { marginRight: 8 }]}>
          <View style={styles.itemStyle} />
          <Text>{memberBase.pass_has_amt}</Text>
        </View>
        <View style={styles.itemContainer}>
          <View style={styles.itemStyle} />
          <Text>{memberBase.royal_pass_has_amt}</Text>
        </View>
      </View>
    </View>
  );
};

export default TopNavigation;

const styles = StyleSheet.create({
  logo1: { width: 105, height: 29 },
  tabContainer: {
    flexDirection: 'row',
    paddingBottom: 16,
    paddingTop: 24,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    paddingRight: 24,
  },
  tabText: {
    fontSize: 20,
    lineHeight: 32,
    color: Color.grayAAAA,
    fontFamily: 'AppleSDGothicNeoB00',
  },
  tabTextActive: {
    color: Color.black2222,
  },
  activeDot: {
    right: 18,
    top: 4,
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 20,
    backgroundColor: Color.black2222,
  },
  itemStyle: {
    width: 18,
    height: 18,
    marginRight: 5,
    borderWidth: 1,
    borderColor: 'grey',
  },
  itemContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
});
