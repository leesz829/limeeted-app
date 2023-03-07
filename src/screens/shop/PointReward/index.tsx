import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ICON } from 'utils/imageUtils';

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
export default function PointReward() {
  return (
    <View style={styles.container}>
      <CommonHeader title="리미티드 포인트 보상" />
      <ScrollView style={styles.scroll}>
        <View style={styles.inner}>
          <View style={styles.gradeContainer}>
            <Text style={styles.gradeText}>A</Text>
          </View>
          <View style={styles.rankBox}>
            <Text style={styles.rankText}>RANK</Text>
          </View>
          <Text style={styles.accReward}>누적보상 50,000</Text>
          <Text style={styles.lmitPoint}>리미티드 포인트</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.hintText}>LIMIT 해제완료</Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>터치하고 보상받기</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20 }}>
          {dummy?.map((item) => (
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
                <TouchableOpacity style={styles.rewardButton}>
                  <Text style={styles.rewardButtonText}>보상받기</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.moreText}>포인트 모으기</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

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
});
