import { styles } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { ScrollView, View } from 'react-native';
import * as React from 'react';
import { CommonSelect } from 'component/CommonSelect';
import { CommonBtn } from 'component/CommonBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { ColorType, StackParamList, BottomParamList, ScreenNavigationProp} from '@types';
import axios from 'axios';

/* ################################################################################################################
###################################################################################################################
###### 내 소개하기
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'Introduce'>;
	route : RouteProp<StackParamList, 'Introduce'>;
}

export const Introduce = (props : Props) => {

	const [comment, setComment] = React.useState(props.route.params.comment);
	const [jobName, setJobName] = React.useState(props.route.params.jobName);
	const [height, setHeight] = React.useState(props.route.params.height);

	return (
		<>
			<CommonHeader title={'내 소개하기'} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView mb={24}>
					{/* <CommonInput label={'한줄 소개'} placeholder="내용을 입력해주세요." /> */}

					<CommonInput 
							label={'한줄 소개'}
							placeholder="내용을 입력해주세요."
							value={comment} 
							onChangeText={comment => setComment(comment)} />

				</SpaceView>

				{/* <SpaceView mb={24} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<CommonSelect label={'업종'} />
					</View>

					<View style={styles.halfItemRight}>
						<CommonSelect label={'직업'} />
					</View>
				</SpaceView> */}

				<SpaceView mb={24}>
					<CommonInput 
							label={'회사명'} 
							placeholder="정승 네트워크"
							value={jobName} 
							onChangeText={jobName => setJobName(jobName)} />
				</SpaceView>

				{/* <SpaceView mb={24} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<CommonSelect label={'출신지'} />
					</View>

					<View style={styles.halfItemRight}>
						<CommonSelect label={''} />
					</View>
				</SpaceView> */}

				{/* <SpaceView mb={24} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<CommonSelect label={'활동지역'} />
					</View>

					<View style={styles.halfItemRight}>
						<CommonSelect label={''} />
					</View>
				</SpaceView> */}

				<SpaceView mb={24}>
					<CommonInput 
							label={'키'} 
							placeholder="175"
							value={height} 
							onChangeText={height => setHeight(height)} />
				</SpaceView>

				{/* <SpaceView mb={24}>
					<CommonSelect label={'체형'} />
				</SpaceView>

				<SpaceView mb={24}>
					<CommonSelect label={'종교'} />
				</SpaceView>

				<SpaceView mb={24}>
					<CommonSelect label={'음주'} />
				</SpaceView>

				<SpaceView mb={40}>
					<CommonSelect label={'흡연'} />
				</SpaceView> */}

				<SpaceView mb={16}>
					<CommonBtn 
						value={'저장'} 
						type={'primary'} 
						onPress={() => {

							/* axios.post('http://211.104.55.151:8080/member/insertMemberInfo/', {
								kakao_id : id,
								nickname: name,
								name: name,
								age : age,
								gender : gender,
								phone_number : hp
							})
							.then(function (response) {
								console.log(response.data.result_code);

								if(response.data.result_code == "0000") {
									navigation.navigate('Signup1', {
										memberSeq : response.data.memberSeq
									});
								}
							})
							.catch(function (error) {
								console.log(error);
							}); */

							//navigation.navigate('Signup1');
						}}
					/>
				</SpaceView>
			</ScrollView>
		</>
	);
};
