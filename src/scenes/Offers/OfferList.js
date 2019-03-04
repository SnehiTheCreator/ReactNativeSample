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


import {toastIds, OfferCategories} from "../../util/values";
import { Toolbar, SearchActionBar } from "../../components/widgets";
import SuccessBanner from "../../components/modals/SuccessBanner";
import { GuestBanner } from "../../components/modals/GuestBanner";
import FilterModal from "../../components/modals/FilterModal"
import { Actions } from 'react-native-router-flux';
import { analytics } from '../../services/index';
import { textStyles } from "../../../styles";
import { data, location } from '../../util/index';

import {
  checkmarkRedeemed,
  iconBlank,
  iconEmojiSystem,
} from '../../../assets/index';

const REGISTRATION_SUCCESS_TEXT = "You're in! Start exploring Midtown.";
const REDEMPTION_SUCCESS_TEXT = "Hooray! Offer Redeemed.";

/**
Screen responsible for fetching, processing, and displaying list of current offers
**/

export default class OfferList extends Component {

  state = {
    userLat: null,
    userLong: null,
    modalVisible: false,
    redemptionSuccessBannerVisible: false,
		registrationSuccessBannerVisible: false,
    filterModalVisible: false,
		// initialize data for category filter
		offerCategoryInfo: Object.keys(OfferCategories).map(category => (OfferCategories[category])),
    filters: null,
    data: [],
    search: ""
  };
  
  static onEnter = () => {
		analytics.reportScreenViewToGoogleAnalytics('OfferList');
	}
  
  componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', () => this.androidBackPress() );
		if (this.props.offers){
			this.getOffersCallback(this.props.offers);
    }
		
		//showToast ids clesred once modal is dismissed by hideConfirmationModal which is passes to the modal
		this.showConfirmationToast(this.props.showToast);
  }
  
  componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', () => this.androidBackPress() );
  }
  
  androidBackPress = () => {
    BackHandler.exitApp();
    return false;
  }
  
  handleSearchChange = (search) => {
    this.setState({search: search.toLowerCase()}, this.filterData);
  }
  
  getOfferCategories(offers) {
		//Gets a list of groups/categories from all the offers
		let categories = {};
		offers.forEach(offer => {
			if (offer.listIcon) {
				let category = offer.listIcon;
				categories[category] = true;
			}
		})
  
		return Object.keys(categories).filter(category => (categories[category]));
	}

  render() {
    let registrationSuccessBanner = (
      <SuccessBanner
        id={toastIds.REGISTRATION_TOAST_ID}
        hideConfirmationModal={this.hideConfirmationModal}
        modalText={REGISTRATION_SUCCESS_TEXT} />
    )
    
    let redemptionSuccessBanner = (
      <SuccessBanner
        modalVisible={this.state.redemptionSuccessBannerVisible}
        id={toastIds.REDEMPTION_TOAST_ID}
        hideConfirmationModal={this.hideConfirmationModal}
        modalText={REDEMPTION_SUCCESS_TEXT} />
    )
    
    let guestBanner = (
      <GuestBanner
        goToRegistration={this.props.resetToRegistration}
        goToLogin={this.props.resetToLogin} />
    )
    
    let NoOffersMessageComponent = (
      <Text style={textStyles.headerTitle}>
        {this.state.search ? "No matching offers" : "No offers"}
      </Text>
    )
    
     return (
       <View style={{flex: 1}}>
        <Toolbar title={"Offers"} back={false}/>
         <SearchActionBar
            handleSearchChange={this.handleSearchChange}
            handleActionButtonPress={this.openFilterModal}
            actionButtonText={"Filter"} />
         {this.props.guest ? guestBanner : null}
         <FlatList
           data={this.state.data}
           contentContainerStyle={[ { flexGrow: 1 } , this.state.data.length ? null : { justifyContent: 'center'}]}
           renderItem={this.renderRow}
           keyExtractor={item => item.uid}
           showsVerticalScrollIndicator={false}
           ListEmptyComponent={NoOffersMessageComponent} />
         <FilterModal
           modalVisible={this.state.filterModalVisible}
           categoryGroups={[{title: "Offers", data: this.state.offerCategoryInfo}]}
           headers={false}
           filterState={{"Offers": this.state.filters}}
           applyFilter={this.applyCategoryFilters}
           close={this.closeFilterModal}/>
         {this.state.redemptionSuccessBannerVisible ? redemptionSuccessBanner : null}
         {this.state.registrationSuccessBannerVisible ? registrationSuccessBanner : null}
      </View>
    );
  }
  
  selectOffer = (deal) => (
    () => {
      this.props.setCurrentOffer(deal);
      this.props.navigateToOfferDetail();
    }
  )

  //render each listview row with an API call response entry
  renderRow = ({item}) => {
    let distanceText = '';
    if(!data.isEmpty(item.metersaway)) {
      distanceText = location.distanceAway(item.metersaway);
    }
    if(item.isRedeemed) {
      return(
        <TouchableOpacity
          onPress= { this.selectOffer(item) } >
          <View style={styles.listRow}>
            <Image source={checkmarkRedeemed} style={styles.listIcon} />
            <View style={styles.listTitleContainer}>
              <Text style={styles.listTitleInactive} ellipseMode={'tail'} numberOfLines={1} >{item.citylight_point.label}</Text>
              <Text style={styles.listSubtitleInactive}>{item.label}</Text>
            </View>

            <Text style={styles.listDistanceInactive}>{distanceText}</Text>
  
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress= { this.selectOffer(item) } >
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
  }

  getDealIcon = (category) => {
    let categoryInfo = OfferCategories[category];
    return categoryInfo ? categoryInfo.icon : iconBlank;
  }
  
  showConfirmationToast = (id) => {
    setTimeout( () => {
      if(id == toastIds.REGISTRATION_TOAST_ID) {
        this.setState({
          registrationSuccessBannerVisible: true
        });
      }
      else if(id == toastIds.REDEMPTION_TOAST_ID) {
        this.setState({
          redemptionSuccessBannerVisible: true
        });
      } else {
        return;
      }
    }, 300);
  }
  
  hideConfirmationModal = (id) => {
    this.setState({
        registrationSuccessBannerVisible: false,
        redemptionSuccessBannerVisible: false
      }, this.props.clearToasts);
  }
  
  applyCategoryFilters = (filterState) => {
    this.setState({
      filterModalVisible: false,
      filters: filterState['Offers']
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
		let filteredResults = [...this.props.offers];
		if (this.state.filters && this.anyFiltersApplied(this.state.filters)) {
			filteredResults = filteredResults.filter(item => {
				let category = item.listIcon
				return this.state.filters[category];
			})
    }
    
    let searchStr = this.state.search.trim();
    if (searchStr.length > 0) {
			filteredResults = filteredResults.filter(item => {
				
				let title = data.isEmpty(item.citylight_point.label) ? "" : item.citylight_point.label.toLowerCase();
				let label = data.isEmpty(item.label) ? "" : item.label.toLowerCase();
				let description = data.isEmpty(item.offer_text) ? "" : item.offer_text.toLowerCase();
				
				let titleMatch =  new RegExp(searchStr.toLowerCase()).test(title);
				let labelMatch = new RegExp(searchStr.toLowerCase()).test(label);
				let descriptionMatch =  new RegExp(searchStr.toLowerCase()).test(description);
				
				return (titleMatch || labelMatch || descriptionMatch)
			})
    }
    
    this.setState({data: filteredResults});
  }

  getOffersCallback = (offersData) => {
		offerCategoryInfo = this.getOfferCategories(offersData).map(category => (OfferCategories[category]));
			this.setState({
      data: offersData,
      offerCategoryInfo
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