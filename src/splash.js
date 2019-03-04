import React from 'react';
import { View, Image } from 'react-native';
import { splashAnimation } from '../assets';

const SplashScreen = () => (
	<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
		<Image source={splashAnimation} style={{flex: 1}}/>
	</View>
)

export default SplashScreen;