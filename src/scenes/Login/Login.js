import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	BackHandler,
	Keyboard,
	Dimensions
} from 'react-native';

import SuccessBanner from "../../components/modals/SuccessBanner";
import { toastIds } from "../../util/values";
import { authErrorTypes } from "../../util/values";

import { palette, textStyles } from "../../../styles";

import {
	checkmarkInvalidText,
	checkmarkValidText,
	iconBlank,
	heartBack
} from '../../../assets/index';

const PASSWORD_RESET_EMAIL_TEXT = "Password reset email sent";

export default class Login extends Component {
	
	errorMessages = {
		invalidEmail: "Must be a valid email address",
		userNotFound: "Email not found",
		passwordLength: "Must be 8 characters",
		wrongPassword: "Incorrect password"
	}
	
	state = {
		emailIconSrc: iconBlank,
		passwordIconSrc: iconBlank,
		emailLabelStyle: styles.floatingLabelInactive,
		passwordLabelStyle: styles.floatingLabelInactive,
		emailErrorStyle: styles.errorLabelInactive,
		passwordErrorStyle: styles.errorLabelInactive,
		agreeToEmails: true,
		userEmail: null,
		userPassword: null,
		hidePassword: true,
		formIsInvalid: true,
		emailInvalid: true,
		emailErrorMessage: this.errorMessages.invalidEmail,
		passwordErrorMessage: this.errorMessages.passwordLength,
		forgotPasswordStyle: [textStyles.textButton, styles.forgotPasswordInactive],
		buttonStyle: [styles.buttonInactive, textStyles.primaryButtonInactive],
		passwordResetBannerVisible: false
	};
	
	componentDidMount() {
		//if we already have a user email and password and they come back to page
		BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
	}
	
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress);
	}
	
	componentWillReceiveProps(nextProps){
		if (nextProps.loginErrorType) {
			if (nextProps.loginErrorType === authErrorTypes.USERNAME.code) {
				this.setState({
					emailErrorMessage: this.errorMessages.userNotFound,
					emailErrorStyle: styles.errorLabelActive,
					passwordErrorStyle: styles.errorLabelInactive
				})
			}
			
			if (nextProps.loginErrorType === authErrorTypes.PASSWORD.code) {
				this.setState({
					emailErrorStyle: styles.errorLabelInactive,
					passwordErrorMessage: this.errorMessages.wrongPassword,
					passwordErrorStyle: styles.errorLabelActive
			})
			}
		}
		
		this.showConfirmationToast(nextProps.showToast);
	}
	
	showConfirmationToast = (id) => {
		setTimeout( () => {
			if(id == toastIds.FORGOT_PASSWORD_TOAST_ID) {
				this.setState({
					passwordResetBannerVisible: true
				});
			} else {
				return;
			}
		}, 300);
	}
	
	hideConfirmationModal = (id) => {
		this.setState({
			passwordResetBannerVisible: false,
		}, this.props.clearToasts);
	}
	
	androidBackPress = () => {
		this.props.resetToLanding();
		return true;
	}
	
	handleNext = () => {
		let loginParams = {};
		loginParams.userEmail = this.state.userEmail;
		loginParams.userPassword = this.state.userPassword;

		this.props.login(loginParams)
		// this.props.testLogin()
	}
	
	togglePasswordVisibility = () => {
		this.setState({hidePassword: !this.state.hidePassword})
	}
	
	handleForgotPassword = () => {
		this.props.sendForgetPasswordEmail(this.state.userEmail)
	}
	
	onDonePressed = () => {
		if (this.state.formIsInvalid) {
			Keyboard.dismiss()
		} else {
			this.handleNext()
		}
	}
	
	render() {
		
		let passwordResetBanner = (
			<SuccessBanner
				modalVisible={this.state.redemptionSuccessBannerVisible}
				id={toastIds.FORGOT_PASSWORD_TOAST_ID}
				hideConfirmationModal={this.hideConfirmationModal}
				modalText={PASSWORD_RESET_EMAIL_TEXT} />
		)
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.outerContainer}>
					
					<View style={styles.toolbarContainer}>
						<TouchableOpacity onPress={this.props.resetToLanding}>
							<Image source={heartBack} style={styles.backIcon} />
						</TouchableOpacity>
						
						<TouchableOpacity onPress={this.props.initiateGuestMode}>
							<Text style={[textStyles.textButton, styles.textButton]}>Explore in Guest Mode</Text>
						</TouchableOpacity>
					</View>
					
					<KeyboardAvoidingView style={styles.innerContainer} behavior={'position'}>
						<Text style={[textStyles.headline, styles.headline]}>Log In</Text>
						
						<View style={styles.inputLabelContainer}>
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
												ref={(input) => {this.emailInput = input;}}
												autoFocus={false}
												keyboardType="email-address"
												returnKeyType={"done"}
												onSubmitEditing={this.onDonePressed}
												multiline={false}
												defaultValue={this.state.userEmail}
												onChangeText={this.validateEmail}
												onFocus={() => this.showEmailLabel()}
											/>
										</View>
									</View>
									<Image source={this.state.emailIconSrc} style={styles.validationIcon} />
								</View>
								
								<View style={{flexDirection: 'row'}}>
									<Text style={this.state.emailErrorStyle}>{this.state.emailErrorMessage}</Text>
								</View>
							</TouchableOpacity>
						</View>
						
						<View style={styles.inputLabelContainer}>
							<TouchableOpacity onPress={() => {if (this.passwordInput) this.passwordInput.focus()}}>
								<View style={{flexDirection: 'row'}}>
									<Text style={styles.floatingLabelActive}>Password</Text>
								</View>
								
								<View style={styles.outerInputContainer}>
									
									<View style={styles.inputContainer}>
										<View style={styles.innerInputContainer}>
											<TextInput
												style={styles.formsRow}
												underlineColorAndroid='rgba(0,0,0,0)'
												autoCapitalize="none"
												autoCorrect={false}
												ref={(input) => {this.passwordInput = input;}}
												autoFocus={false}
												multiline={false}
												returnKeyType={"done"}
												onSubmitEditing={this.onDonePressed}
												secureTextEntry={this.state.hidePassword}
												defaultValue={this.state.userPassword}
												onChangeText={this.validatePassword}
												onFocus={() => this.showPasswordLabel()}
											/>
										</View>
										<TouchableOpacity onPress={this.togglePasswordVisibility}>
											<Text style={textStyles.sectionHeader}>Show</Text>
										</TouchableOpacity>
									</View>
									<Image source={this.state.passwordIconSrc} style={styles.validationIcon} />
								</View>
								
								<View style={{flexDirection: 'row'}}>
									<Text style={this.state.passwordErrorStyle}>{this.state.passwordErrorMessage}</Text>
								</View>
							</TouchableOpacity>
						</View>
						
						<View style={styles.forgotPasswordContainer}>
							<TouchableOpacity style={{flexDirection: 'row'}}  disabled={this.state.emailInvalid} onPress={this.handleForgotPassword}>
								<Text style={this.state.forgotPasswordStyle}>I forgot my password</Text>
							</TouchableOpacity>
						</View>
					
					</KeyboardAvoidingView>
					
					<View style={{flex: 1}}/>
					
					<TouchableOpacity style={{flexDirection: 'row'}} disabled={this.state.formIsInvalid} onPress={this.handleNext}>
						<Text style={this.state.buttonStyle}> Log In </Text>
					</TouchableOpacity>
					
					{this.state.passwordResetBannerVisible ? passwordResetBanner : null}
				</View>
			</TouchableWithoutFeedback>
		);
	}
	
	showEmailLabel = () => {
		this.setState({
			emailLabelStyle: styles.floatingLabelActive
		});
	}

	showPasswordLabel = () => {
		this.setState({
			passwordLabelStyle: styles.floatingLabelActive
		});
	}
	
	validateEmail = (email) => {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(re.test(email)) {
			this.setState(
				{
					emailIconSrc: checkmarkValidText,
					userEmail: email,
					emailErrorStyle: styles.errorLabelInactive,
					emailInvalid: false,
					forgotPasswordStyle: textStyles.textButton
				}, this.setFormState);
		} else {
			this.setState(
				{
					emailIconSrc: checkmarkInvalidText,
					userEmail: null,
					emailErrorStyle: styles.errorLabelActive,
					emailErrorMessage: this.errorMessages.invalidEmail,
					emailInvalid: true,
					forgotPasswordStyle: [textStyles.textButton, styles.forgotPasswordInactive]
				}, this.setFormState);
		}
	};
	
	validatePassword = (password) => {
		if(password.length > 7) {
			this.setState(
				{
					passwordIconSrc: checkmarkValidText,
					userPassword: password,
					passwordErrorStyle: styles.errorLabelInactive
				}, this.setFormState(true));
		} else {
			this.setState(
				{
					passwordIconSrc: checkmarkInvalidText,
					userPassword: password,
					passwordErrorStyle: styles.errorLabelActive,
					passwordErrorMessage: this.errorMessages.passwordLength
				}, this.setFormState(false));
		}
	}
	
	setFormState = (formIsValid) => {
		return () => {
			if(this.state.userPassword && this.state.userEmail && formIsValid) {
				this.setState({ buttonStyle: [styles.buttonActive, textStyles.primaryButton], formIsInvalid: false});
			} else {
				this.setState({ buttonStyle: [styles.buttonInactive, textStyles.primaryButtonInactive], formIsInvalid: true});
			}
		}
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
	 marginBottom: 40,
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
	 paddingBottom: 55,
	 paddingHorizontal: 50,
	 backgroundColor: 'white'
 },
 textButton: {
	 marginRight: 20,
	 marginTop: 40
 },
 innerContainer: {
 	 flex: 3,
	 backgroundColor: 'white',
	 width: Dimensions.get('window').width,
	 paddingTop: 30
 },
 logo: {
	 marginBottom: 10,
	 marginTop: 20,
	 width: 250,
	 resizeMode: 'contain'
 },
	inputLabelContainer: {
		paddingHorizontal: 50,
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
		alignItems: 'center'
	},
 innerInputContainer: {
	 flex: 1
 },
 validationIcon: {
	 width: 13,
	 height: 10,
	 marginRight: 0,
	 marginLeft: 12,
	 resizeMode: 'contain'
 },
 formsRow: {
	 height: 50,
	 textAlign: 'left',
	 backgroundColor: 'white',
 },
 floatingLabelActive: {
	 flex: 1,
	 fontSize: 10,
	 marginBottom: 10,
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
 forgotPasswordContainer: {
	 alignItems: 'center',
	 justifyContent: 'center',
	 marginBottom: 20,
	 marginTop: 40
 },
	forgotPasswordInactive: {
		color: 'rgb(119, 119, 119)',
	}
});
