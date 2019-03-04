
import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
	Linking,
	Platform,
	Dimensions,
	BackHandler,
	TouchableHighlight
} from 'react-native';

import MapView from 'react-native-maps';
import Communications from 'react-native-communications';
import { GuestBanner } from "../../components/modals/GuestBanner";
import { Toolbar } from '../../components/widgets/index';
import { analytics } from '../../services/index';
import { data, location } from '../../util/index';
import { Actions } from 'react-native-router-flux';
import HTMLView from 'react-native-htmlview';
import {DiscoveryCategories} from "../../util/values";

import {
	defaultOffer,
	gradientOverlay,
	iconBlank,
	iconMapPin,
	iconHeartMapPin,
} from '../../../assets/index';

let currentDiscovery, mapUri, image, distance, headline, address1, webUrl, phone, label, description;

const SCREEN_WIDTH = Dimensions.width;
const ANIMATION_TIMEOUT = 1000;

/**
 Screen responsible for displaying the selected offer and determining redeemability based on geolocation
 **/

const mapMarker = (<Image source={iconHeartMapPin} />);

export default class DiscoveryDetail extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			markers: [],
			hasLocation: false,
			isLoading: true,
			isDefaultImage: false,
			planContainer: styles.contactContainerInactive,
			callContainer: styles.contactContainerInactive,
			addressContainer: styles.contactContainerInactive
		};
	}
	
	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
		if(this.props.currentDiscovery) {
			currentDiscovery = this.props.currentDiscovery;
			this.getMarkerPins(currentDiscovery.isRedeemed);
			this.setMapUri();
			this.processCitylightData();
			
			analytics.reportScreenViewToGoogleAnalytics(`Discovery Detail: ${currentDiscovery.uid}`);
		}
	}
	
	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress);
	}
	
	androidBackPress = () => {
		this.props.goBack()
		return true;
	}
	
	fitToCenter(){
		if (this.map) {
			this.map.fitToElements(true);
		}
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
	
	render() {
		let guestBanner = (
			<GuestBanner
				goToRegistration={this.props.resetToRegistration}
				goToLogin={this.props.resetToLogin} />
		)
		//show deal information screen
		if(currentDiscovery) {
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
							<View style={styles.iconOuterCircle}>
								<Image style={styles.icon} source={this.getIcon(currentDiscovery.listIcon)} />
							</View>
							<Text style={styles.title}>{label}</Text>
							<Text style={styles.distance}>{distance + ' away'}</Text>
						</View>
						
						<View>
							<Text style={styles.sectionHeader}>About</Text>
							<Text style={styles.subtitle}>{headline}</Text>
							<HTMLView value={description} renderNode={this.renderNode} stylesheet={styles} />
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
						
						<View style={this.state.addressContainer}>
							<Text style={styles.contactHeader}>Visit</Text>
							<TouchableOpacity style={styles.contactContainerInner} onPress={this.mapClick}>
								<Text style={styles.contact} ellipseMode={'tail'} numberOfLines={1} >
									{address1}
									{data.isEmpty(currentDiscovery.citylight_point.address2) ? "" : (", " + currentDiscovery.citylight_point.address2)}
								</Text>
							</TouchableOpacity>
						</View>
						
						<MapView
							ref={ref => { this.map = ref; }}
							style={styles.map}
							initialRegion={{
								latitude: parseFloat(currentDiscovery.citylight_point.lat),
								longitude: parseFloat(currentDiscovery.citylight_point.long),
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
									<Image source={iconHeartMapPin} style={{height: 48, width: 38}} />
								</MapView.Marker>
							))}
						
						</MapView>
					
					</ScrollView>
				</View>
			);
		}
		
		return null;
	}
	
	getMarkerPins = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.setState({
					hasLocation: true,
					markers:  [{latitude: currentDiscovery.citylight_point.lat, longitude: currentDiscovery.citylight_point.long, key: 0, pinIcon: iconMapPin} ]
				});
			},
			(error) => {
				this.setState({
					hasLocation: false,
					markers:  [{latitude: currentDiscovery.citylight_point.lat, longitude: currentDiscovery.citylight_point.long, key: 0, pinIcon: iconMapPin}]
				});
			},
			{enableHighAccuracy: true, timeout: 5000}
		);
	}
	
	setMapUri = () => {
		//determine appropriate map URI for the OS
		if(Platform.OS === 'ios') {
			mapUri = 'http://maps.apple.com/?ll=' + currentDiscovery.citylight_point.lat + ',' + currentDiscovery.citylight_point.long + '&q=' + currentDiscovery.citylight_point.label;
		} else {
			mapUri = 'geo:' + currentDiscovery.citylight_point.lat + ',' + currentDiscovery.citylight_point.long + '?q=' + currentDiscovery.citylight_point.label;
		}
	}
	
	processCitylightData = () => {
		//Account for optional fields in CMS
		//first check for an image associated with the deal
		if(data.isEmpty(currentDiscovery.citylight_images)) {
			
			//then check for an image associated with the point
			let detailImages = currentDiscovery.citylight_point.citylight_point_detailImages;

			if(!detailImages || data.isEmpty(detailImages)) {
				this.setState({
					isDefaultImage: true,
				});
			} else if (detailImages.citylight_image) {
				image = detailImages.citylight_image.imageurl;
			}
			else if (Array.isArray(detailImages) && detailImages.length > 1) {
				image = detailImages[0].imageurl;
			}
		} else if(currentDiscovery.citylight_images.length > 1){
			image = currentDiscovery.citylight_images.citylight_images[0].imageurl;
		} else {
			image = currentDiscovery.citylight_images.citylight_image.imageurl;
		}
		
		if(data.isEmpty(currentDiscovery.metersaway)) {
			distance = '';
		} else {
			distance = location.distanceAway(currentDiscovery.metersaway);
		}
		
		if(data.isEmpty(currentDiscovery.label)) {
			label = "";
		} else {
			label = String(currentDiscovery.label);
		}
		
		if(data.isEmpty(currentDiscovery.headline)) {
			headline = "";
		} else {
			headline = String(currentDiscovery.headline);
		}
		
		if(data.isEmpty(currentDiscovery.description)) {
			description = "";
		} else {
			description = String(currentDiscovery.description);
		}

		if(data.isEmpty(currentDiscovery.citylight_point.address1)) {
			address1 = "";
			this.setState({
				addressContainer: styles.contactContainerInactive
			});
		} else {
			address1 = currentDiscovery.citylight_point.address1;
			this.setState({
				addressContainer: styles.contactContainerActive
			});
		}
		
		if(data.isEmpty(currentDiscovery.citylight_point.website)) {
			this.setState({
				planContainer: styles.contactContainerInactive
			});
			webUrl = "";
			
		} else {
			webUrl = currentDiscovery.citylight_point.website;
			this.setState({
				planContainer: styles.contactContainerActive
			});
			
			//Fix the website URL if it doesn't have a protocol, will crash on iOS if you don't do this
			if(currentDiscovery.citylight_point.website.indexOf('http') === -1) {
				currentDiscovery.citylight_point.website = 'http://' + currentDiscovery.citylight_point.website.toString();
			} else {
				currentDiscovery.citylight_point.website = currentDiscovery.citylight_point.website.toString();
			}
		}
		
		if(data.isEmpty(currentDiscovery.citylight_point.telephone)) {
			this.setState({
				callContainer: styles.contactContainerInactive
			});
			phone = "";
		} else {
			phone = currentDiscovery.citylight_point.telephone;
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
		return (DiscoveryCategories[category.toLowerCase()]) ? DiscoveryCategories[category.toLowerCase()].icon : iconBlank;
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
	
}

DiscoveryDetail.propTypes = {
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
	 width: 22,
	 height: 22,
	 resizeMode: 'contain'
 },
	iconOuterCircle: {
		width: 50,
		height: 50,
		backgroundColor: 'white',
		borderRadius: 40,
		alignItems: 'center',
		justifyContent: 'center'
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
	 textAlign: 'center',
	 fontWeight: 'bold',
	 color: 'rgb(70, 11, 0)',
	 backgroundColor: 'rgb(240, 81, 51)',
	 fontFamily: 'Nunito Sans'
 },
 buttonActive: {
	 flex: 1,
	 paddingTop: 25,
	 paddingBottom: 25,
	 textAlign: 'center',
	 fontWeight: 'bold',
	 color: 'white',
	 backgroundColor: 'rgb(240, 81, 51)',
	 fontFamily: 'Nunito Sans'
 },
});