import {
  AsyncStorage
} from 'react-native';

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge';

const ANALYTICS_ID = 'UA-88594305-1';


async function reportRedemptionToGoogleAnalytics(eventType, deal) {
  let tracker = new GoogleAnalyticsTracker(ANALYTICS_ID);

  try {
    var userId = await AsyncStorage.getItem('MAanalyticsId');
    var userData = await AsyncStorage.getItem('MAuser');
    var userObject = JSON.parse(userData);

    if (userId != null && userData != null){
      tracker.setUser(userId);
      tracker.trackEvent(eventType, deal.citylight_point.label, {label: deal.label, value: parseInt(deal.uid)});

      tracker.trackPurchaseEvent({
        id: deal.uid.toString(),
        name: deal.label,
        category: deal.listIcon,
        brand: deal.citylight_point.label,
        variant: deal.offer_type,
        price: 0.0,
        quantity: 1.0,
        couponCode: deal.offer_redemption_code
      }, {
        id: userObject.ctstatus,
        affiliation: userObject.ctfirm,
        revenue: 0.0,
        tax: 0.0,
        shipping: 0.0,
        couponCode: ""
      }, 'Ecommerce', eventType);
    }
  } catch (error) {
  
  }
}

async function reportScreenViewToGoogleAnalytics(screenType) {
  let tracker = new GoogleAnalyticsTracker(ANALYTICS_ID);
  try {
    var userId = await AsyncStorage.getItem('MAanalyticsId');
    if(userId != null) {
      tracker.setUser(userId);
      tracker.trackScreenView(screenType);
    }
  } catch (error) {
		console.log('tracking error');
  }
}

module.exports = {
  reportRedemptionToGoogleAnalytics: reportRedemptionToGoogleAnalytics,
  reportScreenViewToGoogleAnalytics: reportScreenViewToGoogleAnalytics
}
