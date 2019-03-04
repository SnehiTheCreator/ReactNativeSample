import _MidtownMap from './MidtownMap';

import {getOffers, setCurrentDetailItem} from "../../actions/app_actions";
import { navigateTo, goBack, resetToLogin, resetToRegistration } from "../../actions/navigation_actions";
import {connect} from 'react-redux';

const mapStateToOfferListProps = state => ({
	isLoading: state.session.isLoading,
	currentUser: state.session.currentUser,
	guest: state.session.guest,
	offers: state.app.offers,
	discoveries: state.app.discoveries,
	error: state.app.error,
	currentOffer: state.app.currentOffer,
	showToast: state.app.showToast
})


const mapDispatchToOfferListProps = (dispatch) => ({
	getOffers: () => (dispatch(getOffers())),
	setCurrentDetailItem: (item) => {dispatch(setCurrentDetailItem(item))},
	navigateToOfferDetail: () => {dispatch(navigateTo("mapOfferDetail"))},
	navigateToDiscoveryDetail: () => {dispatch(navigateTo("mapDiscoveryDetail"))},
	clearToasts: () => {dispatch(clearToasts())},
	goBack: () => {dispatch(goBack())},
	resetToRegistration: () => {dispatch(resetToRegistration())},
	resetToLogin: () => {dispatch(resetToLogin())},
	navigateToOffers: () => {dispatch(navigateTo("offers"))}
})

export const MidtownMap = connect(
	mapStateToOfferListProps,
	mapDispatchToOfferListProps
)(_MidtownMap)