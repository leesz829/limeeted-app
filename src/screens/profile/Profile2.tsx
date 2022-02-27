import * as React from 'react';
import { Image, TextInput, View, ScrollView, TouchableOpacity } from 'react-native';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import CommonHeader from 'component/CommonHeader';
import { CommonBtn } from 'component/CommonBtn';
import { useNavigation } from '@react-navigation/native';
import { ColorType } from '@types';
import { Color } from 'assets/styles/Color';
import { CommonSwich } from 'component/CommonSwich';
import { useState } from 'react';
export const Profile2 = () => {
	const [text, setText] = useState('검색 글자');
	const navi = useNavigation();
	console.log(navi.getState());
	return (
		<>
			<CommonHeader title={'인터뷰'} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView viewStyle={layoutStyle.rowCenter} mb={32}>
					<SpaceView viewStyle={styles.questionContainer} mr={16}>
						<CommonText textStyle={layoutStyle.textCenter}>
							첫번째 질문이에요{'\n'}
							질문에 성실하게 답해주세요
						</CommonText>
					</SpaceView>
					<Image source={ICON.refreshDark} style={styles.iconSize24} />
				</SpaceView>

				<SpaceView viewStyle={styles.interviewContainer} mb={24}>
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

					{[
						{ key: '1', title: '새 질문1에 대답해주세요' },
						{ key: '20', title: '새 질문2에 대답해주세요' },
						{ key: '23', title: '새 질문3에 대답해주세요' },
					].map((i, ii) => (
						<SpaceView viewStyle={layoutStyle.rowBetween} mb={ii === 2 ? 0 : 16} key={i.key}>
							<SpaceView viewStyle={styles.questionItemTextContainer}>
								<CommonText>{i.title}</CommonText>
							</SpaceView>

							<View style={styles.questionIconContainer}>
								{i.key === '1' ? (
									<CommonSwich />
								) : (
									<Image source={ICON.align} style={styles.iconSize24} />
								)}
							</View>
						</SpaceView>
					))}
				</SpaceView>

				<SpaceView mb={16}>
					<CommonBtn value={'저장'} type={'primary'} />
				</SpaceView>
			</ScrollView>
		</>
	);
};
