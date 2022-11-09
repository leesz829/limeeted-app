import { NavigationContainer } from '@react-navigation/native';
import NestedNavigation from './src/navigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import store from 'redux/store';
enableScreens();

const App = () => {
	return (
		<Provider store={store}>
			<SafeAreaProvider>
				<SafeAreaView style={style.container}>
					<StatusBar animated={true} barStyle="dark-content" backgroundColor="white" />
					<NavigationContainer>
						<NestedNavigation />
					</NavigationContainer>
				</SafeAreaView>
			</SafeAreaProvider>
		</Provider>
	);
};

export default App;

const style = StyleSheet.create({
	container: {
		flex: 1,
	},
});
