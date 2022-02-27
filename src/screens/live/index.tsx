import * as React from 'react';
import { ScrollView } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ViualSlider } from 'component/ViualSlider';
import { RowCheckBox } from 'component/RowCheckBox';

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
						<CommonText type={'h3'}>인상을 선택해주세요.</CommonText>
					</SpaceView>

					{[
						'눈이 이뻐요',
						'그림 같은 눈썹',
						'봄같은 분위기',
						'섹시한',
						'분위기 여신',
						'이국적인',
						'싱그러운',
						'귀여운 턱선',
					].map((i, ii) => (
						<SpaceView mb={ii === 7 ? 48 : 8} key={ii + 'check'}>
							<RowCheckBox label={i} />
						</SpaceView>
					))}
				</SpaceView>
			</ScrollView>
		</>
	);
};
