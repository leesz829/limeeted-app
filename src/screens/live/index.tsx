import * as React from 'react';
import { ScrollView } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ViualSlider } from 'component/ViualSlider';
import { RadioCheckBox } from 'component/RadioCheckBox';

export const Live = () => {
	return (
		<>
			<TopNavigation currentPath={'LIVE'} />
			<ScrollView>
				<SpaceView>
					<ViualSlider isNew={true} status={'ing'} />
				</SpaceView>

				<SpaceView viewStyle={styles.container} pt={48}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							인상을 선택해주세요.
						</CommonText>
					</SpaceView>

					<RadioCheckBox
						items={[
							{ label: '눈이 이뻐요', value: "'눈이 이뻐요'" },
							{ label: '그림 같은 눈썹', value: "'눈이 이뻐요'" },
							{ label: '봄같은 분위기', value: "'눈이 이뻐요'" },
							{ label: '섹시한', value: "'눈이 이뻐요'" },
							{ label: '분위기 여신', value: "'눈이 이뻐요'" },
							{ label: '이국적인', value: "'눈이 이뻐요'" },
							{ label: '싱그러운', value: "'눈이 이뻐요'" },
							{ label: '귀여운 턱선', value: "'눈이 이뻐요'" },
						]}
					/>
				</SpaceView>
			</ScrollView>
		</>
	);
};
