import { createStackNavigator } from '@react-navigation/stack';
import BottomNavigation from './BottomNavigation';
import StartPage from 'screens/startpage';
import { StackParamList } from '@types';
import { Login } from 'screens/login';
import { Title00 } from 'screens/title';
import { Signup0 } from 'screens/signup';
import { Signup1 } from 'screens/signup/Signup01';
import { Signup02 } from 'screens/signup/Signup02';
import { Signup03 } from 'screens/signup/Signup03';
import { SignupPopUp } from 'screens/commonpopup/SignupPopUp';
import { SignupPopUp2 } from 'screens/commonpopup/SignupPopUp2';
import { ReportPopup } from 'screens/commonpopup/ReportPopup';
import { LivePopup } from 'screens/commonpopup/LivePopup';
import * as React from 'react';
import { CommonPopup } from 'screens/commonpopup';
import { Introduce } from 'screens/commonpopup/Introduce';
import { Board0 } from 'screens/commonpopup/Board0';
import { Board1 } from 'screens/commonpopup/Board1';
import { Preference } from 'screens/commonpopup/Preference';
import { Profile } from 'screens/profile/Profile';
import { Approval } from 'screens/signup/Approval';
import { Sample } from 'screens/sample/sample';
import Component from 'component';

const Stack = createStackNavigator<StackParamList>();

const StackNavigation = () => {
	return (
		<Stack.Navigator initialRouteName="Login">
			<Stack.Screen
				name="Component"
				component={Component}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Main"
				component={BottomNavigation}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="StartPage"
				component={StartPage}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Login"
				component={Login}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Title00"
				component={Title00}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Signup0"
				component={Signup0}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Signup1"
				component={Signup1}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="SignupPopUp"
				component={SignupPopUp}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Signup02"
				component={Signup02}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Signup03"
				component={Signup03}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="SignupPopUp2"
				component={SignupPopUp2}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="CommonPopup"
				component={CommonPopup}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="ReportPopup"
				component={ReportPopup}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="LivePopup"
				component={LivePopup}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Introduce"
				component={Introduce}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Board0"
				component={Board0}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Board1"
				component={Board1}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Preference"
				component={Preference}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Profile"
				component={Profile}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Approval"
				component={Approval}
				options={{
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="Sample"
				component={Sample}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
};

export default StackNavigation;
