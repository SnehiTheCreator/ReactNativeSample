import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  BackHandler,
  Keyboard
} from 'react-native';

import { textStyles } from "../../../styles";
import { userStatusChoices } from '../../util/values';

import { PredictiveSearchModal } from '../../components/modals/index';
import { TermsPrivacyDisclaimer } from '../../components/widgets/index';
import { heartBack, searchButton } from '../../../assets/index';

const helpPartnerObject = { objid: "none", label: "I can't find the organization I'm looking for" };

/**
Screen responsible for gathering user's Midtown partner information
and submitting registration to CMS
**/
export default class AffiliationForm extends Component {
  
  constructor(props){
    super(props);
    this.setViewText()
  }
  
  state = {
    modalVisible: false,
    inputText: '',
    formIsInvalid: true,
    buttonStyle: styles.buttonInactive,
    isUnknownPartner: false,
    formStyle: styles.formGrey
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.androidBackPress() );
    if (this.props.currentUser && this.props.currentUser.ctfirm) {
      this.setState({
        inputText: this.props.currentUser.ctfirm,
        buttonStyle: styles.buttonActive,
        formIsInvalid: false
      })
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => this.androidBackPress() );
  }
  
  componentWillReceiveProps(nextProps){
	  this.setViewText()
  }

  androidBackPress = () => {
    this.props.goBack();
    return true;
  }
  
  handleSubmit = () => {
    this.props.updateRegistration({...this.props.registration, ctfirm: this.state.inputText});
    if (this.props.edit) {
			this.props.affiliationFormComplete({...this.props.registration, ctfirm: this.state.inputText});
    } else {
			this.props.affiliationFormComplete();
    }
  }
  
  setViewText = () => {
  
    switch (this.props.registration.ctstatus) {
      case userStatusChoices.LIVE.id:
        this.hintText = "Ex. \"805 Peachtree Lofts\"";
        this.titleText = "Awesome!";
        this.subtitleText = "To continue, please enter the name of your residential community.";
        break;
      case userStatusChoices.WORK.id:
        this.hintText = "Ex. \"Georgia Power\"";
        this.titleText = "Terrific!";
        this.subtitleText = "To continue, please enter the name of the company you work for.";
        break;
      case userStatusChoices.BOTH.id:
        this.hintText = "Ex. \"Georgia Power\"";
        this.titleText = "Lucky Duck!";
        this.subtitleText = "To continue, please let us know who your membership is through.";
        break;
      default:
				this.hintText = "Ex. \"805 Peachtree Lofts\"";
				this.titleText = "Okay!";
				this.subtitleText = "To continue, please let us know who your membership is through.";
     }
  }

  render() {
    if(this.state.isUnknownPartner) {
      return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.backContainer}>
          
          <TouchableOpacity onPress={this.props.goBack}>
            <Image source={heartBack} style={styles.backIcon} />
          </TouchableOpacity>

          <View style={styles.secondaryContainer}>
              <Text style={styles.header}>No worries! </Text>
              <Text style={styles.subheader}>To continue, please tell us who your membership is through</Text>

              <View style={{borderColor: 'gray', borderBottomWidth: 1}}>
                <TextInput
                  underlineColorAndroid='rgba(0,0,0,0)'
                  style={{height: 40, fontFamily: 'Nunito Sans' }}
                  onChangeText={this.validateInput}
                  placeholder="Ex. 805 Peachtree Lofts" />
              </View>
            <TermsPrivacyDisclaimer />

          </View>

          <TouchableOpacity style={{flexDirection: 'row' }} onPress={() => {this.handleSubmit()}} disabled={this.state.formIsInvalid}>
            <Text style={[textStyles.primaryButton, this.state.buttonStyle]}> Submit </Text>
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
      );
    }
    
    let guestModeLink = (
      <TouchableOpacity onPress={this.props.initiateGuestMode}>
        <Text style={[textStyles.textButton, styles.textButton]}>Explore in Guest Mode</Text>
      </TouchableOpacity>
    )

    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.backContainer}>
          
          <View style={styles.toolbarContainer}>
            <TouchableOpacity onPress={this.props.goBack}>
              <Image source={heartBack} style={styles.backIcon} />
            </TouchableOpacity>
    
            {this.props.currentUser ? null : guestModeLink}
          </View>

          <PredictiveSearchModal partners={this.props.partners} hint={this.hintText} modalVisible={this.state.modalVisible} helpPartnerObject={helpPartnerObject} closeModal={this.closePredictiveSearchModal}/>
          <View style={styles.secondaryContainer}>
            <View>
              <Text style={styles.header}>{this.titleText}</Text>
              <Text style={styles.subheader}>{this.subtitleText}</Text>

              <TouchableOpacity style={styles.inputContainer} onPress={() => this.setState({modalVisible: true})}>
                <View style={styles.innerInputContainer}>
                  <Text style={this.state.formStyle}> {this.state.inputText} </Text>
                </View>
                <Image source={searchButton} style={styles.searchIcon} />
              </TouchableOpacity>
            </View>

            <TermsPrivacyDisclaimer />

          </View>

          <TouchableOpacity style={{flexDirection: 'row' }} onPress={() => {this.handleSubmit()}} disabled={this.state.formIsInvalid}>
            <Text style={[textStyles.primaryButton, this.state.buttonStyle]}>Submit</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  validateInput = (input) => {
      if(input.length >= 2){
        this.setState({
          formIsInvalid: false,
          buttonStyle: styles.buttonActive
        });
      } else {
        this.setState({
          formIsInvalid: true,
          buttonStyle: styles.buttonInactive
        });
      }
  }

  closePredictiveSearchModal = (inputText) => {
    if(inputText === "back") {
      this.setState({ modalVisible: false, inputText: this.hintText, formIsInvalid: true, buttonStyle: styles.buttonInactive, formStyle: styles.formGrey});
    } else if(inputText === helpPartnerObject.label) {
      this.setState({ modalVisible: false, inputText: '', formIsInvalid: true, buttonStyle: styles.buttonInactive, isUnknownPartner: true});
    } else {
      this.setState({ modalVisible: false, inputText: inputText, formIsInvalid: false, buttonStyle: styles.buttonActive, formStyle: styles.formBlue});
    }
  }
}

const styles = StyleSheet.create({
  backContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginLeft: 20,
    marginTop: 40,
    resizeMode: 'contain'
  },
   textButton: {
     marginRight: 20,
     marginTop: 40
   },
   toolbarContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 40
   },
  secondaryContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    margin: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'rgb(119, 119, 119)',
    marginTop: 50,
  },
  innerInputContainer: {
    flex: 1
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  header: {
    fontSize: 22,
    textAlign: 'left',
    color: 'rgb(22, 20, 95)',
    fontFamily: 'Rokkitt',
    fontWeight: 'bold',
    height: 50,
    paddingTop: 10,
    marginBottom: 20
  },
  subheader: {
    fontSize: 14,
    textAlign: 'left',
    color: 'rgb(22, 20, 95)',
  },
  instructions: {
    textAlign: 'center',
    color: 'black',
    marginBottom: 5,
    fontFamily: 'Nunito Sans',
  },
  forms: {
    textAlign: 'left',
    backgroundColor: 'white',
    fontFamily: 'Nunito Sans',
    color: 'rgb(22, 20, 95)',
    marginBottom: 10,
  },
  formGrey: {
    textAlign: 'left',
    backgroundColor: 'white',
    fontFamily: 'Nunito Sans',
    color:'rgb(119, 119, 119)',
    marginBottom: 10,
  },
  formBlue: {
    textAlign: 'left',
    backgroundColor: 'white',
    fontFamily: 'Nunito Sans',
    color: 'rgb(22, 20, 95)',
    marginBottom: 10,
  },
  back: {
    width: 50,
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 20
  },
  buttonInactive: {
    flex: 1,
    paddingTop: 25,
    textAlign: 'center',
    paddingBottom: 25,
    color: 'rgb(70, 11, 0)',
    backgroundColor: 'rgb(240, 81, 51)',
  },
  buttonActive: {
    flex: 1,
		textAlign: 'center',
    paddingTop: 25,
    paddingBottom: 25,
    color: 'white',
    backgroundColor: 'rgb(240, 81, 51)',
  },
});