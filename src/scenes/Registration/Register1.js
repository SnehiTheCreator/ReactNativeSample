import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	ScrollView,
	BackHandler,
	Keyboard,
  KeyboardAvoidingView
} from 'react-native';

import CheckBox from 'react-native-checkbox';

import { palette, textStyles } from "../../../styles";

import {
	checkboxChecked,
	checkboxUnchecked,
	checkmarkInvalidText,
	checkmarkValidText,
	iconBlank,
	heartBack
} from '../../../assets/index';

const screenText = "Opt in for email updates about this program? Midtown Alliance will never share your contact info with others.";

/**
Screen responsible for gathering user email, zip code, and newsletter opt in status
**/
export default class Register1 extends React.Component {
  
  constructor(props){
    super(props);
    this.currentUser = props.currentUser;
  }

  state = {
    emailIconSrc: iconBlank,
    zipIconSrc: iconBlank,
    emailLabelStyle: styles.floatingLabelInactive,
    zipLabelStyle: styles.floatingLabelInactive,
    emailErrorStyle: styles.errorLabelInactive,
    zipErrorStyle: styles.errorLabelInactive,
    agreeToEmails: true,
    ctemailaddress: null,
    ctzip: null,
    formIsInvalid: true,
    emailValid: false,
    zipValid: false,
    buttonStyle: [styles.buttonInactive, textStyles.primaryButtonInactive]
  };

  componentDidMount() {
    //if we already have a user email and zip and they come back to page 1
    
    if (this.props.registration) {
      this.validateEmail(this.props.registration.ctemailaddress);
      this.validateZip(this.props.registration.ctzip);
    }

    BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress);
  }
  
  componentWillReceiveProps(nextProps){

  }

  androidBackPress = () => {
    this.props.goBack()
    return true;
  }

  handleNext = () => {
    let registration = this.props.registration ? {...this.props.registration} : {};
    registration.ctemailaddress = this.state.ctemailaddress;
    registration.ctzip = this.state.ctzip;
    
    this.props.updateRegistration(registration);
    
    this.props.navigateToStatusForm();
  }
  
  toggleEmailsCheckbox = (checked) => {
		this.setState({ agreeToEmails: !checked})
  }
	
	onDonePressed = () => {
		if (this.state.formIsInvalid) {
			Keyboard.dismiss()
		} else {
			this.handleNext()
		}
	}

  render() {
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
            <Text style={[textStyles.headline, styles.headline]}>Create Account</Text>

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
                        autoFocus={false}
                        returnKeyType={"done"}
                        onSubmitEditing={this.onDonePressed}
                        keyboardType="email-address"
                        ref={(input) => {this.emailInput = input;}}
                        multiline={false}
                        defaultValue={this.state.ctemailaddress}
                        onChangeText={this.validateEmail}
                      />
                    </View>
                  </View>
                  <Image source={this.state.emailIconSrc} style={styles.validationIcon} />
                </View>
  
                <View style={{flexDirection: 'row'}}>
                  <Text style={this.state.emailErrorStyle}>Must be a valid email address</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.inputLabelContainer}>
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
                        returnKeyType={"done"}
                        onSubmitEditing={this.onDonePressed}
                        keyboardType="numeric"
                        multiline={false}
                        ref={(input) => {this.zipInput = input;}}
                        defaultValue={this.state.ctzip}
                        onChangeText={this.validateZip}
                        onFocus={() => this.showZipLabel()}
                      />
                    </View>
                  </View>
                  <Image source={this.state.zipIconSrc} style={styles.validationIcon} />
                </View>
  
                <View style={{flexDirection: 'row'}}>
                  <Text style={this.state.zipErrorStyle}>Must be a 5 digit number</Text>
                </View>
              </TouchableOpacity>
            </View>
	
						<View style={styles.checkboxContainer}>
							<CheckBox
								checked={this.state.agreeToEmails}
                label={null}
								checkedImage={checkboxChecked}
								uncheckedImage={checkboxUnchecked}
								checkboxStyle={{width: 13, height: 13}}
								labelStyle={styles.text}
								underlayColor='transparent'
								onChange={this.toggleEmailsCheckbox}
							/>
							<Text style={styles.checkboxSubtitle} multiline={true}>{screenText}</Text>
						</View>

          </KeyboardAvoidingView>
          
          <View style={{flex: 1}} />
          
          <TouchableOpacity style={{flexDirection: 'row'}} disabled={this.state.formIsInvalid} onPress={this.handleNext}>
            <Text style={[textStyles.primaryButton, this.state.buttonStyle]}> Next: Membership Info </Text>
          </TouchableOpacity>
          
        </View>
      </TouchableWithoutFeedback>
    );
  }

  showZipLabel = () => {
    this.setState({
      zipLabelStyle: styles.floatingLabelActive
    });
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email)) {
      this.setState(
        {
          emailIconSrc: checkmarkValidText,
          ctemailaddress: email,
          emailErrorStyle: styles.errorLabelInactive,
          emailValid: true
        }, this.setFormState);
    } else {
      this.setState(
        {
          emailIconSrc: checkmarkInvalidText,
					ctemailaddress: email,
          emailErrorStyle: styles.errorLabelActive,
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
          ctzip: zip,
          zipErrorStyle: styles.errorLabelInactive,
          zipValid: true
        }, this.setFormState);
    } else {
      this.setState(
        {
          zipIconSrc: checkmarkInvalidText,
          ctzip: zip,
          zipErrorStyle: styles.errorLabelActive,
					zipValid: false
        }, this.setFormState);
    }
  }

  setFormState = () => {
    if(this.state.ctzip && this.state.ctemailaddress && this.state.emailValid && this.state.zipValid) {
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
    justifyContent: 'flex-end',
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
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingTop: 30
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
  checkboxContainer: {
     flexDirection: 'row',
    alignItems: 'center',
		marginBottom: 20,
    marginHorizontal: 50,
		marginTop: 40
  },
  checkboxSubtitle: {
    fontFamily: 'Nunito Sans',
    color: 'black',
    fontSize: 12,
    marginLeft: 10
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
    height: 42,
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
    backgroundColor: 'rgb(240, 81, 51)',
  },
});
