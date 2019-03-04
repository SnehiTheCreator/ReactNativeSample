import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
	ImageBackground,
} from 'react-native';

import {connect} from 'react-redux';

import { navigateTo } from "./actions/navigation_actions";

import { fetchPartners, initiateGuestMode } from "./actions/session_actions";

import { palette, textStyles } from "../styles";

import {
  logoAtlanta,
	landingCity
} from '../assets/index';


const LandingPage = (props) => {

	return (
		<View>
			<ImageBackground source={landingCity} style={{width: '100%', height: '100%'}}>
				<View style={styles.outerContainer}>
					
					<View style={styles.innerContainer}>
						
						<Image style={styles.logo} source={logoAtlanta}/>
					
					</View>
					
					<View style={styles.buttonContainer}>
						
						<View style={{alignItems: 'center', marginTop: 8}}>
							<Text style={styles.subtitle}>Already a user?</Text>
						</View>
						
						<TouchableOpacity style={[styles.bigButton, styles.loginButton]} onPress={props.navigateToLogin}>
							<Text style={[textStyles.primaryButton, {color: palette.black}]}> Log In </Text>
						</TouchableOpacity>
						
						<View style={{alignItems: 'center', marginTop: 8}}>
							<Text style={styles.subtitle}>Midtown Alliance Member?</Text>
						</View>
						
						<TouchableOpacity style={[styles.bigButton, styles.createAccountButton]} onPress={props.navigateToRegistration}>
							<Text style={textStyles.primaryButton}> Create Account </Text>
						</TouchableOpacity>
						
						<TouchableOpacity style={{backgroundColor: 'transparent', marginBottom: 30}} onPress={props.initiateGuestMode}>
							<Text style={[textStyles.textButton, {color: palette.white}]}>Explore App in Guest Mode</Text>
						</TouchableOpacity>
					
					</View>
				
				</View>
			</ImageBackground>
		</View>
	)
}


const mapStateToProps = (state) => ({
	partners: state.session.partners
});

const mapDispatchToProps = (dispatch) => ({
  navigateToRegistration: () => {dispatch(navigateTo("registration"))},
	navigateToLogin: () => {dispatch(navigateTo("login"))},
	fetchPartners: () => { return dispatch(fetchPartners()) },
	initiateGuestMode: () => {dispatch(initiateGuestMode())},
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPage)

const styles = StyleSheet.create({
   outerContainer: {
		 flex: 1,
		 alignItems: 'center',
		 justifyContent: 'space-between',
		 backgroundColor: 'transparent'
   },
		buttonContainer: {
   		width: '100%',
			alignItems: 'center',
		},
   bigButton: {
     alignItems: 'center',
		 justifyContent: 'center',
		 width: '87%',
		 height: 49,
		 borderRadius: 26,
		 backgroundColor: palette.deepLilacTwo
   },
	 createAccountButton: {
		 marginBottom: 52
	 },
	 loginButton: {
	  backgroundColor: palette.white,
	  marginBottom: 20
	 },
   logo: {
		 marginBottom: 10,
		 marginTop: 85,
		 width: 250,
		 resizeMode: 'contain'
   },
   subtitle: {
		 fontFamily: "Nunito Sans",
		 fontSize: 14,
		 fontWeight: "600",
		 textAlign: "center",
		 color: palette.white
   }
  });
