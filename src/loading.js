import React from 'react';
import { View, Image } from 'react-native';
import { heartbeatAnimation } from '../assets/index';

const LoadingScreen = () => (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
		<Image source={heartbeatAnimation} style={{width: 80, resizeMode: 'contain'}}/>
	</View>
)

export default LoadingScreen;