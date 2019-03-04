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

import Permissions from 'react-native-permissions'

import { textStyles } from "../../../styles";
import { heartBack, locationImage } from '../../../assets/index';

const screenText =  "This app needs your location permissions turned on to display the offers closest to you and allow you to redeem them. Select \"allow\" on the next screen."

export default class LocationPermission extends Component {
	
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
	
	locationPermission = () => {
		Permissions.request('location', {type: 'whenInUse'}).then(response => {
			this.props.submitRegistrationAndFetchData(this.props.registration);
		})
	}
	
	handlePress = () => {
		this.locationPermission();
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
						<Text style={[textStyles.headline, styles.headline]}>Success!</Text>
						<Text style={textStyles.subheading}>{screenText}</Text>
					</View>
					
					<View style={{flex: 1.4}}>
						<Image source={locationImage} style={styles.bannerImage} />
					</View>
					
					<TouchableOpacity style={styles.bottomButton} onPress={this.handlePress.bind(this)}>
						<Text style={[textStyles.primaryButton, this.state.buttonStyle]}> Okay </Text>
					</TouchableOpacity>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}



const styles = StyleSheet.create({
 bannerImage: {
	 resizeMode: 'contain',
 },
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
	 marginTop: 50
 },
 toolbarContainer: {
	 flexDirection: 'row',
	 justifyContent: 'space-between',
	 alignItems: 'center',
 },
 secondaryContainer: {
	 flex: 1,
	 backgroundColor: 'white',
	 marginHorizontal: 50,
	 marginTop: 50,
	 marginBottom: 40
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
	bottomButton: {
 		position: 'absolute',
		bottom: 0,
		flexDirection: 'row',
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
	 backgroundColor: 'rgb(240, 81, 51)',
 },
});