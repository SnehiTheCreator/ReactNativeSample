import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Linking
} from 'react-native';


import { palette, textStyles } from "../../../styles";

import {logo, heartBack} from '../../../assets/index';


const aboutText = "Midtown is the heartbeat of Atlanta. This app is a pilot program to bring Midtown Alliance members special offers, unique experiences and cool discoveries. You must be at the deal location to redeem, so get out there and explore one of ATL’s most vibrant neighborhoods.";

export const About = (props) => (
	<View style={styles.outerContainer}>
		<TouchableOpacity style={{marginBottom: 40}} onPress={props.goBack}>
			<Image source={heartBack} style={styles.backIcon} />
		</TouchableOpacity>
		
		<Image source={logo} style={styles.logo} />
		
		<Text style={[textStyles.subheading, styles.aboutText]}>{aboutText}</Text>
		
		<TouchableOpacity onPress={() => Linking.openURL('https://www.midtownatl.com/about/join-midtown-alliance/member-app')}>
			<Text style={[textStyles.textButton, {fontWeight: 'bold'}]}>Learn More</Text>
		</TouchableOpacity>
	</View>
)

const styles = StyleSheet.create({
 outerContainer: {
	 backgroundColor: palette.white,
	 alignItems: 'flex-start',
	 paddingVertical: 37,
	 paddingHorizontal: 26,
	 flex: 1,
 },
	aboutText: {
 		marginBottom: 14
	},
	logo: {
 		height: 25,
		width: 150,
		marginBottom: 34,
	},
 backIcon: {
	 width: 17,
	 height: 14,
	 marginBottom: 60,
	 resizeMode: 'contain'
 }
})