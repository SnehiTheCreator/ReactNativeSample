import React, { Component } from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	BackHandler
} from 'react-native';


import {DiscoveryCategories} from "../../util/values";
import { Toolbar, SearchActionBar } from '../../components/widgets/index';
import { GuestBanner } from "../../components/modals/GuestBanner";
import FilterModal from '../../components/modals/FilterModal';
import { textStyles } from "../../../styles";
import { data, location } from '../../util/index';
import { analytics } from '../../services/index';

import {
	checkmarkRedeemed,
	iconBlank,
} from '../../../assets/index';


/**
 Screen responsible for fetching, processing, and displaying list of current discoveries
 **/

export default class DiscoveryList extends Component {
	
	state = {
		isLoaded: false,
		error: false,
		userLat: null,
		userLong: null,
		filterModalVisible: false,
		// initialize data for category filter
		discoveryCategoryInfo: Object.keys(DiscoveryCategories).map(category => (DiscoveryCategories[category])),
		filters: null,
		data: [],
		search: ""
	};
	
	static onEnter = () => {
		analytics.reportScreenViewToGoogleAnalytics('DiscoveryList');
	}
	
	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', () => this.androidBackPress() );
		if (this.props.discoveries) {
			this.getDiscoveriesCallback(this.props.discoveries);
		}
	}
	
	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', () => this.androidBackPress() );
	}
	
	androidBackPress = () => {
		this.props.navigateToOffers();
		return false;
	}
	
	handleSearchChange = (search) => {
		this.setState({search: search.toLowerCase()}, this.filterData);
	}
	
	getDiscoveryCategories(discoveries) {
		//Gets a list of groups/categories from all the discoveries
		let categories = {};
		discoveries.forEach(discovery => {
			if (discovery.listIcon) {
				let category = discovery.listIcon;
				categories[category] = true;
			}
		})
	return Object.keys(categories).filter(category => (categories[category]));
}

render() {
	let guestBanner = (
		<GuestBanner
			goToRegistration={this.props.resetToRegistration}
			goToLogin={this.props.resetToLogin} />
	)
	
	let NoOffersMessageComponent = (
		<Text style={textStyles.headerTitle}>
			{this.state.search ? "No matching discoveries" : "No discoveries"}
		</Text>
	)
	
		return (
			<View style={{flex: 1}}>
				<Toolbar title={"Discoveries"} back={false}/>
				<SearchActionBar
					handleSearchChange={this.handleSearchChange}
					handleActionButtonPress={this.openFilterModal}
					actionButtonText={"Filter"} />
				{this.props.guest ? guestBanner : null}
				<FlatList
					data={this.state.data}
					renderItem={this.renderRow}
					contentContainerStyle={[ { flexGrow: 1 } , this.state.data.length ? null : { justifyContent: 'center'}]}
					keyExtractor={item => item.uid}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={NoOffersMessageComponent} />
				<FilterModal
					modalVisible={this.state.filterModalVisible}
					categoryGroups={[{title: "Discoveries", data: this.state.discoveryCategoryInfo}]}
					headers={false}
					filterState={{"Discoveries": this.state.filters}}
					applyFilter={this.applyCategoryFilters}
					close={this.closeFilterModal}/>
			</View>
		);
	}

	selectDiscovery = (discovery) => (
		() => {
			this.props.setCurrentDiscovery(discovery);
			this.props.navigateToDiscoveryDetail();
		}
	)
	
	//render each listview row with an API call response entry
	renderRow = ({item}) => {
		let distanceText = '';
		if(!data.isEmpty(item.metersaway)) {
			distanceText = location.distanceAway(item.metersaway);
		}
		
		return (
			<TouchableOpacity
				onPress= { this.selectDiscovery(item) } >
				<View style={styles.listRow}>
					<Image source={this.getDealIcon(item.listIcon)} style={styles.listIcon} />
					<View style={styles.listTitleContainer}>
						<Text style={styles.listTitle} ellipseMode={'tail'} numberOfLines={1} >{item.citylight_point.label}</Text>
						<Text style={styles.listSubtitle}>{item.label}</Text>
					</View>
					
					<Text style={styles.listDistance}>{distanceText}</Text>
				
				</View>
			</TouchableOpacity>
		);
	}
	
	getDealIcon = (category) => {
		let categoryInfo = DiscoveryCategories[category];
		return categoryInfo ? categoryInfo.icon : iconBlank;
	}

	applyCategoryFilters = (filterState) => {
		this.setState({
			filterModalVisible: false,
			filters: filterState['Discoveries']
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
		let filteredResults = [...this.props.discoveries];
		if (this.state.filters && this.anyFiltersApplied(this.state.filters)) {
			filteredResults = filteredResults.filter(item => {
				let category = item.listIcon;
				return this.state.filters[category];
			})
		}
		
		let searchStr = this.state.search.trim();
		if (searchStr.length > 0) {
			filteredResults = filteredResults.filter(item => {
				let title = data.isEmpty(item.citylight_point.label) ? "" : item.citylight_point.label.toLowerCase();
				let label = data.isEmpty(item.label) ? "" : item.label.toLowerCase();
				let description = data.isEmpty(item.description) ? "" : item.description.toLowerCase();
				
				let titleMatch =  new RegExp(searchStr.toLowerCase()).test(title);
				let labelMatch = new RegExp(searchStr.toLowerCase()).test(label);
				let descriptionMatch =  new RegExp(searchStr.toLowerCase()).test(description);
				
				return (titleMatch || labelMatch || descriptionMatch)
			})
		}
		
		this.setState({data: filteredResults});
	}
	
	getDiscoveriesCallback = (discoveriesData) => {
		let discoveryCategoryInfo = this.getDiscoveryCategories(discoveriesData).map(category => (DiscoveryCategories[category]));
		this.setState({
			data: discoveriesData,
			isLoaded: true,
			error: false,
			discoveryCategoryInfo
		});
	}
	
}

const styles = StyleSheet.create({
 container: {
	 flex: 1,
	 marginTop: 20
 },
 loadingContainer: {
	 flex:1,
	 flexDirection:'row',
	 alignItems:'center',
	 justifyContent:'center',
	 backgroundColor: 'white'
 },
 errorContainerOuter: {
	 flex: 1,
	 justifyContent: 'space-between'
 },
 errorContainerInner: {
	 flex: 1,
	 justifyContent: 'center',
	 alignItems: 'center',
 },
 errorEmoji: {
	 width: 50,
	 height: 50,
	 resizeMode: 'cover',
 },
 errorTitle: {
	 color: 'rgb(51, 48, 146)',
	 fontFamily: 'Rokkitt',
	 fontSize: 20,
	 height: 50,
	 marginTop: 20,
 },
 errorText: {
	 marginLeft: 30,
	 marginRight: 30,
	 textAlign: 'center'
 },
 errorButton: {
	 flex: 1,
	 paddingTop: 25,
	 paddingBottom: 25,
	 textAlign: 'center',
	 fontWeight: 'bold',
	 color: 'white',
	 backgroundColor: 'rgb(240, 81, 51)',
	 fontFamily: 'Nunito Sans'
 },
 listRow:{
	 backgroundColor:'white',
	 paddingTop:20,
	 paddingBottom:20,
	 paddingLeft: 20,
	 paddingRight: 20,
	 flexDirection:'row',
	 borderBottomWidth: 1,
	 borderColor: 'rgb(231, 231, 231)'
 },
 listIcon:{
	 width: 24,
	 height: 24,
	 resizeMode: 'contain',
	 marginTop: 5
 },
 listDistance: {
	 width: 65,
	 textAlign: 'center',
	 fontFamily: 'Nunito Sans',
 },
 listTitleContainer:{
	 flex:1,
	 marginLeft: 20,
	 marginRight: 20,
 },
 listTitle: {
	 color:'black',
	 marginBottom: 5,
	 fontFamily: 'Nunito Sans',
	 fontWeight:'bold',
 },
 listSubtitle: {
	 color:'black',
	 fontFamily: 'Nunito Sans'
 },
 listTitleInactive: {
	 color:'rgb(119, 119, 119)',
	 marginBottom: 5,
	 fontFamily: 'Nunito Sans',
	 fontWeight:'bold',
 },
 listSubtitleInactive: {
	 color:'rgb(119, 119, 119)',
	 fontFamily: 'Nunito Sans',
 },
 listDistanceInactive: {
	 width: 65,
	 textAlign: 'center',
	 fontFamily: 'Nunito Sans',
	 color:'rgb(119, 119, 119)',
 }
});