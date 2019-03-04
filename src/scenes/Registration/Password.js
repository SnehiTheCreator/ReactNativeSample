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
	Platform
} from 'react-native';


import { palette, textStyles } from "../../../styles";

import {
	checkmarkInvalidText,
	checkmarkValidText,
	iconBlank,
	heartBack
} from '../../../assets/index';

export default class Password extends Component {
	
	constructor(props){
		super(props);
		this.currentUser = props.currentUser;
	}
	
	state = {
		passwordIconSrc: iconBlank,
		confirmPasswordIconSrc: iconBlank,
		passwordLabelStyle: styles.floatingLabelInactive,
		confirmPasswordLabelStyle: styles.floatingLabelInactive,
		passwordErrorStyle: styles.errorLabelInactive,
		confirmPasswordErrorStyle: styles.errorLabelInactive,
		userPassword: null,
		hidePassword: true,
		userConfirmPassword: null,
		hideConfirmPassword: true,
		formIsInvalid: true,
		buttonStyle: [styles.buttonInactive, textStyles.primaryButtonInactive]
	};
	
	componentDidMount() {
		//if we already have a user password and confirmPassword and they come back to page 1
		
		BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
	}
	
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress);
	}
	
	componentWillReceiveProps(nextProps){
	
	}
	
	androidBackPress = () => {
		this.props.goBack();
		return true;
	}
	
	handleNext = () => {
		let registration = this.props.registration ? {...this.props.registration} : {};
		registration.userPassword = this.state.userPassword;
		
		this.props.updateRegistration(registration);
		
		this.props.navigateToLocationPermission();
	}
	
	togglePasswordVisibility = () => {
		this.setState({hidePassword: !this.state.hidePassword})
	}
	
	toggleConfirmPasswordVisibility = () => {
		this.setState({hideConfirmPassword: !this.state.hideConfirmPassword})
	}
	
	render() {
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.outerContainer}>
					<View style={styles.toolbarContainer}>
						<TouchableOpacity onPress={this.props.goBack}>
							<Image source={heartBack} style={styles.backIcon} />
						</TouchableOpacity>

						<TouchableOpacity onPress={this.props.initiateGuestMode}>
							<Text style={[textStyles.textButton, styles.textButton]}>Explore in Guest Mode</Text>
						</TouchableOpacity>
					</View>
					
					<KeyboardAvoidingView style={styles.innerContainer} behavior={'position'}>
						<Text style={[textStyles.headline, styles.headline]}>Create a Password</Text>
						
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
										autoFocus={false}
										multiline={false}
										secureTextEntry={this.state.hidePassword}
										defaultValue={this.state.userPassword}
										onChangeText={this.validatePassword}
									/>
								</View>
								<TouchableOpacity onPress={this.togglePasswordVisibility}>
									<Text style={textStyles.sectionHeader}>Show</Text>
								</TouchableOpacity>
							</View>
							<Image source={this.state.passwordIconSrc} style={styles.validationIcon} />
						</View>
						
						<View style={{flexDirection: 'row'}}>
							<Text style={this.state.passwordErrorStyle}>Must be 8 characters</Text>
						</View>

						<View style={{flexDirection: 'row'}}>
							<Text style={styles.floatingLabelActive}>Confirm Password</Text>
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
										secureTextEntry={this.state.hideConfirmPassword}
										defaultValue={this.state.userConfirmPassword}
										onChangeText={this.validateConfirmPassword}
									/>
								</View>
								<TouchableOpacity onPress={this.toggleConfirmPasswordVisibility}>
									<Text style={textStyles.sectionHeader}>Show</Text>
								</TouchableOpacity>
							</View>
							<Image source={this.state.confirmPasswordIconSrc} style={styles.validationIcon} />
						</View>
						
						<View style={{flexDirection: 'row'}}>
							<Text style={this.state.confirmPasswordErrorStyle}>Must match password above</Text>
						</View>
					
					</KeyboardAvoidingView>

                    <View style={styles.termsContainer}>
                        <Text style={styles.checkboxSubtitle}>By Registering, you agree to the</Text>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={this.handleNext}>
                            <Text style={textStyles.textButton}>Terms & Conditions and Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>

					<TouchableOpacity style={{flexDirection: 'row'}} disabled={this.state.formIsInvalid} onPress={this.handleNext}>
						<Text style={[textStyles.primaryButton, this.state.buttonStyle]}> Last Step: Location Permissions </Text>
					</TouchableOpacity>
					
				</View>
			</TouchableWithoutFeedback>
		);
	}

	validatePassword = (password) => {
		if(password.length > 7) {
			this.setState(
				{
					passwordIconSrc: checkmarkValidText,
					userPassword: password,
					passwordErrorStyle: styles.errorLabelInactive
				}, this.setFormState);
		} else {
			this.setState(
				{
					passwordIconSrc: checkmarkInvalidText,
					userPassword: password,
					passwordErrorStyle: styles.errorLabelActive
				}, this.setFormState);
		}
	};
	
	validateConfirmPassword = (confirmPassword) => {
		if(confirmPassword === this.state.userPassword) {
			this.setState(
				{
					confirmPasswordIconSrc: checkmarkValidText,
					userConfirmPassword: confirmPassword,
					confirmPasswordErrorStyle: styles.errorLabelInactive
				}, this.setFormState);
		} else {
			this.setState(
				{
					confirmPasswordIconSrc: checkmarkInvalidText,
					userConfirmPassword: confirmPassword,
					confirmPasswordErrorStyle: styles.errorLabelActive
				}, this.setFormState);
		}
	}
	
	setFormState = () => {
		if(this.state.userPassword && this.state.userConfirmPassword && (this.state.userPassword === this.state.userConfirmPassword)) {
			this.setState({ buttonStyle: [styles.buttonActive, textStyles.primaryButton], formIsInvalid: false });
		} else {
			this.setState({ buttonStyle: [styles.buttonInactive, textStyles.primaryButtonInactive], formIsInvalid: true });
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
	 marginBottom: 45
 },
 textButton: {
	 marginRight: 20,
	 marginTop: 40
 },
 innerContainer: {
	 flex: 1,
	 justifyContent: 'center',
	 backgroundColor: 'white',
     paddingTop: Platform.OS === 'ios' ? 50 : 20,
     marginRight: 50,
     marginLeft: 50
 },
 logo: {
	 marginBottom: 10,
	 marginTop: 20,
	 width: 250,
	 resizeMode: 'contain'
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
 termsContainer: {
	 alignItems: 'center',
	 marginTop: 30,
	 marginBottom: 25,
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
	 color: 'rgb(70, 11, 0)',
	 backgroundColor: 'rgb(240, 81, 51)',
 },
 buttonActive: {
	 flex: 1,
	 paddingTop: 25,
	 paddingBottom: 25,
	 color: 'white',
	 backgroundColor: 'rgb(240, 81, 51)'
 },
});
