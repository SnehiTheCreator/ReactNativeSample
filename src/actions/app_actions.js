import { offers, discoveries, analytics } from '../services';
import { resetToContent } from "./navigation_actions";
import { updateLoading } from "./session_actions";
import {contentTypes, hasValidDiscoveryCategory, hasValidOfferCategory, sample, toastIds} from "../util/values";
import {PermissionsAndroid, Platform} from "react-native";

export const appActions = {
  RECEIVE_OFFERS: "RECEIVE_OFFERS",
	RECEIVE_DISCOVERIES: "RECEIVE_DISCOVERIES",
  RECEIVE_CURRENT_LOCATION: "RECEIVE_CURRENT_LOCATION",
  SET_CURRENT_DETAIL_ITEM: "SET_CURRENT_DETAIL_ITEM",
  OFFER_REDEEMED: "OFFER_REDEEMED",
  SHOW_TOAST: "SHOW_TOAST",
  CLEAR_MODALS: "CLEAR_MODALS"
};

export const receiveOffers = (offers) => ({
  type: appActions.RECEIVE_OFFERS,
  offers
});

export const receiveDiscoveries = (discoveries) => ({
	type: appActions.RECEIVE_DISCOVERIES,
	discoveries
});

export const receiveCurrentLocation = (position) => ({
  type: appActions.RECEIVE_CURRENT_LOCATION,
  position
});

export const setCurrentDetailItem = (detailItem) => ({
  type: appActions.SET_CURRENT_DETAIL_ITEM,
  detailItem
});

export const showToast = (toastId) => ({
  type: appActions.SHOW_TOAST,
  toastId
});

export const clearToasts = () => ({
  type: appActions.CLEAR_MODALS
});

export const setOfferRedeemed = (offerId) => ({
	type: appActions.OFFER_REDEEMED,
	offerId
});

export const getCurrentLocation = () => {
	if (Platform.OS === 'android') {
        return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
			.then(hasPermission => {
				if (hasPermission) {
					return new Promise((resolve, reject) => {
                        return navigator.geolocation.getCurrentPosition(
                            resolve,
                            reject,
                            {enableHighAccuracy: true, timeout: 5000}
                        )
                    });
				} else {
					return Promise.resolve();
				}
			})
	} else {
        return new Promise((resolve, reject) => {
            return navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {enableHighAccuracy: true, timeout: 5000}
            )
        });
	}
};

export const getOffers = (location) => (
	dispatch => {
		let redeemedOffers;
		return (
			offers.getRedeemedOffers()
			.then((alreadyRedeemedOffers) => {
				redeemedOffers = alreadyRedeemedOffers;
				if (location) {
					return offers.getCMSOffers(location.coords.latitude, location.coords.longitude)
				} else {
					return offers.getCMSOffers()
				}
			})
			.then(response => {
				let offers = processOfferData(response.data, redeemedOffers);
				dispatch(receiveOffers(offers));
				return offers
			})
			.catch(error => {
				return error;
			})
		)
	}
);

export const getDiscoveries = (location) => (
	dispatch => {
		let discoveryRequest;
		if (location) {
			discoveryRequest = discoveries.getDiscoveries(location.coords.latitude, location.coords.longitude);
		} else {
			discoveryRequest = discoveries.getDiscoveries();
		}
		return (
			discoveryRequest
				.then(response => {

					let discoveries = processDiscoveryData(response.data);
					dispatch(receiveDiscoveries(discoveries));
					return discoveries
				})
				.catch(error => {
					return error;
				})
		)
	}
);


export const redeemOffer = (offer) => (
  dispatch => (
		offers.reportRedemption(offer.uid)
					.then(() => {
						return offers.saveOfferRedemption(offer)
					})
					.then(() => {
						if (offer.limit_once_per_person == 1) {
							dispatch(setOfferRedeemed(offer.uid));
						}
						return Promise.resolve();
					})
					.then(() => {
						dispatch(showToast(toastIds.REDEMPTION_TOAST_ID));
						dispatch(resetToContent())
					})
					.catch((error) => {
					
					})
	)
);

const processOfferData = (responseData, redeemedOffers) => {
	const jsonData = responseData.citylight_deal;
	jsonData.forEach(function(element, i) {
		let current = element;

		current.contentType = contentTypes.OFFER;

		//set the correct icon based on the category
        if(current.citylight_groups && current.citylight_groups.group &&
			current.citylight_groups.group.grouplabel && hasValidOfferCategory(current.citylight_groups.group.grouplabel.toLowerCase())) {
            current.listIcon = current.citylight_groups.group.grouplabel.toLowerCase();
        } else {
            current.hide = true
        }
		//mark redeemed deals for appropriate styling
		if(redeemedOffers && redeemedOffers.length > 0) {
			if(redeemedOffers.includes(current.uid) && current.limit_once_per_person == 1) {
				current.isRedeemed = true;
			} else {
				current.isRedeemed = false;
			}
		} else {
			current.isRedeemed = false;
		}
	});

	// return only the offers that have a valid category
	return jsonData.filter(item => !item.hide);
};

const processDiscoveryData = (responseData) => {
	const jsonData = responseData.citylight_discovery;

	jsonData.forEach(function(element, i) {
		let current = element;
		current.contentType = contentTypes.DISCOVERY;

        //set the correct icon based on the category
        if(current.citylight_groups && current.citylight_groups.group &&
            current.citylight_groups.group.grouplabel && hasValidDiscoveryCategory(current.citylight_groups.group.grouplabel.toLowerCase())) {
            current.listIcon = current.citylight_groups.group.grouplabel.toLowerCase();
        } else {
            current.hide = true
        }
	});

    // return only the offers that have a valid category
    return jsonData.filter(item => !item.hide);
};


