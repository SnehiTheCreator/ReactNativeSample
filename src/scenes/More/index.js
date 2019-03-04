import _MoreMenu from './MoreMenu';
import _Profile from './Profile';
import _ChangePassword from './ChangePassword';
import _ProfileStatusForm from '../Registration/StatusForm'
import _ProfileAffiliationForm from '../Registration/AffiliationForm'
import _ProfileConnect from '../Registration/Connect'
import {About as _About} from './About';
import {connect} from 'react-redux';

import {
	navigateTo, resetToRegistration, resetToLogin, resetToContent, goBack } from "../../actions/navigation_actions";
import { logout, changePassword, updateRegistration, fetchPartners, changeRegistration } from "../../actions/session_actions";
import {clearToasts} from "../../actions/app_actions";

const mapStateToProps = state => ({
	currentUser: state.session.currentUser,
	guest: state.session.guest,
	error: state.app.error,
	partners: state.session.partners,
	showToast: state.app.showToast,
	registration: state.session.registration,
	authErrorType: state.session.authErrorType
})

const mapDispatchToProps = (dispatch) => ({
	goBack: () => {dispatch(goBack())},
	navigateToAbout: () => {dispatch(navigateTo('about'))},
	navigateToProfile: () => {dispatch(navigateTo('profile'))},
	navigateToChangePassword: () => {dispatch(navigateTo('changePassword'))},
	navigateToOffers: () => {dispatch(navigateTo("offers"))},
	resetToRegistration: () => {dispatch(resetToRegistration())},
	resetToLogin: () => {dispatch(resetToLogin())},
	resetToContent: () => {dispatch(resetToContent())},
	logout: () => {dispatch(logout())},
	changePassword: (oldPassword, newPassword) => {dispatch(changePassword(oldPassword, newPassword))},
	clearToasts: () => {dispatch(clearToasts())},
//	the following functions are for being able to re use the status and affilations form from registration for editing
//	the components use the same prop keys in registration with slightly different navigation functions as values
	navigateToStatusForm: () => {dispatch(navigateTo("profileStatusForm"))},
	navigateToAffiliationForm: () => {dispatch(navigateTo("profileAffiliationForm", {edit: true}))},
	navigateToConnect: () => {dispatch(navigateTo("profileConnect"))},
	affiliationFormComplete: (userParams) => {dispatch(changeRegistration(userParams))},
	updateRegistration: (userParams) => {dispatch(updateRegistration(userParams))},
	fetchPartners: () => (dispatch(fetchPartners())),
	changeRegistration: (userParams, emailChange) => {dispatch(changeRegistration(userParams, emailChange))}
})

export const MoreMenu = connect(
	mapStateToProps,
	mapDispatchToProps
)(_MoreMenu)

export const Profile = connect(
	mapStateToProps,
	mapDispatchToProps
)(_Profile)

export const ChangePassword = connect(
	mapStateToProps,
	mapDispatchToProps
)(_ChangePassword)

export const About = connect(
	mapStateToProps,
	mapDispatchToProps
)(_About)

export const ProfileStatusForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(_ProfileStatusForm)

export const ProfileAffiliationForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(_ProfileAffiliationForm)


export const ProfileConnect = connect(
	mapStateToProps,
	mapDispatchToProps
)(_ProfileConnect)