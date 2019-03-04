import _Login from './Login'

import { goToLastScreen, resetToLanding } from "../../actions/navigation_actions";
import { loginAndFetchData, testLogin, initiateGuestMode, sendForgetPasswordEmail } from "../../actions/session_actions"
import { clearToasts } from "../../actions/app_actions";
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
	loginErrorType: state.session.authErrorType,
	showToast: state.app.showToast
})

const mapDispatchToProps = (dispatch) => ({
	login: (loginParams) => {dispatch(loginAndFetchData(loginParams))},
	testLogin: () => {dispatch(testLogin())},
	goBack: () => {dispatch(goBack())},
	resetToLanding: () => {dispatch(resetToLanding())},
	initiateGuestMode: () => {dispatch(initiateGuestMode())},
	sendForgetPasswordEmail: (emailAddress) => {dispatch(sendForgetPasswordEmail(emailAddress))},
	clearToasts: () => {dispatch(clearToasts())}
})

export const Login = connect(
	mapStateToProps,
	mapDispatchToProps
)(_Login)
