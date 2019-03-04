import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	BackHandler
} from 'react-native';

import { Toolbar } from '../../components/widgets';
import {authErrorTypes, toastIds} from "../../util/values";
import SuccessBanner from "../../components/modals/SuccessBanner";
import CheckBox from 'react-native-checkbox';

import { Actions } from 'react-native-router-flux';

import { palette, textStyles } from "../../../styles";

import {
	checkboxChecked,
	checkboxUnchecked,
	checkmarkInvalidText,
	checkmarkValidText,
	iconBlank,
	arrowRight,
} from '../../../assets/index';

const checkboxLabel = "Opt in for email updates about this program?";

const CHANGE_PASSWORD_SUCCESS_TEXT = "Password successfully changed";
const CONTACT_UPDATED_SUCCESS_TEXT = "Profile updated";


export default class Profile extends React.Component {
	
	errorMessages = {
		invalidEmail: "Must be a valid email address",
		reauthenticate: "Recent login required. Log out then log in and try again.",
	}
	
	state = {
		emailIconSrc: iconBlank,
		zipIconSrc: iconBlank,
		userEmail: null,
		userZip: null,
		agreeToEmails: false,
		buttonStyle: [styles.buttonInactive, textStyles.primaryButtonInactive],
		changePasswordSuccessBannerVisible: false,
		contactUpdatedSuccessBannerVisible: false,
		emailValid: true,
		zipValid: true,
		emailErrorStyle: styles.errorLabelInactive,
		emailErrorMessage: this.errorMessages.invalidEmail,
		zipErrorStyle: styles.errorLabelInactive,
	};
	
	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', () => this.androidBackPress() );
		
		this.setState({
			userEmail: this.props.currentUser.ctemailaddress || null,
			userZip: this.props.currentUser.ctzip || null,
		})
	}
	
	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', () => this.androidBackPress() );
	}
	
	androidBackPress = () => {
		this.props.goBack();
		return true;
	}
	
	
	componentWillReceiveProps(nextProps){
		this.showConfirmationToast(nextProps.showToast);

		if (nextProps.authErrorType === authErrorTypes.REAUTHENTICATE.code) {
			this.setState({
				emailErrorStyle: styles.errorLabelActive,
				emailErrorMessage: this.errorMessages.reauthenticate
			})
		}
	}

	showConfirmationToast = (id) => {
		setTimeout( () => {
			if(id == toastIds.CHANGE_PASSWORD_TOAST_ID) {
				this.setState({
					changePasswordSuccessBannerVisible: true
				});
			} else if (id == toastIds.CONTACT_UPDATED_TOAST_ID) {
				this.setState({
					contactUpdatedSuccessBannerVisible: true
				})
			}
			else {
				return;
			}
		}, 1000);
	}
	
	hideConfirmationModal = (id) => {
		this.setState({
			changePasswordSuccessBannerVisible: false,
			contactUpdatedSuccessBannerVisible: false
		}, this.props.clearToasts);
	}

	
	validateEmail = (email) => {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(re.test(email)) {
			this.setState(
				{
					emailIconSrc: checkmarkValidText,
					userEmail: email,
					emailErrorStyle: styles.errorLabelInactive,
					emailValid: true
				}, this.setFormState);
		} else {
			this.setState(
				{
					emailIconSrc: checkmarkInvalidText,
					userEmail: email,
					emailErrorStyle: styles.errorLabelActive,
					emailErrorMessage: this.errorMessages.invalidEmail,
					emailValid: false
				}, this.setFormState);
		}
	};
	
	validateZip = (zip) => {
		var re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		if(re.test(zip)) {
			this.setState(
				{
					zipIconSrc: checkmarkValidText,
					userZip: zip,
					zipErrorStyle: styles.errorLabelInactive,
					zipValid: true
				}, this.setFormState);
		} else {
			this.setState(
				{
					zipIconSrc: checkmarkInvalidText,
					userZip: zip,
					zipErrorStyle: styles.errorLabelActive,
					zipValid: false
				}, this.setFormState);
		}
	}
	
	setFormState = () => {
		if(this.isFormChanges() && this.state.emailValid && this.state.zipValid) {
			this.setState({ buttonStyle: [styles.buttonActive, textStyles.primaryButton], formIsInvalid: false });
		} else {
			this.setState({ buttonStyle: [styles.buttonInactive, textStyles.primaryButtonInactive], formIsInvalid: true });
		}
	}
	
	isFormChanges = () => (
		(this.state.userEmail && (this.state.userEmail !== this.props.currentUser.userEmail)) ||
		(this.state.userZip && (this.state.userZip !== this.props.currentUser.userZip)) ||
		(this.state.agreeToEmails !== this.props.agreeToEmails)
	)
	
	toggleEmailsCheckbox = (checked) => {
		this.setState({ agreeToEmails: !checked})
	}
	
	close = () => {
		this.props.goBack()
	}
	
	handleSave = () => {
		let registration = {...this.props.registration};
		let emailChange = false;
		if (this.props.currentUser.ctemailaddress !== this.state.userEmail) {
			emailChange = true;
		}
		
		registration.ctemailaddress = this.state.userEmail
		registration.ctzip = this.state.userZip;
		
		this.props.changeRegistration(registration, emailChange);
	}

	render(){
		let changePasswordSuccessBanner = (
			<SuccessBanner
				modalVisible={this.state.changePasswordSuccessBannerVisible}
				id={toastIds.CHANGE_PASSWORD_TOAST_ID}
				hideConfirmationModal={this.hideConfirmationModal}
				modalText={CHANGE_PASSWORD_SUCCESS_TEXT} />
		)
		
		let contactUpdatedSuccessBanner = (
			<SuccessBanner
				modalVisible={this.state.changePasswordSuccessBannerVisible}
				id={toastIds.CONTACT_UPDATED_TOAST_ID}
				hideConfirmationModal={this.hideConfirmationModal}
				modalText={CONTACT_UPDATED_SUCCESS_TEXT} />
		)
		
		return(
			<View style={styles.outerContainer}>
				<Toolbar back={false} title={"My Profile"} close={this.props.goBack} />
				<ScrollView
					style={{flex: 1}}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps={'never'}>
					<View style={styles.editInputsContainer}>
						
						<TouchableOpacity onPress={() => {if (this.emailInput) this.emailInput.focus()}}>
							<View style={{flexDirection: 'row'}}>
								<Text style={styles.floatingLabelActive}>Email</Text>
							</View>
							<View style={styles.outerInputContainer}>
								<View style={styles.inputContainer}>
									<View style={styles.innerInputContainer}>
										<TextInput
											style={styles.formsRow}
											underlineColorAndroid='rgba(0,0,0,0)'
											autoCapitalize="none"
											autoCorrect={false}
											autoFocus={false}
											keyboardType="email-address"
											ref={(input) => {this.emailInput = input;}}
											multiline={false}
											defaultValue={this.state.userEmail}
											onChangeText={this.validateEmail}
										/>
									</View>
								</View>
								<Image source={this.state.emailIconSrc} style={styles.validationIcon} />
							</View>
							
							<View style={styles.errorLabelContainerStyle}>
								<Text numberOfLines={2} style={this.state.emailErrorStyle}>{this.state.emailErrorMessage}</Text>
							</View>
						</TouchableOpacity>
						
						<TouchableOpacity onPress={() => {if (this.zipInput) this.zipInput.focus()}}>
							<View style={{flexDirection: 'row'}}>
								<Text style={styles.floatingLabelActive}>Zip Code</Text>
							</View>
							
							<View style={styles.outerInputContainer}>
								<View style={styles.inputContainer}>
									<View style={styles.innerInputContainer}>
										<TextInput
											style={styles.formsRow}
											underlineColorAndroid='rgba(0,0,0,0)'
											autoCapitalize="none"
											autoCorrect={false}
											autoFocus={false}
											keyboardType="numeric"
											ref={(input) => {this.zipInput = input;}}
											multiline={false}
											defaultValue={this.state.userZip}
											onChangeText={this.validateZip}
										/>
									</View>
								</View>
								<Image source={this.state.zipIconSrc} style={styles.validationIcon} />
							</View>
							
							<View style={styles.errorLabelContainerStyle}>
								<Text style={this.state.zipErrorStyle}>Must be a 5 digit number</Text>
							</View>
						</TouchableOpacity>
					
					</View>
					
					<View style={styles.sectionBuffer} />
					
					<TouchableOpacity
						style={[styles.editButton, styles.borderBottom]}
						onPress={this.props.navigateToChangePassword}>
						<Text style={textStyles.bodyBlack}>Change password</Text>
						<Image source={arrowRight} />
					</TouchableOpacity>
					
					<TouchableOpacity style={styles.editButton} onPress={this.props.navigateToStatusForm}>
						<Text style={textStyles.bodyBlack}>Edit membership affiliation</Text>
						<Image source={arrowRight} />
					</TouchableOpacity>
					
					<View style={styles.sectionBuffer} />
					
					<View style={styles.checkboxContainer}>
						<CheckBox
							label={checkboxLabel}
							checked={this.state.agreeToEmails}
							checkedImage={checkboxChecked}
							uncheckedImage={checkboxUnchecked}
							checkboxStyle={{width: 13, height: 13}}
							labelStyle={styles.text}
							underlayColor='transparent'
							onChange={this.toggleEmailsCheckbox}
						/>
					</View>
					
					<View style={{alignItems: 'center'}}>
						<TouchableOpacity style={styles.loginButton} onPress={this.props.logout}>
							<Text style={[textStyles.primaryButton, {color: palette.white}]}> Log Out </Text>
						</TouchableOpacity>
					</View>
					
					<TouchableOpacity style={{flexDirection: 'row'}} disabled={this.state.formIsInvalid} onPress={this.handleSave}>
						<Text style={this.state.buttonStyle}> Save Changes </Text>
					</TouchableOpacity>
				
				</ScrollView>
				{this.state.contactUpdatedSuccessBannerVisible ? contactUpdatedSuccessBanner : null}
				{this.state.changePasswordSuccessBannerVisible ? changePasswordSuccessBanner : null}
			</View>
		)
	}
}

const styles = StyleSheet.create({
 backIcon: {
	 width: 20,
	 height: 20,
	 marginLeft: 20,
	 marginTop: 40,
	 resizeMode: 'contain'
 },
 toolbarContainer: {
	 flexDirection: 'row',
	 justifyContent: 'space-between',
	 alignItems: 'center',
	 marginBottom: 40
 },
 outerContainer: {
	 flex: 1,
	 backgroundColor: 'white'
 },
 inputContainer: {
	 flexDirection: 'row',
	 borderBottomWidth: 1,
	 borderColor: 'rgb(231, 231, 231)',
	 alignItems: 'center',
	 flex: 1,
	 justifyContent: 'space-between'
 },
 outerInputContainer: {
	 flexDirection: 'row',
	 alignItems: 'center',
 },
 innerInputContainer: {
	 flex: 1
 },
 checkboxContainer: {
	 alignItems: 'center',
	 marginTop: 35,
	 marginBottom: 69,
 },
 checkboxSubtitle: {
	 fontFamily: 'Nunito Sans',
	 color: 'black',
	 fontSize: 12,
 },
 validationIcon: {
	 width: 13,
	 height: 10,
	 marginRight: 0,
	 marginLeft: 12,
	 resizeMode: 'contain'
 },
 formsRow: {
	 marginTop: 3,
	 height: 36,
	 textAlign: 'left',
	 backgroundColor: 'white',
 },
 floatingLabelActive: {
	 flex: 1,
	 fontSize: 10,
	 color: palette.blueberry,
	 textAlign: 'left',
	 fontFamily: 'Nunito Sans'
 },
 errorLabelActive: {
	 flex: 1,
	 fontSize: 10,
	 marginTop: 5,
	 textAlign: 'left',
	 color: 'rgb(119, 119, 119)',
	 fontFamily: 'Nunito Sans',
 },
 errorLabelInactive: {
	 opacity: 0,
	 fontSize: 10,
	 marginTop: 5,
	 fontFamily: 'Nunito Sans',
 },
 errorLabelContainerStyle: {
 	marginBottom: 10,
 	flexDirection: 'row'
 },
 text: {
	 color: 'black',
	 fontSize: 12,
	 textAlign: 'center',
	 fontFamily: 'Nunito Sans',
 },
 sectionBuffer: {
	 backgroundColor: palette.almostWhite,
	 height: 36
 },
	editButton: {
 		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginLeft: 28,
		paddingRight: 22.2,
		paddingVertical: 12,
		
	},
	borderBottom: {
 		borderBottomWidth: 0.5,
		borderColor: palette.almostWhite
	},
 loginButton: {
	 marginBottom: 64,
	 alignItems: 'center',
	 justifyContent: 'center',
	 width: 328,
	 height: 49,
	 borderRadius: 26,
	 backgroundColor: palette.deepLilacTwo
 },
 buttonInactive: {
	 flex: 1,
	 paddingTop: 25,
	 paddingBottom: 25,
	 textAlign: 'center',
	 fontWeight: 'bold',
	 color: 'rgb(70, 11, 0)',
	 backgroundColor: 'rgb(240, 81, 51)',
	 fontFamily: 'Nunito Sans',
 },
 buttonActive: {
	 flex: 1,
	 paddingTop: 25,
	 paddingBottom: 25,
	 textAlign: 'center',
	 fontWeight: 'bold',
	 color: 'white',
	 backgroundColor: 'rgb(240, 81, 51)',
	 fontFamily: 'Nunito Sans',
 },
	editInputsContainer: {
 		paddingHorizontal: 50,
		paddingTop: 50,
		paddingBottom: 30
	}
});
