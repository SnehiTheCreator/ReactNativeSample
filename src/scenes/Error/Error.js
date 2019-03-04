import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';

import { iconEmojiSystem, iconEmojiConnection } from '../../../assets';
import { palette, textStyles } from "../../../styles";
import { errorTypes } from "../../util/values";


export const Error = (props) => {
	
	let errorText, errorTitle, errorIcon;
	
	switch (props.errorType) {
		case errorTypes.SYSTEM:
			errorText = "We messed up. Please retry your request and we'll do better next time.";
			errorTitle = "Whoops.";
			errorIcon = iconEmojiSystem
			break;
		case errorTypes.CONNECTIVITY:
			errorText = "Please check your internet connection and retry your request";
			errorTitle = "Connectivity Issue.";
			errorIcon = iconEmojiConnection;
			break;
	}
	
	return(
		<View style={styles.errorContainerOuter}>
			<View style={styles.errorContainerInner}>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Image source={errorIcon} style={styles.errorEmoji} />
				</View>
				<Text style={[textStyles.headline, styles.errorTitle]}>
					{errorTitle}
				</Text>
				
				<Text style={[textStyles.subheading, styles.errorText]}>
					{errorText}
				</Text>
			</View>
			<TouchableOpacity style={{flexDirection: 'row'}} onPress={props.goToLastScreen}>
				<Text style={[styles.errorButton, textStyles.primaryButton]}>Retry</Text>
			</TouchableOpacity>
		</View>
	)
}


const styles = StyleSheet.create({
 errorContainerOuter: {
	 flex: 1,
	 justifyContent: 'space-between',
	 backgroundColor: palette.white
 },
 errorContainerInner: {
	 flex: 1,
	 justifyContent: 'center',
	 alignItems: 'center',
	 padding: 54
 },
 errorEmoji: {
	 width: 60,
	 height: 60,
	 resizeMode: 'cover',
 },
 errorTitle: {
	 height: 50,
	 marginTop: 20,
 },
 errorText: {
	 textAlign: 'center'
 },
 errorButton: {
	 flex: 1,
	 paddingTop: 25,
	 paddingBottom: 25,
	 textAlign: 'center',
	 fontWeight: 'bold',
	 color: 'white',
	 backgroundColor: 'rgb(240, 81, 51)',
 },
});