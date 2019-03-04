import { appActions } from "../actions/app_actions";
import { sessionActions } from "../actions/session_actions";
import { toastIds } from "../util/values";

const appReducer = (state = {}, action) => {
  switch (action.type) {
	case appActions.RECEIVE_OFFERS:
		return {...state, offers: action.offers};
	
	case appActions.RECEIVE_DISCOVERIES:
		return {...state, discoveries: action.discoveries};
	  
	case appActions.RECEIVE_CURRENT_LOCATION:
	  return {...state, currentLocation: action.position};
	  
	case appActions.SET_CURRENT_DETAIL_ITEM:
	  return {...state, currentDetailItem: action.detailItem};
	  
	case appActions.OFFER_REDEEMED:
		let offers = [...state.offers]
		let redeemedOffer = offers.find((offer) => (offer.uid === action.offerId));
		redeemedOffer.isRedeemed = true;
		return {...state, offers}

	case appActions.SHOW_TOAST:
	  return {...state, showToast: action.toastId};
	  
	case appActions.CLEAR_MODALS:
	  return {...state, showToast: null};
	default:
	  return state
  }
}

export default appReducer;