import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Navigator,
	ScrollView,
	Linking,
	Platform,
	Dimensions,
	BackHandler
} from 'react-native';

import {OfferCategories} from "../../util/values";
import MapView from 'react-native-maps';
import Communications from 'react-native-communications';
import Permissions from 'react-native-permissions'
import { GuestBanner } from "../../components/modals/GuestBanner";

import { Toolbar } from '../../components/widgets/index';
import { analytics } from '../../services/index';

import { textStyles } from "../../../styles";
import { data, location } from '../../util/index';
import HTMLView from 'react-native-htmlview';

import {
	defaultOffer,
	heartbeatAnimation,
	gradientOverlay,
	iconBlank,
	iconDiningCircle,
	iconExperienceCircle,
	iconMapPin,
	iconHeartMapPin,
	iconNightlifeCircle,
	iconShoppingCircle,
} from '../../../assets/index';

let currentDeal, mapUri, image, distance, expiration, terms, address1, address2, webUrl, phone, label, title, description;

const SCREEN_WIDTH = Dimensions.width;
const ANIMATION_TIMEOUT = 1000;
const REDEMPTION_RADIUS = 10.8; //.8km = .5mi1, 1,
const METERS_PER_HALF_MILE = 805; // actually 804.672;

const inRedemptionRadius = (distance) => {
	let distanceInMiles = distance / METERS_PER_HALF_MILE;
	return distanceInMiles <= 1;
}


/**
 Screen responsible for displaying the selected offer and determining redeemability based on geolocation
 **/

const mapMarker = <Image source={iconHeartMapPin}/>;

export default class OfferDetail extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			markers: [],
			canRedeem: false,
			hasLocation: false,
			validLocation: false,
			locationServicesEnabled: true,
			redeemButtonText: null,
			isLoading: true,
			isDefaultImage: false,
			planContainer: styles.contactContainerInactive,
			callContainer: styles.contactContainerInactive
		};
	}
	
	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
		
		if(this.props.currentOffer) {
			currentDeal = this.props.currentOffer;
			this.getMarkerPins();
			this.setMapUri();
			this.processCitylightData();
			analytics.reportScreenViewToGoogleAnalytics(`Offer Detail: ${currentDeal.uid}`);
		}
	}
	
	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress);
	}
	
	renderNode = (node, index, siblings, parent, defaultRenderer) => {
		if (node.type == 'text') {
			return <Text key={node.data + index} style={node.parent ? styles.htmlText : styles.bodyText}>{node.data}</Text>;
		} else if (node.name == 'a') {
			return (
				<TouchableOpacity key={node.type + index} onPress={() => Linking.openURL(node.attribs.href)}>
					<View>
						{defaultRenderer(node.children, node.parent)}
					</View>
				</TouchableOpacity>
			)
		}
	}
	
	
	androidBackPress = () => {
		this.props.goBack();
		return true;
	}
	
	fitToCenter(){
		if (this.map) {
			this.map.fitToElements(true);
		}
	}
	
	render() {
		let guestBanner = (
			<GuestBanner
				goToRegistration={this.props.resetToRegistration}
				goToLogin={this.props.resetToLogin} />
		);
		//show deal information screen
		if(currentDeal) {
			return (
        <View style={{flex: 1}}>
          <Toolbar title={"Details"} back={true} onBackFunction={this.props.goBack} />
					
					{this.props.guest ? guestBanner : null}
					
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollStyle}>
            <Image
              style={styles.bannerImage}
              source={this.getBannerSource()} />
            <Image
              style={styles.gradientImage}
              source={gradientOverlay} />
            <View style={styles.titleContainer}>
              <Image style={styles.icon} source={this.getIcon(currentDeal.listIcon)} />
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.distance}>{distance ? distance + ' away' : ""}</Text>
            </View>
            
            <View>
              <Text style={styles.sectionHeader}>Offering</Text>
              <Text style={styles.subtitle}>{label}</Text>
							<HTMLView value={description} renderNode={this.renderNode} stylesheet={styles} />
            </View>
            
            <View>
              <Text style={styles.sectionHeader}>The Fine Print</Text>
              <Text style={styles.bodyText}>{terms}</Text>
              <Text style={styles.bodyText}>{`Expires ${expiration}`}</Text>
            </View>
            
            <View style={this.state.planContainer}>
              <Text style={styles.contactHeader}>Plan</Text>
              <TouchableOpacity style={styles.contactContainerInner} onPress={() => Linking.openURL(webUrl)}>
                <Text style={styles.contact} ellipseMode={'tail'} numberOfLines={1}>{webUrl}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={this.state.callContainer}>
              <Text style={styles.contactHeader}>Call</Text>
              <TouchableOpacity style={styles.contactContainerInner} onPress={() => Communications.phonecall(phone, true)}>
                <Text style={styles.contact}>{phone}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.contactContainerActive}>
              <Text style={styles.contactHeader}>Visit</Text>
              <TouchableOpacity style={styles.contactContainerInner} onPress={this.mapClick}>
                <Text style={styles.contact} ellipseMode={'tail'} numberOfLines={1} >{address1}{address2}</Text>
              </TouchableOpacity>
            </View>
            
            <MapView
              ref={ref => { this.map = ref; }}
              style={styles.map}
							maxZoomLevel={16}
              initialRegion={{
								latitude: parseFloat(currentDeal.citylight_point.lat),
								longitude: parseFloat(currentDeal.citylight_point.long),
								latitudeDelta: .05,
								longitudeDelta: .05
							}}
              showsUserLocation={true}
							onLayout={this.fitToCenter.bind(this)}
              showsCompass={true} >
							
							{this.state.markers.map(marker => (
                <MapView.Marker
                  key={marker.key}
                  coordinate={{
										latitude: parseFloat(marker.latitude),
										longitude: parseFloat(marker.longitude)
									}}
								>
									{mapMarker}
								</MapView.Marker>
							))}
            
            </MapView>
          
          </ScrollView>
					
					{
						(this.state.redeemButtonText)
							? <TouchableOpacity style={{flexDirection: 'row'}} disabled={!this.state.canRedeem} onPress={this.redeemButtonClicked}>
                <Text style={this.styleRedeemButton()}>{this.state.redeemButtonText}</Text>
              </TouchableOpacity>
							: null
					}
        
        </View>
			);
		}
		
		return null;
	}
	
	getMarkerPins = () => {
		let hasLocation = this.state.hasLocation;
		let validLocation = this.state.validLocation;
		let locationServicesEnabled = this.state.locationServicesEnabled;
		let markers = this.state.markers;
		
		navigator.geolocation.getCurrentPosition(
			(position) => {
				//got user location and they're inside the radius
				if(inRedemptionRadius(parseFloat(currentDeal.metersaway))) {
					hasLocation = true;
					validLocation = true;
					markers = [{latitude: currentDeal.citylight_point.lat, longitude: currentDeal.citylight_point.long, key: 0, pinIcon: mapMarker}];
					
				} else {
					//got location but you're too far away
					redeemButtonText = "Go to Location to Redeem";
					hasLocation = true;
					markers = [{latitude: currentDeal.citylight_point.lat, longitude: currentDeal.citylight_point.long, key: 0, pinIcon: mapMarker}];
				}
				
				this.setState({hasLocation, validLocation, markers}, this.setButtonState)
			},
			(error) => {
				markers = [{latitude: currentDeal.citylight_point.lat, longitude: currentDeal.citylight_point.long, key: 0, pinIcon: mapMarker}];
				Permissions.check('location')
					 .then((response) => {
							if (response !== 'authorize') {
								locationServicesEnabled = false;
							}
						 this.setState({hasLocation, validLocation, markers, locationServicesEnabled}, this.setButtonState)
					 })
			},
			{enableHighAccuracy: true, timeout: 5000}
		);
	}
	
	setButtonState = () => {
		let redeemButtonText = this.state.redeemButtonText;
		let canRedeem = this.state.canRedeem;
		if (this.props.guest) {
			redeemButtonText = "Register to Redeem Offer";
			canRedeem = true;
			
		} else if (currentDeal.isRedeemed) {
			redeemButtonText = "Already Redeemed";
			canRedeem = false;
			
		} else if (this.state.hasLocation && this.state.validLocation) {
			redeemButtonText = "Redeem Offer";
			canRedeem = true;
			
		} else if (this.state.hasLocation && !this.state.validLocation) {
			redeemButtonText = "Go to Location to Redeem";
			canRedeem = false;
			
		} else if (!this.state.hasLocation) {
			redeemButtonText = "Turn on Location Services to Redeem";
			//can use button to link to settings in ios but not android
			
			canRedeem = Platform.OS === 'ios';
		}
		this.setState({redeemButtonText, canRedeem});
	}
	
	setMapUri = () => {
		//determine appropriate map URI for the OS
		if(Platform.OS === 'ios') {
			mapUri = 'http://maps.apple.com/?ll=' + currentDeal.citylight_point.lat + ',' + currentDeal.citylight_point.long + '&q=' + currentDeal.citylight_point.label;
		} else {
			mapUri = 'geo:' + currentDeal.citylight_point.lat + ',' + currentDeal.citylight_point.long + '?q=' + currentDeal.citylight_point.label;
		}
	}
	
	processCitylightData = () => {
		//Account for optional fields in CMS
		//first check for an image associated with the deal
		if(data.isEmpty(currentDeal.citylight_images)) {
			
			//then check for an image associated with the point
			if(data.isEmpty(currentDeal.citylight_point.citylight_point_images)) {
				this.setState({
												isDefaultImage: true,
											});
			} else if (currentDeal.citylight_point.citylight_point_images.length > 1) {
				image = currentDeal.citylight_point.citylight_point_images[0].imageurl;
			} else {
				image = currentDeal.citylight_point.citylight_point_images.citylight_image.imageurl;
			}
		} else if(currentDeal.citylight_images.length > 1){
			image = currentDeal.citylight_images.citylight_images[0].imageurl;
		} else {
			image = currentDeal.citylight_images.citylight_image.imageurl;
		}
		
		if(data.isEmpty(currentDeal.citylight_point.label)) {
			title = '';
		} else {
			title = currentDeal.citylight_point.label;
		}
		
		if(data.isEmpty(currentDeal.label)) {
			label = '';
		} else {
			label = currentDeal.label;
		}
		
		if(data.isEmpty(currentDeal.offer_text)) {
			description = '';
		} else {
			description = String(currentDeal.offer_text);
		}
		
		if(data.isEmpty(currentDeal.offer_terms)) {
			terms = 'Contact ' + label + ' for offer terms.';;
		} else {
			terms = currentDeal.offer_terms;
		}
		
		if(data.isEmpty(currentDeal.enddate)) {
			expiration = '';
		} else {
			expiration = currentDeal.enddate
		}

		if(data.isEmpty(currentDeal.metersaway)) {
			distance = '';
		} else {
			distance = location.distanceAway(currentDeal.metersaway);
		}
		
		if(data.isEmpty(currentDeal.enddate)) {
			currentDeal.enddate = '';
		} else { currentDeal.enddate = 'Expires ' + currentDeal.enddate; }
		
		
		if(data.isEmpty(currentDeal.citylight_point.address1)) {
			address1 = '';
		} else {
			address1 = currentDeal.citylight_point.address1;
		}
		
		if(data.isEmpty(currentDeal.citylight_point.address2)) {
			address2 = '';
		} else {
			address2 = ", " + currentDeal.citylight_point.address2;
		}
		
		if(data.isEmpty(currentDeal.citylight_point.website)) {
			this.setState({
				planContainer: styles.contactContainerInactive
			});
			webUrl = '';
		} else {
			webUrl = currentDeal.citylight_point.website;
			this.setState({
				planContainer: styles.contactContainerActive
			});
			
			//Fix the website URL if it doesn't have a protocol, will crash on iOS if you don't do this
			if(webUrl.indexOf('http') === -1) {
				webUrl = 'http://' + webUrl.toString();
			} else {
				webUrl = webUrl.toString();
			}
		}
		
		if(data.isEmpty(currentDeal.citylight_point.telephone)) {
			phone = "";
			this.setState({
				callContainer: styles.contactContainerInactive
			});
		} else {
			phone = currentDeal.citylight_point.telephone;
			this.setState({
				callContainer: styles.contactContainerActive
			});
		}
		
		this.setState({
			isLoading: false
		});
		
	}
	
	getBannerSource = () => {
		if(this.state.isDefaultImage) {
			return defaultOffer;
		} else return {uri: image};
	}
	
	getIcon = (category) => {
		category = category.toString() || "";
		switch(category.toLowerCase()) {
			case "shopping":
				return iconShoppingCircle;
			case "dining":
				return iconDiningCircle;
			case "experiences":
				return iconExperienceCircle;
			case "nightlife":
				return iconNightlifeCircle;
			default:
				return iconBlank;
		}
	}
	
	mapClick = () => {
		if(mapUri) {
			Linking.canOpenURL(mapUri).then(supported => {
				if (supported) {
					Linking.openURL(mapUri);
				} else {
					alert('Don\'t know how to open URI: ' + mapUri);
				}
			});
		}
	}
	
	styleRedeemButton = () => {
		if((this.state.canRedeem && this.state.validLocation) || this.props.guest) {
			return([textStyles.primaryButton, styles.buttonActive]);
		} else return([textStyles.primaryButton, styles.buttonInactive]);
	}
	
	redeemButtonClicked = () => {
		if (this.props.guest) {
			this.props.resetToRegistration();
			
			//link to settings if we couldn't get the location
		} else if(!this.state.hasLocation && this.state.canRedeem) {
			if(Platform.OS == 'ios') {
				Linking.canOpenURL('app-settings:')
					 .then(supported => {
						 if (supported) {
							 Linking.openURL('app-settings:');
						 }
					 })
					 .catch(err => {
						 console.log('cant open settings: ', err);
						 return;
					 });
			}
		} else {

			//call redeem function from Offer Scene
			this.props.navigateToOfferRedemption()
			// this.props.onRedeemFunction(currentDeal);
		}
	}
	
}

OfferDetail.propTypes = {
	provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
 bannerImage: {
   width: SCREEN_WIDTH,
   height: 300,
   resizeMode: 'cover',
 },
 gradientImage: {
   width: SCREEN_WIDTH,
   height: 300,
   resizeMode: 'cover',
   marginTop: -300
 },
 titleContainer: {
   flexDirection: 'column',
   alignItems: 'center',
   justifyContent: 'flex-end',
   height: 200,
   marginTop: -200,
   backgroundColor: 'transparent'
 },
 icon: {
   width: 50,
   height: 50,
   resizeMode: 'contain'
 },
 title: {
   height: 25,
   fontSize: 20,
   fontFamily: 'Rokkitt',
   color: 'white',
   marginTop: 10,
   marginBottom: 2,
   textShadowOffset: {width: 1, height: 1},
   textShadowRadius: 1,
   textShadowColor: 'rgba(0, 0, 0, .5)'
 },
 distance: {
   fontSize: 14,
   color: 'white',
   marginBottom: 15,
   fontFamily: 'Nunito Sans'
 },
 sectionHeader: {
   backgroundColor: 'rgb(250, 250, 250)',
   color: 'rgb(21, 19, 93)',
   height: 36,
   marginBottom: 25,
   paddingTop: 10,
   paddingBottom: 5,
   paddingLeft: 20,
   fontFamily: 'Nunito Sans'
 },
 subtitle: {
   fontSize: 16,
   marginBottom: 15,
   marginLeft: 20,
   marginRight: 20,
   fontFamily: 'Nunito Sans'
 },
 descriptionContainer: {
	 marginBottom: 20,
 },
 bodyText: {
	 fontSize: 12,
	 marginLeft: 20,
	 marginRight: 20,
	 fontFamily: 'Nunito Sans'
 },
 htmlText: {
	 fontSize: 12,
	 marginLeft: 20,
	 marginRight: 20,
	 fontFamily: 'Nunito Sans',
	 color: "#0000FF"
 },
 a: {
	 fontSize: 12,
	 marginLeft: 20,
	 marginRight: 20,
	 fontFamily: 'Nunito Sans'
 },
 contactContainerInner: {
   flex: 1,
   height: 44,
   alignItems: 'flex-start'
 },
 contactContainerActive: {
   paddingTop: 10,
   paddingBottom: 10,
   borderColor: 'rgb(231, 231, 231)',
   borderTopWidth: .5,
   minWidth: 1000,
   flexDirection: 'row',
   marginLeft: 20,
   marginRight: 20,
   height: 50,
   alignItems: 'center'
 },
 contactContainerInactive: {
   width: 0,
   height: 0,
   opacity: 0,
 },
 contactHeader: {
   fontSize: 16,
   height: 25,
   paddingTop: 5,
   fontFamily: 'Rokkitt',
   fontWeight: 'bold',
   color: 'black'
 },
 contact: {
   color: 'rgb(51, 48, 146)',
   paddingLeft: 20,
   paddingRight: 20,
   paddingTop: 15,
   fontFamily: 'Nunito Sans'
 },
 map: {
   marginTop: 10,
   flexDirection: 'row',
   flex: 1,
   height: 300,
 },
 buttonInactive: {
   flex: 1,
   paddingTop: 25,
   paddingBottom: 25,
   color: 'rgb(70, 11, 0)',
   backgroundColor: 'rgb(240, 81, 51)'
 },
 buttonActive: {
   flex: 1,
   paddingTop: 25,
   paddingBottom: 25,
   backgroundColor: 'rgb(240, 81, 51)',
 },
});