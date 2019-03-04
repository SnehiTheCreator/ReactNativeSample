import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	BackHandler,
	Keyboard,
	KeyboardAvoidingView,
	Dimensions
} from 'react-native';

import { Toolbar } from '../../components/widgets';

import { palette, textStyles } from "../../../styles";

import {authErrorTypes} from "../../util/values";

import {
	checkmarkInvalidText,
	checkmarkValidText,
	iconBlank,
} from '../../../assets/index';

export default class ChangePassword extends Component {
	
	constructor(props) {
		super(props);
		this.currentUser = props.currentUser;
	}
	
	errorMessages = {
		match: "Must match password above",
		reauthenticate: "Recent login required. Log out then log in and try again."
	}
	
	state = {
		currentPasswordIconSrc: iconBlank,
		newPasswordIconSrc: iconBlank,
		confirmNewPasswordIconSrc: iconBlank,
		
		currentPasswordLabelStyle: styles.floatingLabelInactive,
		newPasswordLabelStyle: styles.floatingLabelInactive,
		confirmNewPasswordLabelStyle: styles.floatingLabelInactive,
		
		currentPasswordErrorStyle: styles.errorLabelInactive,
		newPasswordErrorStyle: styles.errorLabelInactive,
		confirmNewPasswordErrorStyle: styles.errorLabelInactive,
		
		confirmNewPasswordErrorMessage: this.errorMessages.match,
		
		currentPassword: null,
		hideCurrentPassword: true,
		
		newPassword: null,
		hideNewPassword: true,
		
		confirmNewPassword: null,
		hideConfirmNewPassword: true,
		
		formIsInvalid: true,
		buttonStyle: [styles.buttonInactive, textStyles.primaryButtonInactive],
		
		behavior: 'position'
	};
	
	componentDidMount() {
		//if we already have a user password and newPassword and they come back to page 1
		BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
	}
	
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress);
	}
	
	componentWillReceiveProps(nextProps){
		if (nextProps.authErrorType === authErrorTypes.REAUTHENTICATE.code) {
			this.setState({
				confirmNewPasswordErrorStyle: styles.errorLabelActive,
				confirmNewPasswordErrorMessage: this.errorMessages.reauthenticate
			})
		}
	}
	
	androidBackPress = () => {
		this.props.goBack();
		return true;
	}
	
	handleNext = () => {
		this.props.changePassword(this.state.currentPassword, this.state.newPassword);
	}
	
	toggleCurrentPasswordVisibility = () => {
		this.setState({hideCurrentPassword: !this.state.hideCurrentPassword})
	}
	
	toggleNewPasswordVisibility = () => {
		this.setState({hideNewPassword: !this.state.hideNewPassword})
	}
	
	toggleConfirmNewPasswordVisibility = () => {
		this.setState({hideConfirmNewPassword: !this.state.hideConfirmNewPassword})
	}
	
	close = () => {
		this.props.goBack();
	}
	
	onDonePressed = () => {
		if (this.state.formIsInvalid) {
			Keyboard.dismiss()
		} else {
			this.handleNext()
		}
	}
	
	keyboardFocus = (input) => (
		() => {
			if (input) {
				input.focus()
			}
		}
	)
	
	render() {
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.outerContainer}>
					<Toolbar back={false} title={"Change Password"} close={this.close} />
					
					<KeyboardAvoidingView style={styles.innerContainer} behavior={this.state.behavior}>
						<View style={{backgroundColor: 'white', paddingHorizontal: 50}}>
							<TouchableOpacity onPress={this.keyboardFocus(this.currentPasswordInput)}>
								<View style={{flexDirection: 'row'}}>
									<Text style={styles.floatingLabelActive}> Current Password </Text>
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
												returnKeyType={"done"}
												onSubmitEditing={this.onDonePressed}
												multiline={false}
												ref={(input) => {this.currentPasswordInput = input;}}
												secureTextEntry={this.state.hideCurrentPassword}
												defaultValue={this.state.currentPassword}
												onChangeText={this.validatePassword}
											/>
										</View>
										<TouchableOpacity onPress={this.toggleCurrentPasswordVisibility}>
											<Text style={textStyles.sectionHeader}>Show</Text>
										</TouchableOpacity>
									</View>
									<Image source={this.state.currentPasswordIconSrc} style={styles.validationIcon}/>
								</View>
								
								<View style={{flexDirection: 'row'}}>
									<Text style={this.state.currentPasswordErrorStyle}>Must be 8 characters</Text>
								</View>
							</TouchableOpacity>
						</View>
						
						<View style={{backgroundColor: 'white', paddingHorizontal: 50}}>
							<TouchableOpacity onPress={this.keyboardFocus(this.newPasswordInput)}>
								<View style={{flexDirection: 'row'}}>
									<Text style={styles.floatingLabelActive}>New Password</Text>
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
												returnKeyType={"done"}
												onSubmitEditing={this.onDonePressed}
												multiline={false}
												ref={(input) => {this.newPasswordInput = input;}}
												secureTextEntry={this.state.hideNewPassword}
												defaultValue={this.state.newPassword}
												onChangeText={this.validateNewPassword}
											/>
										</View>
										<TouchableOpacity onPress={this.toggleNewPasswordVisibility}>
											<Text style={textStyles.sectionHeader}>Show</Text>
										</TouchableOpacity>
									</View>
									<Image source={this.state.newPasswordIconSrc} style={styles.validationIcon}/>
								</View>
								
								<View style={{flexDirection: 'row'}}>
									<Text style={this.state.newPasswordErrorStyle}>Must be different than current password</Text>
								</View>
							</TouchableOpacity>
						</View>
						
						
						<View style={{backgroundColor: 'white', paddingHorizontal: 50}}>
							<TouchableOpacity onPress={this.keyboardFocus(this.confirmNewPasswordInput)}>
								<View style={{flexDirection: 'row'}}>
									<Text style={styles.floatingLabelActive}>Confirm New Password</Text>
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
												multiline={false}
												returnKeyType={"done"}
												onSubmitEditing={this.onDonePressed}
												ref={(input) => {this.confirmNewPasswordInput = input;}}
												secureTextEntry={this.state.hideConfirmNewPassword}
												defaultValue={this.state.confirmNewPassword}
												onChangeText={this.validateConfirmNewPassword}
											/>
										</View>
										<TouchableOpacity onPress={this.toggleConfirmNewPasswordVisibility}>
											<Text style={textStyles.sectionHeader}>Show</Text>
										</TouchableOpacity>
									</View>
									<Image source={this.state.confirmNewPasswordIconSrc} style={styles.validationIcon}/>
								</View>
								
								<View style={{flexDirection: 'row'}}>
									<Text style={this.state.confirmNewPasswordErrorStyle}>{this.state.confirmNewPasswordErrorMessage}</Text>
								</View>
							</TouchableOpacity>
						</View>
						
					</KeyboardAvoidingView>
					
					<View style={{flex: 1}} />
					
					<TouchableOpacity style={{flexDirection: 'row'}} disabled={this.state.formIsInvalid} onPress={this.handleNext}>
						<Text style={this.state.buttonStyle}> Save Changes </Text>
					</TouchableOpacity>
					
				</View>
			</TouchableWithoutFeedback>
		);
	}
	
	validatePassword = (password) => {
		if (password.length > 7) {
			this.setState(
				{
					currentPasswordIconSrc: checkmarkValidText,
					currentPassword: password,
					currentPasswordErrorStyle: styles.errorLabelInactive
				}, this.setFormState);
		} else {
			this.setState(
				{
					currentPasswordIconSrc: checkmarkInvalidText,
					currentPassword: password,
					currentPasswordErrorStyle: styles.errorLabelActive
				}, this.setFormState);
		}
	};
	
	validateNewPassword = (newPassword) => {
		if (newPassword.length > 7 && (newPassword !== this.state.currentPassword)) {
			this.setState(
				{
					newPasswordIconSrc: checkmarkValidText,
					newPassword: newPassword,
					newPasswordErrorStyle: styles.errorLabelInactive
				}, this.setFormState);
		} else {
			this.setState(
				{
					newPasswordIconSrc: checkmarkInvalidText,
					newPassword: newPassword,
					newPasswordErrorStyle: styles.errorLabelActive
				}, this.setFormState);
		}
	}
	
	validateConfirmNewPassword = (confirmNewPassword) => {
		if (confirmNewPassword === this.state.newPassword) {
			this.setState(
				{
					confirmNewPasswordIconSrc: checkmarkValidText,
					confirmNewPassword: confirmNewPassword,
					confirmNewPasswordErrorStyle: styles.errorLabelInactive
				}, this.setFormState);
		} else {
			this.setState(
				{
					confirmNewPasswordIconSrc: checkmarkInvalidText,
					confirmNewPassword: confirmNewPassword,
					confirmNewPasswordErrorStyle: styles.errorLabelActive
				}, this.setFormState);
		}
	}
	
	setFormState = () => {
		if (this.formValidated()) {
			this.setState({buttonStyle: [styles.buttonActive, textStyles.primaryButton], formIsInvalid: false});
		} else {
			this.setState({buttonStyle: [styles.buttonInactive, textStyles.primaryButtonInactive], formIsInvalid: true});
		}
	}
	
	formValidated = () => (
		(this.state.currentPassword && this.state.newPassword && this.state.confirmNewPassword) &&
		(this.state.currentPassword !== this.state.newPassword) &&
		(this.state.newPassword === this.state.confirmNewPassword)
	)
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
	 backgroundColor: 'white',
	 justifyContent: 'flex-end'
 },
 scrollContainer: {
	 flex: 1,
 },
 headline: {
	 textAlign: 'left',
	 lineHeight: 0,
	 marginBottom: 55
 },
 textButton: {
	 marginRight: 20,
	 marginTop: 40
 },
 innerContainer: {
	 flex: 2,
	 backgroundColor: 'white',
	 width: Dimensions.get('window').width,
	 paddingTop: 50
 },
 logo: {
	 marginBottom: 10,
	 marginTop: 20,
	 width: 250,
	 resizeMode: 'contain'
 },
 inputContainer: {
	 flexDirection: 'row',
	 alignItems: 'center',
	 flex: 1,
	 justifyContent: 'space-between'
 },
 outerInputContainer: {
	 flexDirection: 'row',
	 alignItems: 'center'
 },
 innerInputContainer: {
	 flex: 1,
	 borderBottomWidth: 1,
	 borderColor: 'rgb(231, 231, 231)',
 },
 forgotPasswordContainer: {
	 alignItems: 'center',
	 marginTop: 140,
	 marginBottom: 110,
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
 forms: {
	 height: 50,
	 textAlign: 'left',
	 backgroundColor: 'white',
	 marginTop: 20,
	 fontFamily: 'Nunito Sans'
 },
 formsRow: {
	 height: 50,
	 textAlign: 'left',
	 backgroundColor: 'white'
 },
 floatingLabelActive: {
	 flex: 1,
	 fontSize: 10,
	 marginBottom: 10,
	 color: palette.blueberry,
	 textAlign: 'left',
	 fontFamily: 'Nunito Sans'
 },
 floatingLabelInactive: {
	 opacity: 0,
	 fontSize: 10,
	 marginTop: 10,
	 fontFamily: 'Nunito Sans'
 },
 errorLabelActive:
	 {
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
 text: {
	 color: 'black',
	 fontSize: 12,
	 textAlign: 'center',
	 fontFamily: 'Nunito Sans',
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
});
