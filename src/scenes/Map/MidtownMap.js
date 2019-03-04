import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	TouchableWithoutFeedback,
	Keyboard,
	BackHandler,
	Platform
} from 'react-native';

import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';
import Modal from 'react-native-modalbox';
import ClusteredMapView from 'react-native-maps-super-cluster'

import { palette, textStyles } from "../../../styles";
import { OfferCategories, DiscoveryCategories, contentTypes } from "../../util/values";
import { data, location } from '../../util/index';

import { Toolbar, SearchActionBar } from '../../components/widgets/index'
import FilterModal from '../../components/modals/FilterModal';
import { GuestBanner } from "../../components/modals/GuestBanner";


import {
	iconMapPin,
	iconHeartMapPin
} from '../../../assets/index';

const clusterIcon = <Image style={{width: 25, height: 25}} source={iconMapPin} />;
const mapMarker = <Image source={iconMapPin} style={{width: 18, height: 18}}/>;
const selectedMapMarker = <Image source={iconHeartMapPin}/>;

const ANIMATION_TIMEOUT = 3000;


export default class MidtownMap extends React.Component {
	constructor(props) {
		super(props);
		let delta = Platform.OS === 'ios' ? .03 : .04
		this.state = {
			region: {
				latitude: 33.784283,
				longitude: -84.3850021,
				latitudeDelta: delta,
				longitudeDelta: delta
			},
			selectedMarker: null,
			markers: [],
			data: [],
			selectedItems: [],
			detailsModalVisible: false,
			filterModalVisible: false,
			offerFilters: null,
			discoveryFilters: null,
			search: "",
			isLoaded: false,
			offerCategoryInfo: Object.keys(OfferCategories).map(category => (OfferCategories[category])),
			discoveryCategoryInfo: Object.keys(DiscoveryCategories).map(category => (DiscoveryCategories[category])),
		}
	}
	
	static onEnter = () => {
		analytics.reportScreenViewToGoogleAnalytics('Map');
	}
	
	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress);
	}

	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
		
		let data = [];
		if (this.props.offers) {
			//adding a map id to the objects because discovery can have the same uid as an offer and vice versa
			let offers = this.props.offers.map(offer => {
				offer.mapId = `offer-${offer.uid}`;
				return offer;
			})
			data = data.concat(offers);
		}
		
		if (this.props.discoveries) {
			let discoveries = this.props.discoveries.map(discovery => {
				discovery.mapId = `discovery-${discovery.uid}`;
				return discovery;
			})
			data = data.concat(discoveries);
		}
		
		this.getDataCallback(data);
	}
	
	androidBackPress = () => {
		this.props.navigateToOffers()
		return true;
	}
	

	setMarkers(){
		let markers = [];
		this.state.data.forEach((item, idx) => {
			if (item.citylight_point) {
				markers.push({
				 location: {latitude: parseFloat(item.citylight_point.lat), longitude: parseFloat(item.citylight_point.long)},
				 id: item.mapId
				})
			}
		})
		this.setState({markers});
	}
	
	fitToCenter(){
		if (this.map) {
			this.map.getMapRef().fitToElements(true);
		}
	}
	
	renderCluster = (cluster, onPress) => {
		return (
			<Marker identifier={`cluster-${cluster.clusterId}`} coordinate={cluster.coordinate} onPress={onPress}>
				<Image style={{width: 25, height: 25}} source={iconMapPin} />
				<View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
					<Text style={[textStyles.bodyWhite, {fontWeight: "700"}]}>
						{cluster.pointCount}
					</Text>
				</View>
			</Marker>
		)
	}
	
	renderMarker = (pin) => {
		return (
			<Marker identifier={pin.id} key={pin.id} coordinate={pin.location} image={iconMapPin} />
		)
	}
	
	handleClusterPress = (clusterId, selectedMarkers) => {
		let selectedItemNumbers = selectedMarkers.map(marker => (marker.id));
		let selectedItems = this.state.data.filter(item => (selectedItemNumbers.includes(item.mapId)));
		let markers = [];
		let selectedMarker = {
			coordinate: {
				latitude: parseFloat(selectedItems[0].citylight_point.lat),
				longitude: parseFloat(selectedItems[0].citylight_point.long)
			}
		}
		this.setState({
			detailsModalVisible: true,
			selectedItems,
			markers,
			selectedMarker
		})
	}
	
	handleSingleMarkerPress = (e) => {
		let mapId = e.nativeEvent.id;
		//when clickingo on cluster onMarkerPressed get triggered as well as onClusterPress
		//this method is meant to only handle non cluster markers
		if (mapId.includes('cluster')) {
			return
		}
		let selectedItem = this.state.data.find(item => (item.mapId === mapId));
		let selectedItems = [selectedItem];
		let markers = [];
		let selectedMarker = {
			coordinate: {
				latitude: parseFloat(selectedItem.citylight_point.lat),
				longitude: parseFloat(selectedItem.citylight_point.long)
			}
		}

		this.setState({
			detailsModalVisible: true,
			selectedItems,
			markers,
			selectedMarker
		})
	}
	
	handleDetailsModalClosed = () => {
		this.setState({
			detailsModalVisible: false,
			selectedItems: [],
			selectedMarker: null
		}, this.setMarkers);
	}
	
	handleMoreDetailsPress = (item) => (
		() => {
			this.props.setCurrentDetailItem(item);
			if (item.contentType === contentTypes.OFFER) {
				this.props.navigateToOfferDetail();
			} else if (item.contentType === contentTypes.DISCOVERY) {
				this.props.navigateToDiscoveryDetail();
			}
		}
	)
	
	generateItemDetailCard(item){
		const icon = this.getIcon(item);
		const distance = typeof item.distance === 'string' ? item.distance : "";
		const title = data.isEmpty(item.citylight_point.label) ? "Offer" : item.citylight_point.label;
		const offer = data.isEmpty(item.label) ? "" : item.label;
		const category = data.isEmpty(item.listIcon) ? "" : item.listIcon
		return (
			<View style={styles.detailCard} key={item.uid}>
				<View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
					<View style={{flexDirection: 'row', alignItems: 'center', overflow: 'hidden', flex: 1, marginRight: 3}}>
						<Image style={styles.icon} source={icon} />
						<View style={{flex: 1}}>
							<Text style={textStyles.title}>{title}</Text>
							<Text snumberOfLines={1} style={textStyles.bodyBlack}>{offer ? offer : category}</Text>
						</View>
					</View>
					<Text style={{marginTop: 3}}>{distance}</Text>
				</View>
				<TouchableOpacity style={{marginLeft: 34, marginTop: 21}} onPress={this.handleMoreDetailsPress(item)}>
					<Text style={textStyles.textButton}>More Details</Text>
				</TouchableOpacity>
			</View>
		)
	}
	
	getIcon(item){
		if (item.contentType === contentTypes.OFFER) {
			return OfferCategories[item.listIcon].icon;
		} else if (item.contentType === contentTypes.DISCOVERY) {
			return DiscoveryCategories[item.listIcon].icon;
		}
	}
	
	applyCategoryFilters = (filterState) => {
		this.setState({
			filterModalVisible: false,
			offerFilters: filterState['Offers'],
			discoveryFilters: filterState['Discoveries']
		}, () => {
			this.filterData();
		})
	}
	
	openFilterModal = () => {
		this.setState({filterModalVisible: true})
	}
	
	closeFilterModal = () => {
		//focusing search bar to make sure filter button shows up
		this.setState({filterModalVisible: false})
	}
	
	anyFiltersApplied(filters){
		//  checks if any of the category filters a on
		return Object.keys(filters).some(filter => (filters[filter]))
	}
	
	filterData(){
		let filteredResults = [];
		if (this.props.offers) {
			filteredResults =  filteredResults.concat(this.props.offers);
		}
		
		if (this.props.discoveries) {
			filteredResults = filteredResults.concat(this.props.discoveries);
		}
		
		let filters;
		if (this.state.offerFilters) {
			filters = {...this.state.offerFilters}
		}
		
		if (this.state.discoveryFilters) {
			filters = {...filters, ...this.state.discoveryFilters}
		}
		
		if (filters && this.anyFiltersApplied(filters)) {
			filteredResults = filteredResults.filter(item => {
				let category = item.listIcon
				return filters[category];
			})
		}
		
		let searchStr = this.state.search.trim();
		if (searchStr.length > 0) {
			filteredResults = filteredResults.filter(item => {
				let title = data.isEmpty(item.citylight_point.label) ? "" : item.citylight_point.label.toLowerCase();
				let label = data.isEmpty(item.label) ? "" : item.label.toLowerCase();
				let description;
				
				if (item.contentType === contentTypes.OFFER) {
					description = data.isEmpty(item.offer_text) ? "" : item.offer_text.toLowerCase();
				} else {
					description = data.isEmpty(item.description) ? "" : item.description.toLowerCase();
				}
				
				let titleMatch =  new RegExp(searchStr.toLowerCase()).test(title);
				let labelMatch = new RegExp(searchStr.toLowerCase()).test(label);
				let descriptionMatch =  new RegExp(searchStr.toLowerCase()).test(description);
				
				return (titleMatch || labelMatch || descriptionMatch)
			})
		}
		
		this.setState({data: filteredResults}, this.setMarkers);
	}
	
	getDataCallback = (data) => {
		offerCategoryInfo = this.getCategories(data).filter((category) => OfferCategories[category]).map(category => (OfferCategories[category]));
		discoveryCategoryInfo = this.getCategories(data).filter((category) => DiscoveryCategories[category]).map(category => (DiscoveryCategories[category]));
		this.setState({
			data,
			isLoaded: true,
			offerCategoryInfo,
			discoveryCategoryInfo
		}, this.setMarkers);
	}
	
	getCategories(items) {
		//Gets a list of groups/categories from all the items
		let categories = {};
		items.forEach(item => {
			if (item.listIcon) {
				let category = item.listIcon;
				categories[category] = true;
			}
		})

		return Object.keys(categories).filter(category => (categories[category]));
	}
	
	handleSearchChange = (search) => {
		this.setState({search: search.toLowerCase()}, this.filterData);
	}
	
	onPressZoomOut = () => {
		let region = {
			latitude:       this.state.region.latitude,
			longitude:      this.state.region.longitude,
			latitudeDelta:        this.state.region.latitudeDelta + 0.01,
			longitudeDelta:        this.state.region.longitudeDelta + 0.01
		}
		this.setState({region})
		this.map.getMapRef().animateToRegion(region, 100);
	}
	
	onPressZoomIn = () => {
		let latitudeDelta = (this.state.region.latitudeDelta - 0.01) >= 0 ? this.state.region.latitudeDelta - 0.01 : 0;
		let longitudeDelta = (this.state.region.longitudeDelta - 0.01) >= 0 ? this.state.region.longitudeDelta - 0.01 : 0;
		let region = {
			latitude: this.state.region.latitude,
			longitude: this.state.region.longitude,
			latitudeDelta,
			longitudeDelta
		}
		
		this.setState({region})
		this.map.getMapRef().animateToRegion(region, 100);
	}
	
	onRegionChangeComplete = (region) => {
		this.setState({region});
	}

	render(){
		let guestBanner = (
			<GuestBanner
				goToRegistration={this.props.resetToRegistration}
				goToLogin={this.props.resetToLogin} />
		)
		
		let NoOffersMessageComponent = (
			<View style={styles.emptyMessageView}>
				<Text style={textStyles.headerTitle}>
					{this.state.search ? "No matches" : "No offers or discoveries"}
				</Text>
			</View>
		)
		
		let modalHeight = {height: this.state.selectedItems.length > 1 ? 300 : 150};
		
		let selectedMarker = !this.state.selectedMarker ? null : (
			<Marker identifier={`selected`} coordinate={this.state.selectedMarker.coordinate}>
				{selectedMapMarker}
			</Marker>
		);
		
		let mapView = (
			<View style={{flex: 1}}>
				<ClusteredMapView
					ref={ref => this.map = ref }
					renderMarker={this.renderMarker}
					renderCluster={this.renderCluster}
					onClusterPress={this.handleClusterPress.bind(this)}
					onMarkerPress={this.handleSingleMarkerPress.bind(this)}
					initialRegion={this.state.region}
					onLayout={this.fitToCenter.bind(this)}
					style={styles.map}
					data={this.state.markers}
					showsUserLocation={true}
					zoomEnabled={true}
					maxZoom={14}
					showsCompass={true}>
					{selectedMarker}
				</ClusteredMapView>
                {
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            onPress={this.onPressZoomIn.bind(this)}
                        >
                            <Text style={styles.zoomButton}> + </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.onPressZoomOut.bind(this)}
                        >
                            <Text style={styles.zoomButton}> − </Text>
                        </TouchableOpacity>
                    </View>
                }
			</View>
		)
	//
	// 		<View style={styles.buttons}>
	// <TouchableOpacity
	// 	onPress={this.onPressZoomIn.bind(this)}
	// >
	// <Text style={styles.zoomButton}>+</Text>
	// </TouchableOpacity>
	// 	<TouchableOpacity
	// 		onPress={this.onPressZoomOut.bind(this)}
	// 	>
	// 		<Text style={styles.zoomButton}>-</Text>
	// 	</TouchableOpacity>
	// </View>
		
		return (
			<View style={{flex: 1}}>
				<Toolbar title={"Offers and Discoveries"} back={false} />
				<SearchActionBar
					handleSearchChange={this.handleSearchChange}
					handleActionButtonPress={this.openFilterModal}
					actionButtonText={"Filter"} />
				{this.props.guest ? guestBanner : null}
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={{flex: 1}}>
						{this.state.data.length > 0 ? mapView : NoOffersMessageComponent}
						
					</View>
				</TouchableWithoutFeedback>
				<Modal
					isOpen={this.state.detailsModalVisible}
					backdropOpacity={0}
					position={'bottom'}
					animationType={'slide'}
					swipeToClose={false}
					onClosed={this.handleDetailsModalClosed}
					style={[styles.detailsModal, modalHeight]}>
					<View style={styles.detailCardContainer}>
						<ScrollView style={{flex: 1}}>
							{this.state.selectedItems.map(offer => (this.generateItemDetailCard(offer)))}
						</ScrollView>
					</View>
				</Modal>
				<FilterModal
					modalVisible={this.state.filterModalVisible}
					categoryGroups={[
						{title: "Offers", data: this.state.offerCategoryInfo},
						{title: "Discoveries", data: this.state.discoveryCategoryInfo}
					]}
					headers={true}
					filterState={{"Offers": this.state.offerFilters, "Discoveries": this.state.discoveryFilters}}
					applyFilter={this.applyCategoryFilters}
					close={this.closeFilterModal}/>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	 map: {
		 flexDirection: 'row',
		 flex: 1
	 },
	detailsModal: {
		borderTopLeftRadius: 34,
		borderTopRightRadius: 34
	},
	detailCardContainer: {
		backgroundColor: palette.white,
		width: Dimensions.get('window').width,
		borderTopLeftRadius: 34,
		borderTopRightRadius: 34,
		flex: 1,
		shadowColor: "rgba(0, 0, 0, 0.5)",
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowRadius: 6,
		shadowOpacity: 1
	},
	detailCard: {
		alignItems: 'flex-start',
		marginLeft: 21,
		marginRight: 21,
		paddingTop: 36,
		paddingBottom: 15,
		borderBottomColor: palette.lightestGrey,
		borderBottomWidth: 0.5
	},
	detailCardBodyText: {
		fontFamily: "Nunito Sans",
		fontSize: 14,
		color: palette.almostWhite
	},
		emptyMessageView: {
			flex: 1,
			flexDirection: 'column',
		 	justifyContent: 'center',
		},
	icon: {
	 	width: 16,
		height: 16,
		marginRight: 18,
	 },
	zoomButton: {
		fontSize: 24,
		borderColor: palette.lightestGrey,
		textAlign: 'center',
		color: '#808080',
		borderWidth: 0.5
	},
 clusterText: {
	 position: 'absolute',
	 fontWeight: "700",
	 top: 3,
	 left: 6
 },
	buttons: {
		position: 'absolute',
		bottom: 30,
		right: 20,
		height: Platform.OS === 'ios' ? 60 : 70,
		width: Platform.OS === 'ios' ? 30 : 35,
		shadowColor: '#000',
		shadowOffset: { width: 0.5, height: 0.5 },
		shadowOpacity: 0.5,
		shadowRadius: 0.5,
		backgroundColor: palette.white
	}
})