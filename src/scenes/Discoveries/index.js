import _DiscoveryList from './DiscoveryList';
import _DiscoveryDetail from './DiscoveryDetail'

import {setCurrentDetailItem, clearToasts, getDiscoveries} from "../../actions/app_actions";
import { navigateTo, goBack, resetToLogin, resetToRegistration } from "../../actions/navigation_actions";
import {connect} from 'react-redux';

const mapStateToDiscoveryListProps = state => ({
	isLoading: state.session.isLoading,
	currentUser: state.session.currentUser,
	guest: state.session.guest,
	discoveries: state.app.discoveries,
	error: state.app.error,
	currentDiscovery: state.app.currentDetailItem,
	showToast: state.app.showToast
})


const mapDispatchToDiscoveryListProps = (dispatch) => ({
	getDiscoveries: () => (dispatch(getDiscoveries())),
	setCurrentDiscovery: (detailItem) => {dispatch(setCurrentDetailItem(detailItem))},
	navigateToDiscoveryDetail: () => {dispatch(navigateTo("discoveryDetail"))},
	clearToasts: () => {dispatch(clearToasts())},
	goBack: () => {dispatch(goBack())},
	resetToRegistration: () => {dispatch(resetToRegistration())},
	resetToLogin: () => {dispatch(resetToLogin())},
	navigateToOffers: () => {dispatch(navigateTo("offers"))}
})

export const DiscoveryList = connect(
	mapStateToDiscoveryListProps,
	mapDispatchToDiscoveryListProps
)(_DiscoveryList)

export const DiscoveryDetail = connect(
	mapStateToDiscoveryListProps,
	mapDispatchToDiscoveryListProps
)(_DiscoveryDetail)