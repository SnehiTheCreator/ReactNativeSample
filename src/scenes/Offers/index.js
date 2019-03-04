import _OfferList from './OfferList';
import _OfferDetail from './OfferDetail';
import _OfferRedemption from './OfferRedemption';

import {getOffers, setCurrentDetailItem, redeemOffer, clearToasts} from "../../actions/app_actions";
import { navigateTo, goBack, resetToLogin, resetToRegistration } from "../../actions/navigation_actions";
import {connect} from 'react-redux';

const mapStateToProps = state => ({
  isLoading: state.session.isLoading,
  currentUser: state.session.currentUser,
  guest: state.session.guest,
  offers: state.app.offers,
  error: state.app.error,
  currentOffer: state.app.currentDetailItem,
  showToast: state.app.showToast
})


const mapDispatchToProps = (dispatch) => ({
  getOffers: () => (dispatch(getOffers())),
  setCurrentOffer: (offer) => {dispatch(setCurrentDetailItem(offer))},
  navigateToOfferDetail: () => {dispatch(navigateTo("offerDetail"))},
  navigateToOfferRedemption: () => {dispatch(navigateTo("offerRedemption"))},
  redeemOffer: (offer) => (dispatch(redeemOffer(offer))),
  clearToasts: () => {dispatch(clearToasts())},
  goBack: () => {dispatch(goBack())},
  resetToRegistration: () => {dispatch(resetToRegistration())},
  resetToLogin: () => {dispatch(resetToLogin())}
})

export const OfferList = connect(
  mapStateToProps,
  mapDispatchToProps
)(_OfferList)

export const OfferDetail = connect(
  mapStateToProps,
  mapDispatchToProps
)(_OfferDetail)


export const OfferRedemption = connect(
  mapStateToProps,
  mapDispatchToProps
)(_OfferRedemption)