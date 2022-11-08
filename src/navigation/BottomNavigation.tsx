import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomParamList } from '@types';
import * as React from 'react';
import { Live } from 'screens/live';
import { LiveSearch } from 'screens/live/LiveSearch';
import { Matching } from 'screens/matching';
import { Profile1 } from 'screens/profile/Profile1';
import { Profile2 } from 'screens/profile/Profile2';
import { Roby } from 'screens/roby';
import { Shop } from 'screens/shop';
import { Storage } from 'screens/storage';
import { StorageProfile } from 'screens/storage/StorageProfile';
import * as busiUtils from 'utils/business';
import { View, Image, ScrollView, Alert, StyleSheet, Text } from 'react-native';

import CustomTab from './CustomTab';

const Tab = createBottomTabNavigator<BottomParamList>();
const Stack = createStackNavigator();
const BottomNavigation = () => {
	return (
		<Tab.Navigator
			backBehavior={'history'}
			initialRouteName={'Live'}
			tabBar={(props) => <CustomTab key={Math.random().toString(36).substr(2, 11)} {...props} />}
		>
			<Tab.Screen
				name="Roby"
				component={Roby}
				options={{
					tabBarLabel: '로비',
					headerShown: false,
					tabBarShowLabel: true,
				}}
			/>
			<Tab.Screen
				name="Storage"
				component={Storage}
				options={{
					tabBarLabel: '보관함',
					headerShown: false,
					tabBarShowLabel: true,
				}}

				listeners={({navigation}) => ({
					tabPress: e => {
						e.preventDefault();
						//busiUtils.goStoragePage(navigation);
						Alert.alert("알림",	"준비중입니다.",	[{text: "확인"}]);
					}
				})}
			/>
			<Tab.Screen
				name="Mailbox"
				component={Shop}
				options={{
					tabBarLabel: '우편함',
					headerShown: false,
					tabBarShowLabel: true,
				}}
				listeners={({navigation}) => ({
					tabPress: e => {
						e.preventDefault();
						//busiUtils.goStoragePage(navigation);
						Alert.alert("알림",	"준비중입니다.",	[{text: "확인"}]);
					}
				})}
			/>
			<Tab.Screen
				name="Cashshop"
				component={Shop}
				options={{
					tabBarLabel: '아이템',
					headerShown: false,
					tabBarShowLabel: true,
				}}
			/>
			<Stack.Screen
				name="Live"
				component={Live}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="LiveSearch"
				component={LiveSearch}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Matching"
				component={Matching}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="StorageProfile"
				component={StorageProfile}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Shop"
				component={Shop}
				options={{
					headerShown: false,
				}}
			/>
		</Tab.Navigator>
	);
};

export default BottomNavigation;
