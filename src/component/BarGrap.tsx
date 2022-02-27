import * as React from 'react';
import type { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Color } from 'assets/styles/Color';
import { ICON } from 'utils/imageUtils';

interface Props {
	score: number;
}
/**
 * 공통 헤더
 * @param {number} score 바 그래프 범위(0 ~ 10)
 */
export const BarGrap: FC<Props> = (props) => {
	const { score } = props;

	return (
		<View>
			<View style={styles.barContainer}>
				<View style={styles.iconContainer}>
					<View style={[styles.iconPos, { left: score * 10 + '%' }]}>
						<Image source={ICON.like} style={styles.iconSize} />
					</View>
				</View>

				<View
					style={[styles.line, styles.first, { width: score - 2 >= 0 ? '20%' : score * 10 + '%' }]}
				/>
				<View
					style={[
						styles.line,
						styles.seconde,
						{ width: score - 4 >= 0 ? '20%' : (score - 2) * 10 + '%' },
					]}
				/>
				<View
					style={[
						styles.line,
						styles.third,
						{ width: score - 6 >= 0 ? '20%' : (score - 4) * 10 + '%' },
					]}
				/>
				<View
					style={[
						styles.line,
						styles.fourth,
						{ width: score - 8 >= 0 ? '20%' : (score - 6) * 10 + '%' },
					]}
				/>
				<View
					style={[
						styles.line,
						styles.fifth,
						{ width: score - 10 >= 0 ? '20%' : (score - 8) * 10 + '%' },
						score - 10 >= 0 ? { borderTopRightRadius: 20, borderBottomRightRadius: 20 } : {},
					]}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	line: { height: 20, width: '20%', position: 'absolute', left: 0, top: 0 },
	first: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20, backgroundColor: '#9C68E5' },
	seconde: { left: '20%', backgroundColor: '#B07CF9' },
	third: { left: '40%', backgroundColor: '#8854D1' },
	fourth: { left: '60%', backgroundColor: '#7440BD' },
	fifth: {
		left: '80%',
		backgroundColor: '#5F29AA',
	},
	fillLineContainer: {
		position: 'absolute',
		left: 0,
		top: 0,
		borderRadius: 20,
		width: 200,
	},
	barContainer: {
		width: '100%',
		height: 20,
		backgroundColor: Color.grayEEEE,
		borderRadius: 20,
	},
	fillLine: {
		height: 20,
		width: '100%',
	},
	iconSize: { width: 32, height: 32 },
	iconPos: { position: 'absolute', top: -30 },
	iconContainer: {
		paddingLeft: 24,
	},
});
