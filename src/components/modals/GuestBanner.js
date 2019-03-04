import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity
} from 'react-native';

import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'

import { textStyles } from "../../../styles";

const CANCEL_INDEX = 0
const options = [ 'Cancel', 'Log in', 'Sign up'];


export const GuestBanner = (props) => {
	
	const showActionSheet = () => {
		this.ActionSheet.show()
	}
	
	handlePress = (i) => {
		if (i === 1) {
			props.goToLogin();
		} else if (i === 2) {
			props.goToRegistration();
		}
	}
		

	return (
		<View style={styles.innerModal}>
			<Text style={[textStyles.bodyWhite, {marginLeft: 10}]}>You're are exploring in Guest Mode</Text>
			<TouchableOpacity onPress={showActionSheet}>
				<Text style={[textStyles.bodyWhite, {marginRight: 10, fontWeight: '700'}]}>Exit</Text>
			</TouchableOpacity>
			<ActionSheet
				ref={o => this.ActionSheet = o}
				options={options}
				cancelButtonIndex={CANCEL_INDEX}
				onPress={handlePress}
			/>
		</View>
	);
}

const styles = StyleSheet.create ({
	innerModal: {
		backgroundColor: 'rgb(51, 48, 146)',
		flexDirection: 'row',
		height: 50,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	text: {
		marginLeft: 10
	}
});