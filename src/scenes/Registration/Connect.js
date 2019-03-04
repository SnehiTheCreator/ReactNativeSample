import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	Image,
	View,
	TouchableWithoutFeedback,
	TouchableOpacity,
	BackHandler,
	Keyboard
} from 'react-native';

import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'

import Communications from 'react-native-communications';

import { textStyles } from "../../../styles";
import { heartBack } from '../../../assets/index';

const CANCEL_INDEX = 0
const options = ['Cancel', 'Call us', 'Email us'];

const screenText =  "We\'d love to chat with you about perks of being a Midtown Alliance member."

export default class Connect extends Component {
	
	constructor(props){
		super(props);
	}
	
	state = {
		buttonStyle: styles.buttonActive,
		isUnknownPartner: false,
		formStyle: styles.formGrey
	};
	
	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', () => this.androidBackPress() );
	}
	
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', () => this.androidBackPress() );
	}
	
	androidBackPress = () => {
		this.props.goBack();
		return true;
	}
	
	showActionSheet = () => {
		this.ActionSheet.show()
	}
	
	handlePress = (i) => {
		if (i === 1) {
			Communications.phonecall('4048920050', true);
		} else if (i === 2) {
			Communications.email(['appsupport@midtownatl.com'],null,null,'Question About My Midtown Alliance App',null)
		}
		this.props.resetToLanding();
	}
	
	render() {
		return(
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.backContainer}>
					
					<View style={styles.toolbarContainer}>
						<TouchableOpacity onPress={this.props.goBack}>
							<Image source={heartBack} style={styles.backIcon} />
						</TouchableOpacity>
						
						<TouchableOpacity onPress={this.props.initiateGuestMode}>
							<Text style={[textStyles.textButton, styles.textButton]}>Explore in Guest Mode</Text>
						</TouchableOpacity>
					</View>
					
					<View style={styles.secondaryContainer}>
						<Text style={[textStyles.headline, styles.headline]}>Let's Connect!</Text>
						<Text style={textStyles.subheading}>{screenText}</Text>
					</View>
					
					<TouchableOpacity style={{flexDirection: 'row' }} onPress={this.showActionSheet}>
						<Text style={[this.state.buttonStyle, textStyles.primaryButton]}> Contact Us </Text>
					</TouchableOpacity>
					<ActionSheet
						ref={o => this.ActionSheet = o}
						options={options}
						cancelButtonIndex={CANCEL_INDEX}
						onPress={this.handlePress}
					/>
				</View>
			</TouchableWithoutFeedback>
		);
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
 headline: {
	 textAlign: 'left',
	 lineHeight: 0,
	 marginBottom: 31
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
	 fontSize: 16,
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
 buttonActive: {
	 flex: 1,
	 paddingTop: 25,
	 paddingBottom: 25,
	 backgroundColor: 'rgb(240, 81, 51)',
 },
});