import { NavigationContainer } from '@react-navigation/native';
import NestedNavigation from './src/navigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { enableScreens } from 'react-native-screens';
enableScreens();

const App = () => {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={style.container}>
				<StatusBar animated={true} barStyle="dark-content" backgroundColor="white" />
				<NavigationContainer>
					<NestedNavigation />
				</NavigationContainer>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default App;

const style = StyleSheet.create({
	container: {
		flex: 1,
	},
});
