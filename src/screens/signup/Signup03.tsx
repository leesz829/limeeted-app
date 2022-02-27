import { ColorType } from '@types';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { ICON } from 'utils/imageUtils';

export const Signup03 = () => {
	return (
		<>
			<CommonHeader title={'닉네임과 소개'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				<SpaceView mb={24}>
					<CommonText>
						LIMEETED에서 사용할 닉네임과{'\n'}
						한줄소개를 입력해주세요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput label="닉네임" placeholder={'회원명'} />
				</SpaceView>

				<SpaceView mb={48}>
					<CommonInput label="한줄 소개" placeholder={'서울사람'} />
				</SpaceView>

				<SpaceView mb={24}>
					<SpaceView mb={8}>
						<CommonText>관심사 표현하기</CommonText>
					</SpaceView>
					<CommonText color={ColorType.gray6666}>
						같은 관심사를 가진 이성을 소개할 수 있도록{'\n'}
						도와드릴게요.
					</CommonText>
				</SpaceView>
				<SpaceView mb={24}>
					<CommonBtn value={'등록 및 수정'} height={48} type={'white'} icon={ICON.plus} />
				</SpaceView>
				<SpaceView mb={40} mt={24} viewStyle={[layoutStyle.row, layoutStyle.wrap]}>
					{[
						{ text: '스타일1', isActive: false },
						{ text: '해외축구', isActive: false },
						{ text: '영화3', isActive: true },
						{ text: '해외축구', isActive: true },
						{ text: '영화1', isActive: false },
						{ text: '영화1', isActive: false },
						{ text: '영화1', isActive: false },
						{ text: '영화1', isActive: false },
					].map((i, index) => {
						return (
							<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
								<TouchableOpacity style={[styles.interestBox, i.isActive && styles.boxActive]}>
									<CommonText color={i.isActive ? ColorType.primary : ColorType.gray8888}>
										{i.text}
									</CommonText>
								</TouchableOpacity>
							</SpaceView>
						);
					})}
				</SpaceView>
				<SpaceView mb={24}>
					<CommonBtn value={'다음 (4/4)'} type={'primary'} />
				</SpaceView>
			</ScrollView>
		</>
	);
};
