import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Linking,
	BackHandler,
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import Communications from 'react-native-communications';

import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'

import { palette, textStyles } from "../../../styles";

import {
	iconTwitter,
	iconFacebook,
	iconInstagram
} from '../../../assets/index';

const CANCEL_INDEX = 0
const options = [ 'Cancel', 'Sign In', 'Create New Account'];

const actionSheetTitle = "Unlock Feature";
const actionSheetMessage = "To manage your user profile you must first create a new account or sign into an existing account";

export default class MoreMenu extends React.Component {

	componentWillReceiveProps(nextProps) {
		if (nextProps.guest) {
			this.ActionSheet.show();
		}
		
	}
	
	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', () => this.androidBackPress() );
	}
	
	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', () => this.androidBackPress() );
	}
	
	androidBackPress = () => {
		this.props.navigateToOffers();
		return false;
	}
	
	handlePress = (i) => {
		if (i === 1) {
			this.props.resetToLogin();
		} else if (i === 2) {
			this.props.resetToRegistration();
		}
		
	}
	
	handleProfile = () => {
		if (this.props.guest) {
			this.ActionSheet.show();
		} else {
			this.props.navigateToProfile()
		}
	}
	
	static onEnter = () => {
		// since on Enter is static we don't have access to component props. refreshing scene with arbitrary props so that
		// componentWillReceiveProps is called and can check if user is guest
		// Actions.refresh({arbitraryProp: true});
	}
	
	
	render(){
		return (
			<View style={styles.outerContainer}>
				
				<View>
					<View style={styles.menuItems}>
						<TouchableOpacity onPress={this.handleProfile}>
							<Text style={[textStyles.headline, styles.menuItemLabel]}>My profile</Text>
						</TouchableOpacity>
						
						<TouchableOpacity onPress={this.props.navigateToAbout}>
							<Text style={[textStyles.headline, styles.menuItemLabel]}>About Midtown Alliance</Text>
						</TouchableOpacity>
						
						<TouchableOpacity onPress={() => Linking.openURL('http://www.midtownatl.com/')}>
							<Text style={[textStyles.headline, styles.menuItemLabel]}>Visit us online</Text>
						</TouchableOpacity>
						
						<TouchableOpacity onPress={() => Communications.email(['appsupport@midtownatl.com'],null,null,'Question About My Midtown Alliance App',null)}>
							<Text style={[textStyles.headline, styles.menuItemLabel]}>Email us</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.socialMedia}>
						<TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/midtownalliance/')}>
							<Image style={styles.icon} resizeMode={'contain'} source={iconFacebook} />
						</TouchableOpacity>
						
						<TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/MidtownATL')}>
							<Image style={styles.icon} resizeMode={'contain'} source={iconTwitter} />
						</TouchableOpacity>
						
						<TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/midtown_atl/')}>
							<Image style={styles.icon} resizeMode={'contain'} source={iconInstagram} />
						</TouchableOpacity>
						
					</View>
				</View>
				
				<View>
					<TouchableOpacity onPress={() => Linking.openURL('http://www.midtownatl.com/app-privacy-policy-and-terms')}>
						<Text style={[textStyles.bodyWhite, styles.terms]}>Terms & Conditions and Privacy Policy</Text>
					</TouchableOpacity>
					
					<Text style={[textStyles.bodyWhite, styles.version]}>Midtown Alliance Member Application Version 2.0</Text>
				</View>
				<ActionSheet
					ref={o => this.ActionSheet = o}
					options={options}
					title={actionSheetTitle}
					message={actionSheetMessage}
					cancelButtonIndex={CANCEL_INDEX}
					onPress={this.handlePress}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	menuItems: {
		marginTop: 48
	},
	menuItemLabel: {
		color: palette.white,
		marginBottom: 39
	},
	terms: {
		fontWeight: '900',
		textAlign: 'left'
	},
	version: {
		textAlign: 'left',
		marginTop: 8
	},
	socialMedia: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	outerContainer: {
		backgroundColor: palette.blueberry,
		paddingVertical: 23,
		paddingHorizontal: 26,
		flex: 1,
		justifyContent: 'space-between'
	},
	icon: {
		width: 33,
		height: 31,
		marginRight: 33
	}
})