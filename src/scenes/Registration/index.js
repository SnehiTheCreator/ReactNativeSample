import _Register1 from './Register1'
import _StatusForm from './StatusForm'
import _AffiliationForm from './AffiliationForm'
import _Password from './Password'
import _Connect from './Connect'
import _LocationPermission from './LocationPermission'

import {submitRegistrationAndFetchData, updateRegistration, initiateGuestMode} from "../../actions/session_actions";
import { navigateTo, resetToLanding, goBack } from "../../actions/navigation_actions";
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  isLoading: state.session.isLoading,
  partners: state.session.partners,
  registration: state.session.registration,
	currentUser: state.session.currentUser
})

const mapDispatchToProps = (dispatch) => ({
	initiateGuestMode: () => {dispatch(initiateGuestMode())},
  updateRegistration: (userParams) => {dispatch(updateRegistration(userParams))},
	submitRegistrationAndFetchData: (userParams) => { return dispatch(submitRegistrationAndFetchData(userParams))},
  navigateToStatusForm: () => {dispatch(navigateTo("statusForm"))},
  navigateToAffiliationForm: () => {dispatch(navigateTo("affiliationForm"))},
	navigateToConnect: () => {dispatch(navigateTo("connect"))},
	affiliationFormComplete: () => {dispatch(navigateTo("password"))},
	navigateToLocationPermission: () => {dispatch(navigateTo("locationPermission"))},
	goBack: () => {dispatch(goBack())},
	resetToLanding: () => {dispatch(resetToLanding())}
})

export const Register1 = connect(
  mapStateToProps,
  mapDispatchToProps
)(_Register1)

export const StatusForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(_StatusForm)

export const AffiliationForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(_AffiliationForm)

export const Password = connect(
	mapStateToProps,
	mapDispatchToProps
)(_Password)

export const Connect = connect(
	mapStateToProps,
	mapDispatchToProps
)(_Connect)

export const LocationPermission = connect(
	mapStateToProps,
	mapDispatchToProps
)(_LocationPermission)