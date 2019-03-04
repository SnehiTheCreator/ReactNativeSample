import { AsyncStorage, PermissionsAndroid, Platform } from 'react-native';
import { authentication } from '../services';
import { resetToContent, resetToLanding, navigateTo, systemError, popTo } from "./navigation_actions";
import {showToast, getOffers, getDiscoveries, getCurrentLocation} from "./app_actions";
import {toastIds, authErrorTypes} from "../util/values";
import { app as firebase } from '../firebase';

export const sessionActions = {
  RETRIEVE_USER: "RETRIEVE_USER",
  RECEIVE_USER: "RECEIVE_USER",
  UPDATE_LOADING: "UPDATE_LOADING",
  RECEIVE_PARTNERS: "RECEIVE_PARTNERS",
  UPDATE_REGISTRATION: "UPDATE_REGISTRATION",
	CLEAR_NEXT_ROUTE: "CLEAR_NEXT_ROUTE",
	CLEAR_CURRENT_USER: "CLEAR_CURRENT_USER",
	AUTH_ERROR: "AUTH_ERROR",
	GUEST_MODE: "GUEST_MODE"
}

export const receiveUser = (user) => ({
  type: sessionActions.RECEIVE_USER,
  user
})

export const updateLoading = (isLoading) => ({
  type: sessionActions.UPDATE_LOADING,
  isLoading
})

export const receivePartners = partners => ({
  type: sessionActions.RECEIVE_PARTNERS,
  partners
})

export const clearCurrentUser = () => ({
	type: sessionActions.CLEAR_CURRENT_USER
})

export const authError = (authErrorType) => ({
	type: sessionActions.AUTH_ERROR,
	authErrorType
})

export const fetchPartners = () => (
  dispatch => (
		authentication.getPartners()
			.then((response) => {
				dispatch(receivePartners(response.data.citylight_member))
				return response;
			})
			.catch((error) => {
				return Promise.reject(error);
			})
  )
);

export const guestMode = () => ({
	type: sessionActions.GUEST_MODE
})

export const initialize = () => (
  dispatch => {
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				let location;
				dispatch(updateLoading(true))
				return fetchUser(user.email)
					.then(currentUser => (
						dispatch(receiveUser(currentUser))
					))
					.then(() => (
						getCurrentLocation()
					))
					.then(position => {
						location = position;
						if (position) {
							location = position
						}
					})
					.catch((error) => {
					})
					.then(() => (
						dispatch(getOffers(location))
					))
					.then(() => (
						dispatch(getDiscoveries(location))
					))
					.then(() => (
						dispatch(fetchPartners())
					))
					.then(() => {
						dispatch(resetToContent());
					})
					.catch((error) => {
						if (!(error.type === "connectivity")) {
							dispatch(systemError());
						}
					})
			} else {
				dispatch(fetchPartners())
					.then(() => {
						dispatch(resetToLanding());
					})
					.catch((error) => {
						if (!(error.type === "connectivity")) {
							dispatch(systemError());
						}
					})
			}
		})
		
		return Promise.resolve()
	}
)


const submitFirebaseRegistration = (email, password) => {
	return new Promise((resolve, reject) => {
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function(userCredential) {
			return resolve()
		}, function(error) {
			return reject(error)
		})
	})
}

export const submitRegistrationAndFetchData = (userParams) => (
	//submit registration through api call, then fetch offers and discoveries data, then navigate to content
  dispatch => {
  	authentication.submitRegistration(userParams)
				.then((response) => {
					if (typeof response.data !== 'string' && response.data.citylight_contact) {
						let userId = response.data.citylight_contact[0].ctid;
						let user = createUserObject(userId, userParams);
						
						// if successfully registered, save to local storage and enter the app
						AsyncStorage.setItem('MAuser', JSON.stringify(user));
						AsyncStorage.setItem('MAanalyticsId', userId);
						AsyncStorage.setItem('MAredeemedOffers', JSON.stringify([]));
						
						dispatch(receiveUser(user));
						dispatch(showToast(toastIds.REGISTRATION_TOAST_ID))
					} else {
						return Promise.reject(response.data)
					}
				})
				.then(() => (submitFirebaseRegistration(userParams.ctemailaddress, userParams.userPassword)))
				.catch((error) => {
					dispatch(systemError())
				})
				.done()
	}
)

export const updateRegistration = (userParams) => ({
  type: sessionActions.UPDATE_REGISTRATION,
  userParams
})

const firebaseLogin = (email, password) => {
	return new Promise((resolve, reject) => {
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(userCredential) {
			return resolve()
		}, function(error) {
			return reject(error)
		})
	})
}

const fetchUser = (email) => (
	authentication.fetchUserInfo(email)
		.then((response) => {
			if (response.data.citylight_contact) {
				let currentUser;
				if (Array.isArray(response.data.citylight_contact)) {
					currentUser = response.data.citylight_contact[response.data.citylight_contact.length - 1];
				} else {
					currentUser = response.data.citylight_contact
				}
				AsyncStorage.setItem('MAuser', JSON.stringify(currentUser));
				AsyncStorage.setItem('MAanalyticsId', currentUser.ctid);
				return Promise.resolve(currentUser);
			} else {
				return Promise.reject("user info not found");
			}
		})
)

export const loginAndFetchData = (loginParams) => (
	dispatch => {
		dispatch(updateLoading(true))
		return firebaseLogin(loginParams.userEmail, loginParams.userPassword)
			.then(() => {
				return fetchUser(loginParams.userEmail)
			})
			.then((currentUser) => {
				return dispatch(receiveUser(currentUser))
			})
			.catch((error) => {
				if (error && error.code) {
					//using Object.assign to make sure that that redux knows that the login error has updated
					// since the authErrorTypes are a single object and you can get that same object twice as a login error
					if (error.code === authErrorTypes.USERNAME.code || error.code.includes("user")) {
						dispatch(authError(authErrorTypes.USERNAME.code))
						dispatch(updateLoading(false))
						dispatch(popTo('login'))
					} else if (error.code === authErrorTypes.PASSWORD.code || error.code.includes("password")) {
						dispatch(authError(authErrorTypes.PASSWORD.code))
						dispatch(updateLoading(false))
						dispatch(popTo('login'))
					} else {
						if (!(error.type === "connectivity")) {
							dispatch(systemError());
						}
					}
				} else {
					if (!error || (error && !(error.type === "connectivity"))) {
						dispatch(systemError());
					}
				}
			})
			.done()
	}
)


export const testLogin = () => {
	return dispatch => {
		dispatch(getDiscoveries())
			.then(() => {
				return dispatch(getOffers())
			})
			.then(() => {
				dispatch(resetToContent());
			})
	}
}

export const logout = () => (
	dispatch => {
		firebase.auth().signOut()
			.then(() => {
				dispatch(resetToLanding())
				dispatch(clearCurrentUser())
			})
			.catch((error) => {
				dispatch(systemError());
			})
	}
)

export const changePassword = (oldPassword, newPassword) => {
	let user = firebase.auth().currentUser;
	return dispatch => {
		user.updatePassword(newPassword)
				.then(() => {
					dispatch(navigateTo("profile"));
					dispatch(showToast(toastIds.CHANGE_PASSWORD_TOAST_ID));
				})
				.catch((error) => {
					if (error && error.code && error.code === authErrorTypes.REAUTHENTICATE.code) {
						dispatch(authError(authErrorTypes.REAUTHENTICATE.code));
						dispatch(navigateTo("changePassword"));
					} else {
						dispatch(systemError());
					}
				})
	}
}

export const changeEmail = (newEmail) => {
	let user = firebase.auth().currentUser;
	return user.updateEmail(newEmail)
					 .then(() => {
					 	
						 return Promise.resolve();
					 })
					 .catch((error) => {
					 	
						 return Promise.resolve(error);
					 })
}

export const sendForgetPasswordEmail = (emailAddress) => (
	dispatch => {
		firebase.auth().sendPasswordResetEmail(emailAddress)
			.then(() => {
				dispatch(showToast(toastIds.FORGOT_PASSWORD_TOAST_ID));
			})
			.catch((error) => {
				dispatch(systemError());
			})
	}
)

const updateCitylightInfo = (userParams, dispatch) => {
	authentication.updateRegistration(userParams)
		.then(response => {
			if (response.data.citylight_contact_update) {
				return Promise.resolve();
			} else {
				return Promise.reject(response)
			}
		})
		.then(() => {
			dispatch(receiveUser(userParams));
			dispatch(popTo('profile'));
			dispatch(showToast(toastIds.CONTACT_UPDATED_TOAST_ID))
		})
		.catch((error) => {
			if (!(error.type === "connectivity")) {
				dispatch(systemError());
			}
		})
		.done()
}

export const changeRegistration = (userParams, emailChange) => (
	dispatch => {
		if (emailChange) {
			changeEmail(userParams.ctemailaddress)
				.then((response) => {
					if (response && response.code && response.code === authErrorTypes.REAUTHENTICATE.code) {
						dispatch(authError(authErrorTypes.REAUTHENTICATE.code));
					} else {
						updateCitylightInfo(userParams, dispatch)
					}
				})
		} else {
			updateCitylightInfo(userParams, dispatch)
		}
	}
)

export const initiateGuestMode = () => (
	dispatch => {
		dispatch(guestMode());
		dispatch(updateLoading(true));
		let location;
        return getCurrentLocation()
            .then(position => {
                location = position;
            })
            .catch(error => {
                console.log('location error')
            })
            .then(() => (
                dispatch(getOffers(location))
            ))
            .then(() => (
                dispatch(getDiscoveries(location))
            ))
            .then(() => {
                dispatch(resetToContent());
            })
	}
);

const createUserObject = (ctid, userParams) => ({
	ctid,
	ctemailaddress: userParams.ctemailaddress,
	ctfirm: userParams.ctfirm,
	ctstatus: userParams.ctstatus,
	ctzip: userParams.ctzip
})
